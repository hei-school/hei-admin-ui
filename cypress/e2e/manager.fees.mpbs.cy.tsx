import {
  failedMpbs,
  feesMpbsMock,
  pendingMpbs,
  succeedMpbs1,
} from "../fixtures/api_mocks/fees-mocks";

describe("Mobile payment by student", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
  });

  it("can list fees transactions", () => {
    cy.intercept("GET", `*/fees?page=1&page_size=10&isMpbs=true`, {
      data: feesMpbsMock,
      statistics: {},
    }).as("getFees");

    cy.get(`[href="#/transactions"]`).click();

    cy.contains("Transactions (Mobile Money)");
    cy.contains("Référence de la transaction");
    cy.contains("Type de PSP");
    cy.contains("Statut");
  });

  it("shows success status icon when the status is SUCCESS", () => {
    cy.intercept("GET", `*/fees?page=1&page_size=10&isMpbs=true`, {
      data: [succeedMpbs1],
    }).as("getFees");

    cy.get(`[href="#/transactions"]`).click();

    cy.get('[data-testid="pspTypeIcon-student1_id--fee7_id"]').trigger(
      "mouseover"
    );

    cy.contains("Paiement avec succès");
  });

  it("shows pending status icon when the status is PENDING", () => {
    cy.intercept("GET", `*/fees?page=1&page_size=10&isMpbs=true`, {
      data: [pendingMpbs],
    }).as("getFees");

    cy.get(`[href="#/transactions"]`).click();

    cy.get('[data-testid="pspTypeIcon-student1_id--fee7_id"]').trigger(
      "mouseover"
    );

    cy.contains("Vérification en cours");
  });

  it("shows failed status icon when the status is FAILED", () => {
    cy.intercept("GET", `*/fees?page=1&page_size=10&isMpbs=true`, {
      data: [failedMpbs],
    }).as("getFees");

    cy.get(`[href="#/transactions"]`).click();

    cy.get('[data-testid="pspTypeIcon-student1_id--fee7_id"]').trigger(
      "mouseover"
    );

    cy.contains("Paiement échoué");
  });
});
