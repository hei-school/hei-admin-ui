import {promotionsMock} from "../fixtures/api_mocks/promotions-mocks";

describe("Admin.StudentsResultOverviews", () => {
  beforeEach(() => {
    cy.mockLogin({role: "ADMIN"});
    cy.intercept("GET", "/promotions?page=1&page_size=10", promotionsMock).as(
      "getPromotions"
    );
    cy.getByTestid("promotions-menu").click();
    cy.getByTestid("students-result-overviews-menu").click();
    cy.wait("@getPromotions");
  });

  it("lists promotions without making the rows clickable", () => {
    cy.get("tbody tr").should("have.length", promotionsMock.length);
    cy.contains(promotionsMock[0].name).click();
    cy.url().should("include", "/students-result-overviews");
    cy.url().should("not.include", "/show");
  });

  it("shows an Afficher button per promotion, linking to its own result overviews", () => {
    promotionsMock.forEach((promotion) => {
      cy.get(
        `a[href="/promotions/${promotion.id}/show/students-result-overviews"]`
      ).should("exist");
    });
  });

  it("navigates to the result overviews of a promotion only through its Afficher button", () => {
    cy.intercept("GET", "/students/result_overviews?*", {data: []}).as(
      "getResultOverviews"
    );

    cy.get(
      `a[href="/promotions/${promotionsMock[0].id}/show/students-result-overviews"]`
    ).click();

    cy.wait("@getResultOverviews");
    cy.url().should(
      "include",
      `/promotions/${promotionsMock[0].id}/show/students-result-overviews`
    );
    cy.contains("Liste des sortants");
  });
});
