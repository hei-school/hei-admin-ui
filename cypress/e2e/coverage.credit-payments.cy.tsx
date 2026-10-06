import {
  CreditPayment,
  CreditPaymentTypeEnum,
  PaymentStatus,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {fee1Mock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {
  mockUnhandledRequests,
  navigateInApp,
} from "../support/coverage-navigation";

const EMPTY_TEXT = "Non défini.e";
const VALIDATE_URL = "/students/payments/validate";
const REJECT_URL = "/students/payments/reject";

const pendingPayment: CreditPayment = {
  id: "coverage_credit_pending_id",
  fee: {...fee1Mock, student_ref: student1Mock.ref},
  creation_datetime: new Date("2024-02-10T08:00:00Z"),
  type: CreditPaymentTypeEnum.MOBILE_MONEY,
  status: PaymentStatus.CREATED,
  amount: 70000,
  comment: "Crédit en attente (couverture)",
};

const rejectedPayment: CreditPayment = {
  id: "coverage_credit_rejected_id",
  fee: {...fee1Mock, student_ref: student1Mock.ref},
  creation_datetime: new Date("2024-02-01T08:00:00Z"),
  type: CreditPaymentTypeEnum.BANK_TRANSFER,
  status: PaymentStatus.INVALIDATE,
  amount: 40000,
  comment: "Crédit rejeté (couverture)",
  rejected_by_first_name: "Rova",
  rejected_by_last_name: "Gestionnaire",
  rejected_datetime: new Date("2024-02-02T09:00:00Z"),
  rejection_reason: "Virement introuvable",
};

const incompletePayment: CreditPayment = {
  id: "coverage_credit_incomplete_id",
  comment: "Crédit incomplet (couverture)",
};

const visitPendingCreditPayments = (payments: CreditPayment[]) => {
  mockUnhandledRequests();
  cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
  cy.intercept("GET", "/fees?page=*&page_size=500", {data: []});
  cy.intercept(
    "GET",
    `/students/credit-payments?status=${PaymentStatus.CREATED}&page=*&page_size=10`,
    payments
  ).as("getPendingCreditPayments");
  navigateInApp("/credit-payments");
  cy.wait("@getPendingCreditPayments");
};

const detailsDialog = () =>
  cy.contains('[role="dialog"]', "Détails du paiement par crédit");

const openDetails = (payment: CreditPayment) => {
  cy.contains("table tbody tr td", payment.comment!).click();
  detailsDialog().should("be.visible");
};

const receiptRow = (label: string) =>
  detailsDialog()
    .contains("p", new RegExp(`^${label}$`))
    .parent();

describe("Coverage - actions sur un paiement par crédit", () => {
  beforeEach(() => {
    visitPendingCreditPayments([pendingPayment]);
  });

  it("n'appelle pas l'API quand la validation est annulée", () => {
    cy.intercept("PATCH", VALIDATE_URL, cy.spy().as("validatePayment"));

    cy.getByTestid(`validate-payment-${pendingPayment.id}`).click();
    cy.contains('[role="dialog"]', "Valider le paiement")
      .find("button")
      .not(".ra-confirm")
      .click();

    cy.contains('[role="dialog"]', "Valider le paiement").should("not.exist");
    cy.get("@validatePayment").should("not.have.been.called");
    detailsDialog().should("not.exist");
  });

  it("signale l'échec de la validation", () => {
    cy.intercept("PATCH", VALIDATE_URL, {statusCode: 500, body: {}}).as(
      "validatePayment"
    );

    cy.getByTestid(`validate-payment-${pendingPayment.id}`).click();
    cy.contains('[role="dialog"]', "Valider le paiement")
      .find(".ra-confirm")
      .click();

    cy.wait("@validatePayment")
      .its("request.body")
      .should("deep.equal", [pendingPayment.id]);
    cy.contains(
      "Une erreur s'est produite lors de la validation du paiement."
    ).should("be.visible");
  });

  it("refuse un motif de rejet fait uniquement d'espaces", () => {
    cy.getByTestid(`reject-payment-${pendingPayment.id}`).click();
    cy.getByTestid("reject-payment-reason").type("   ");

    cy.contains("Le motif ne peut pas être vide.").should("be.visible");
    cy.getByTestid("reject-payment-confirm").should("be.disabled");
  });

  it("signale l'échec du rejet et envoie le motif sans espaces superflus", () => {
    cy.intercept("PATCH", REJECT_URL, {statusCode: 500, body: {}}).as(
      "rejectPayment"
    );

    cy.getByTestid(`reject-payment-${pendingPayment.id}`).click();
    cy.getByTestid("reject-payment-reason").type("  Montant erroné  ");
    cy.getByTestid("reject-payment-confirm").click();

    cy.wait("@rejectPayment")
      .its("request.body")
      .should("deep.equal", {
        payment_ids: [pendingPayment.id],
        reason: "Montant erroné",
      });
    cy.contains("Une erreur s'est produite lors du rejet du paiement.").should(
      "be.visible"
    );
    cy.contains("Rejeter le paiement").should("not.exist");
  });

  it("affiche le type mobile money dans les détails d'un paiement en attente", () => {
    openDetails(pendingPayment);

    receiptRow("Type").should("contain.text", "MOBILE MONEY");
    receiptRow("Validé par").should("contain.text", EMPTY_TEXT);
    detailsDialog().should("not.contain.text", "Rejeté par");
  });
});

describe("Coverage - détails d'un paiement par crédit", () => {
  it("affiche qui a rejeté le paiement, quand et pourquoi", () => {
    visitPendingCreditPayments([rejectedPayment]);
    openDetails(rejectedPayment);

    detailsDialog()
      .should("contain.text", "Paiement rejeté")
      .and("not.contain.text", "Validé par");
    receiptRow("Rejeté par").should("contain.text", "Rova Gestionnaire");
    receiptRow("Rejeté le").should("not.contain.text", EMPTY_TEXT);
    receiptRow("Motif du rejet").should(
      "contain.text",
      rejectedPayment.rejection_reason
    );
    receiptRow("Type").should("contain.text", "BANK_TRANSFER");
  });

  it("affiche des valeurs vides pour un rejet sans détail", () => {
    const rejectedWithoutDetails: CreditPayment = {
      ...rejectedPayment,
      id: "coverage_credit_rejected_bare_id",
      comment: "Rejet sans détail (couverture)",
      rejected_by_first_name: undefined,
      rejected_by_last_name: undefined,
      rejected_datetime: undefined,
      rejection_reason: undefined,
    };
    visitPendingCreditPayments([rejectedWithoutDetails]);
    openDetails(rejectedWithoutDetails);

    receiptRow("Rejeté par").should("contain.text", EMPTY_TEXT);
    receiptRow("Rejeté le").should("contain.text", EMPTY_TEXT);
    receiptRow("Motif du rejet").should("contain.text", EMPTY_TEXT);
  });

  it("affiche un paiement sans statut, montant, type, date ni frais", () => {
    visitPendingCreditPayments([incompletePayment]);

    cy.getByTestid(`validate-payment-${incompletePayment.id}`).should(
      "be.disabled"
    );
    cy.getByTestid(`reject-payment-${incompletePayment.id}`).should(
      "be.disabled"
    );
    openDetails(incompletePayment);

    receiptRow("Statut").should("contain.text", EMPTY_TEXT);
    receiptRow("Montant").should("contain.text", EMPTY_TEXT);
    receiptRow("Type").should("contain.text", EMPTY_TEXT);
    receiptRow("Date de paiement").should("contain.text", EMPTY_TEXT);
    detailsDialog().should("not.contain.text", "Frais concerné");
  });
});
