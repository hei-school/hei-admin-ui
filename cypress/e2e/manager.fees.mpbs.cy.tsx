import {
  failedMpbs,
  feesMpbsMock,
  pendingMpbs,
  succeedMpbs1,
} from "../fixtures/api_mocks/fees-mocks";
import {advancedStats} from "../fixtures/api_mocks/fees-stats";

describe("Mobile payment by student", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
  });

  it("can list fees transactions", () => {
    cy.intercept("GET", `/fees?*`, {
      data: feesMpbsMock,
      statistics: {},
    }).as("getFees");
    cy.intercept("GET", `/fees/advanced-stats?month_from=*`, advancedStats).as(
      "getFeesStats"
    );
    cy.intercept("GET", `/fees?*`, {
      data: feesMpbsMock,
      statistics: {},
    }).as("getFees2");

    cy.get(`[href="/transactions"]`).click();

    cy.contains("Transactions (Mobile Money)");
    cy.contains("Référence de la transaction");
    cy.contains("Type de PSP");
    cy.contains("Statut");
  });

  it("shows success status icon when the status is SUCCESS", () => {
    cy.intercept("GET", `/fees?*`, {
      data: [succeedMpbs1],
    }).as("getFees");
    cy.intercept("GET", `/fees/advanced-stats?month_from=*`, advancedStats).as(
      "getFeesStats"
    );
    cy.intercept("GET", `/fees?*`, {
      data: [succeedMpbs1],
    }).as("getFees2");

    cy.get(`[href="/transactions"]`).click();

    cy.get('[data-testid="pspTypeIcon-student1_id--fee7_id"]').trigger(
      "mouseover"
    );

    cy.contains("Paiement avec succès");
  });

  it("shows pending status icon when the status is PENDING", () => {
    cy.intercept("GET", `/fees?*`, {
      data: [pendingMpbs],
    }).as("getFees");
    cy.intercept("GET", `/fees/advanced-stats?month_from=*`, advancedStats).as(
      "getFeesStats"
    );
    cy.intercept("GET", `/fees?*`, {
      data: [pendingMpbs],
    }).as("getFees2");

    cy.get(`[href="/transactions"]`).click();

    cy.get('[data-testid="pspTypeIcon-student1_id--fee7_id"]').trigger(
      "mouseover"
    );

    cy.contains("Vérification en cours");
  });

  it("shows failed status icon when the status is FAILED", () => {
    cy.intercept("GET", `/fees?*`, {
      data: [failedMpbs],
    }).as("getFees");
    cy.intercept("GET", `/fees/advanced-stats?month_from=*`, advancedStats).as(
      "getFeesStats"
    );
    cy.intercept("GET", `/fees?*`, {
      data: [failedMpbs],
    }).as("getFees2");

    cy.get(`[href="/transactions"]`).click();

    cy.get('[data-testid="pspTypeIcon-student1_id--fee7_id"]').trigger(
      "mouseover"
    );

    cy.contains("Paiement échoué");
  });
});
