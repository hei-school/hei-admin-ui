import {
  PaymentStatus,
  PaymentTypeEnum,
} from "@haapi-b0fc7615/typescript-client";
import {
  creditPaymentPendingMock,
  creditPaymentRejectedMock,
  creditPaymentValidatedMock,
  creditPaymentsByStatusMock,
  studentCreditMock,
} from "../fixtures/api_mocks/credit-payments-mocks";
import {fee1Mock, feesMock} from "../fixtures/api_mocks/fees-mocks";
import {
  createPaymentMock,
  createPaymentWithAmountMock,
} from "../fixtures/api_mocks/payments-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const amount = 1 + Math.floor(Math.random() * 100_000);
const createPayment = createPaymentWithAmountMock(amount);

describe("Manager.Payments.Flow", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=*&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `/students?page=*&page_size=*&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept("GET", `/students/${student1Mock.id}/level`, "L1").as(
      "getStudentLevel"
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFees2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/credit`,
      studentCreditMock
    ).as("getStudentCredit");
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.wait("@getStudents");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
  });

  it("can show a fee's detail and its list of payments", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=*&page_size=10`,
      createPaymentMock(fee1Mock)
    ).as("getPayments");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.get("#main-content")
      .should("contain", `${fee1Mock.remaining_amount} Ar`)
      .and("contain", `${fee1Mock.total_amount} Ar`)
      .and("contain", fee1Mock.comment)
      .and("contain", "Paiements");
    cy.wait("@getPayments");
    cy.get("table").contains("Comment");
  });

  it("shows a fee as in progress on its details page when its credit payment is awaiting validation", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    // Separate from the "getFees"/"getFees2" (page_size=10) aliases above:
    // the pending-credit-payment check fetches the student's fees on its own.
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=100`,
      feesMock
    ).as("getFeesForPendingCheck");
    // The data provider always probes the next page too, to know whether
    // there's more to paginate through.
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=100`,
      feesMock
    ).as("getFeesForPendingCheck2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=*&page_size=*`,
      [
        {
          id: "credit_payment_pending_id",
          fee_id: fee1Mock.id,
          type: PaymentTypeEnum.CREDIT,
          status: PaymentStatus.CREATED,
          amount: 100000,
          comment: "Paiement par crédit",
        },
      ]
    ).as("getFee1PendingPayment");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.wait("@getFee1PendingPayment");
    cy.contains("En cours de vérification");
    cy.contains("En retard").should("not.exist");
  });

  it("can create a cash payment for a fee", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=*&page_size=10`,
      []
    ).as("getPayments");
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments`,
      [createPayment]
    ).as("createPayment");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.wait("@getPayments");
    cy.contains("Créer").click();
    cy.wait("@getStudentCredit");
    cy.get("#type_CASH").click();
    cy.get("#amount").click().type(createPayment.amount!.toString());
    cy.get("#comment").click().type(createPayment.comment!);
    cy.contains("Enregistrer").click();
    cy.wait("@createPayment");
    cy.contains("Élément créé");
  });

  it("can create a credit payment for a fee within the student's credit", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=*&page_size=10`,
      []
    ).as("getPayments");
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments`,
      [creditPaymentValidatedMock]
    ).as("createCreditPayment");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.wait("@getPayments");
    cy.contains("Créer").click();
    cy.wait("@getStudentCredit");
    cy.get("#type_CREDIT").click();
    cy.get("#amount").click().type("100000");
    cy.contains("Enregistrer").click();
    cy.wait("@createCreditPayment");
    cy.contains("Élément créé");
  });

  it("cannot create a credit payment exceeding the student's credit", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=*&page_size=10`,
      []
    ).as("getPayments");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.wait("@getPayments");
    cy.contains("Créer").click();
    cy.wait("@getStudentCredit");
    cy.get("#type_CREDIT").click();
    cy.get("#amount")
      .click()
      .type((studentCreditMock.amount + 1).toString());
    cy.contains("Enregistrer").click();
    cy.contains("Le montant saisi est supérieur à votre crédit actuel.");
  });

  it("cannot create a credit payment when the student's credit is below the minimum", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=*&page_size=10`,
      []
    ).as("getPayments");
    cy.intercept("GET", `/students/${student1Mock.id}/credit`, {
      ...studentCreditMock,
      amount: 50000,
    }).as("getLowStudentCredit");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.wait("@getPayments");
    cy.contains("Créer").click();
    cy.wait("@getLowStudentCredit");
    cy.get("#type_CREDIT").click();
    cy.get("#amount").click().type("10000");
    cy.contains("Enregistrer").click();
    cy.contains("Votre crédit est inférieur à 60000Ar.");
  });
});

describe("Manager.CreditPayments", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/fees?page=*&page_size=500`, {
      data: [{...fee1Mock, student_ref: student1Mock.ref}],
    }).as("getFeesForEnrichment");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/credit`,
      studentCreditMock
    ).as("getStudentCredit");
    Object.values(PaymentStatus).forEach((status) => {
      cy.intercept(
        "GET",
        `/students/credit-payments?status=${status}&page=*&page_size=500`,
        creditPaymentsByStatusMock[status]
      ).as(`getAllCreditPayments_${status}`);
      cy.intercept(
        "GET",
        `/students/credit-payments?status=${status}&page=*&page_size=10`,
        creditPaymentsByStatusMock[status]
      ).as(`getFilteredCreditPayments_${status}`);
    });
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/credit-payments"]').click();
  });

  it("lists credit payments with the most recent first when no filter is applied", () => {
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.contains("button", "Tous").click();
    cy.wait("@getAllCreditPayments_CREATED");
    cy.wait("@getAllCreditPayments_VALIDATE");
    cy.wait("@getAllCreditPayments_INVALIDATE");
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", creditPaymentPendingMock.comment)
      .and("contain", student1Mock.ref)
      .and("contain", `${creditPaymentPendingMock.amount} Ar`);
    cy.get("table tbody tr")
      .eq(1)
      .should("contain", creditPaymentValidatedMock.comment);
    cy.get("table tbody tr")
      .eq(2)
      .should("contain", creditPaymentRejectedMock.comment);
  });

  it("can filter credit payments by status", () => {
    cy.contains("button", "En attente").click();
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.contains(creditPaymentPendingMock.comment!);
    cy.contains(creditPaymentValidatedMock.comment!).should("not.exist");
    cy.contains(creditPaymentRejectedMock.comment!).should("not.exist");
    cy.contains("button", "Validés").click();
    cy.wait("@getFilteredCreditPayments_VALIDATE");
    cy.contains(creditPaymentValidatedMock.comment!);
    cy.contains(creditPaymentPendingMock.comment!).should("not.exist");
    cy.contains("button", "Rejetés").click();
    cy.wait("@getFilteredCreditPayments_INVALIDATE");
    cy.contains(creditPaymentRejectedMock.comment!);
    cy.contains(creditPaymentValidatedMock.comment!).should("not.exist");
    cy.contains("button", "Tous").click();
    cy.wait("@getAllCreditPayments_CREATED");
    cy.contains(creditPaymentPendingMock.comment!);
    cy.contains(creditPaymentValidatedMock.comment!);
    cy.contains(creditPaymentRejectedMock.comment!);
  });

  it("can validate a pending credit payment", () => {
    cy.intercept("PATCH", `/students/payments/validate`, {}).as(
      "validatePayment"
    );
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.getByTestid(`validate-payment-${creditPaymentPendingMock.id}`).click();
    cy.get("#alert-dialog-title").should("contain", "Valider le paiement");
    cy.get(".ra-confirm").click();
    cy.wait("@validatePayment")
      .its("request.body")
      .should("deep.equal", [creditPaymentPendingMock.id]);
    cy.contains("Paiement validé avec succès.");
  });

  it("can reject a pending credit payment", () => {
    cy.intercept("PATCH", `/students/payments/reject`, {}).as("rejectPayment");
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.getByTestid(`reject-payment-${creditPaymentPendingMock.id}`).click();
    cy.get("#alert-dialog-title").should("contain", "Rejeter le paiement");
    cy.get(".ra-confirm").click();
    cy.wait("@rejectPayment")
      .its("request.body")
      .should("deep.equal", [creditPaymentPendingMock.id]);
    cy.contains("Paiement rejeté avec succès.");
  });

  it("disables validate and reject actions for already processed payments", () => {
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.contains("button", "Tous").click();
    cy.wait("@getAllCreditPayments_CREATED");
    cy.wait("@getAllCreditPayments_VALIDATE");
    cy.wait("@getAllCreditPayments_INVALIDATE");
    cy.getByTestid(`validate-payment-${creditPaymentValidatedMock.id}`).should(
      "be.disabled"
    );
    cy.getByTestid(`reject-payment-${creditPaymentValidatedMock.id}`).should(
      "be.disabled"
    );
    cy.getByTestid(`validate-payment-${creditPaymentRejectedMock.id}`).should(
      "be.disabled"
    );
    cy.getByTestid(`reject-payment-${creditPaymentRejectedMock.id}`).should(
      "be.disabled"
    );
  });

  it("shows full payment details in a dialog when a row is clicked", () => {
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.contains("button", "Tous").click();
    cy.wait("@getAllCreditPayments_CREATED");
    cy.wait("@getAllCreditPayments_VALIDATE");
    cy.wait("@getAllCreditPayments_INVALIDATE");
    cy.get("table tbody tr")
      .contains("td", creditPaymentValidatedMock.comment!)
      .click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Détails du paiement par crédit");
      cy.contains("Paiement validé");
      cy.contains(`${creditPaymentValidatedMock.amount} Ar`);
      cy.contains("CREDIT");
      cy.contains(creditPaymentValidatedMock.comment!);
      cy.contains("Jane Admin");
      cy.contains("STF0001");
      cy.contains("Frais concerné");
      cy.contains(fee1Mock.comment!);
    });
  });

  it("hides the fee section and shows an empty validator when a payment has no fee", () => {
    cy.intercept(
      "GET",
      `/students/credit-payments?status=${PaymentStatus.CREATED}&page=*&page_size=10`,
      [{...creditPaymentPendingMock, fee: undefined}]
    ).as("getFilteredCreditPayments_CREATED");
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.get("table tbody tr")
      .contains("td", creditPaymentPendingMock.comment!)
      .click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Détails du paiement par crédit");
      cy.contains("Paiement en attente de validation");
      cy.contains("Non défini.e");
      cy.should("not.contain", "Frais concerné");
    });
  });

  it("closes the credit payment details dialog", () => {
    cy.wait("@getFilteredCreditPayments_CREATED");
    cy.get("table tbody tr")
      .contains("td", creditPaymentPendingMock.comment!)
      .click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"] .MuiDialogTitle-root button').click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
