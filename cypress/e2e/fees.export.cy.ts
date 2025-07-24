import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {advanceStatsMocks} from "../fixtures/api_mocks/advanceStats-mocks";
import {unpaidFeeMock} from "../fixtures/api_mocks/fees-mocks";

describe("Fees Export", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.visit("/fees");
    cy.intercept("GET", `advanced-stats**`, advanceStatsMocks).as(
      "getAdvancedStats"
    );
    cy.intercept("GET", `/fees**`, {data: [unpaidFeeMock]}).as("getFees");
    cy.intercept("GET", "/fees/raw?**", {
      statusCode: 200,
      headers: {
        "content-disposition": 'attachment; filename="fees.xlsx"',
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: Cypress.Buffer.from("Fake Excel content", "utf-8"),
    }).as("downloadExcel");
  });

  it("should open export dialog, select status, pick month, and export fees data", () => {
    cy.getByTestid("menu-list-action").click();
    cy.contains("Exporter").click();
    cy.contains("Exporter les frais au format XLSX").should("be.visible");

    cy.get('input[name="status"]').parent().click();
    cy.get("li[data-value]").first().click();

    cy.get('input[type="month"]').clear().type("2024-07");
    cy.get('input[type="month"]').should("have.value", "2024-07");
    cy.get("input[disabled]").eq(0).should("have.value", "01/07/2024");
    cy.get("input[disabled]").eq(1).should("have.value", "31/07/2024");
    cy.getByTestid("download-button").click();
    const downloadedFile = "cypress/downloads/Liste frais En retard.xlsx";
    cy.readFile(downloadedFile).should("exist");
  });

  it("should show error message on export failure", () => {
    cy.getByTestid("menu-list-action").click();
    cy.contains("Exporter").click();
    cy.contains("Exporter les frais au format XLSX").should("be.visible");

    cy.get('input[name="status"]').parent().click();
    cy.get("li[data-value]").first().click();

    cy.get('input[type="month"]').clear().type("2024-07");
    cy.get('input[type="month"]').should("have.value", "2024-07");
    cy.get("input[disabled]").eq(0).should("have.value", "01/07/2024");
    cy.get("input[disabled]").eq(1).should("have.value", "31/07/2024");

    cy.intercept("GET", "/fees/raw?**", {
      statusCode: 500,
      body: {},
    }).as("exportFeesError");
    cy.getByTestid("download-button").click();
    cy.wait("@exportFeesError");
    cy.contains(
      "Une erreur est survenue lors de l'exportation du fichier."
    ).should("be.visible");
  });
});
