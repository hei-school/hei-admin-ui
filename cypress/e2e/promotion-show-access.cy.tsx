import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {promotion1Mock} from "../fixtures/api_mocks/promotions-mocks";

describe("PromotionShow.AccessControl", () => {
  beforeEach(() => {
    cy.intercept("GET", `/promotions/${promotion1Mock.id}`, promotion1Mock).as(
      "getPromotion1"
    );
  });

  it("shows the edit button for a manager", () => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.visit(`/promotions/${promotion1Mock.id}/show`, {
      onBeforeLoad: (win) => win.sessionStorage.setItem("ha_bearer", "mock"),
    });
    cy.wait("@getPromotion1");
    cy.getByTestid("edit-button").should("exist");
    cy.getByTestid("yearly-results-level-select").should("exist");
  });

  it("hides the edit button for a teacher", () => {
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
    cy.visit(`/promotions/${promotion1Mock.id}/show`, {
      onBeforeLoad: (win) => win.sessionStorage.setItem("ha_bearer", "mock"),
    });
    cy.wait("@getPromotion1");
    cy.getByTestid("edit-button").should("not.exist");
    cy.getByTestid("yearly-results-level-select").should("exist");
  });
});
