import {PaymentStatus} from "@haapi-3d601c85/typescript-client";
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
});
