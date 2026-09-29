import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  documensoDocumentsMock,
  documensoPromotionsMock,
  documensoTemplatesMock,
  promotionL1Mock,
  templateL1Mock,
} from "../fixtures/api_mocks/documenso-mocks";

describe("Manager.Documenso", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});

    cy.intercept(
      "POST",
      "/documenso-templates/sync",
      documensoTemplatesMock
    ).as("syncTemplates");
    cy.intercept(
      "GET",
      "/documenso-templates?page=1&page_size=10",
      documensoTemplatesMock
    ).as("getTemplates");
    cy.intercept(
      "GET",
      "/promotions?page=1&page_size=10",
      documensoPromotionsMock
    ).as("getPromotions");
    cy.intercept(
      "GET",
      `/promotions/${promotionL1Mock.id}/documenso-documents?page=1&page_size=10`,
      documensoDocumentsMock
    ).as("getPromotionDocuments");

    cy.getByTestid("docs").click();
    cy.getByTestid("documenso-documents-menu").click();
  });

  it("reaches the templates without triggering a synchronisation", () => {
    cy.wait("@getTemplates");

    cy.getByTestid("documenso-sync-loader").should("not.exist");
    cy.get("table tbody tr").should(
      "have.length",
      documensoTemplatesMock.length
    );
    cy.get("@syncTemplates.all").should("have.length", 0);
  });

  it("reaches the documents of a promotion", () => {
    cy.wait("@getTemplates");
    cy.contains("td", templateL1Mock.title!).click();
    cy.wait("@getPromotions");

    cy.getByTestid("see-documenso-documents-button").click();
    cy.wait("@getPromotionDocuments");

    cy.get("table tbody tr").should(
      "have.length",
      documensoDocumentsMock.length
    );
  });
});
