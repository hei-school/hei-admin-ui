import {fee1Mock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const creditTransactionsMock = [
  {
    transaction_id: "transaction1_id",
    movement: "CREDIT",
    amount: 100000,
    date_time: new Date("2024-02-01T10:00:00Z"),
    fee: fee1Mock,
    credit: {
      id: "credit1_id",
      amount: 500000,
      student: {
        ref: student1Mock.ref,
        first_name: student1Mock.first_name,
        last_name: "Doe",
        email: "john@example.com",
      },
    },
    payment: {
      id: "payment1_id",
      status: "VALIDATE",
      amount: 100000,
      type: "CREDIT",
      comment: "Paiement initial",
      creation_datetime: new Date("2024-02-01T09:00:00Z"),
      validated_by_first_name: "Jane",
      validated_by_last_name: "Admin",
      validated_by_ref: "STF0001",
    },
  },
  {
    transaction_id: "transaction2_id",
    movement: "DEBIT",
    amount: 40000,
    date_time: null,
    fee: null,
  },
];

describe("Manager.Student.CreditTransactions", () => {
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
      `/students/${student1Mock.id}/credit-transactions**`,
      creditTransactionsMock
    ).as("getCreditTransactions");

    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.wait("@getStudents");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
  });

  it("lists the student's credit transactions", () => {
    cy.getByTestid("credit-transactions-tab").click();
    cy.wait("@getCreditTransactions");
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", "Crédit")
      .and("contain", "100000 Ar");
    cy.get("table tbody tr")
      .eq(1)
      .should("contain", "Débit")
      .and("contain", "40000 Ar")
      .and("contain", "Non définie");
  });

  it("shows full transaction details in a dialog when a row is clicked", () => {
    cy.getByTestid("credit-transactions-tab").click();
    cy.wait("@getCreditTransactions");
    cy.get("table tbody tr").eq(0).click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Détails de la transaction de crédit");
      cy.contains("Crédit");
      cy.contains("100000 Ar");
      cy.contains("Doe");
      cy.contains("500000 Ar");
      cy.contains("Paiement lié");
      cy.contains("Jane Admin");
      cy.contains("STF0001");
      cy.contains("Frais concerné");
      cy.contains(fee1Mock.comment!);
    });
  });

  it("hides the payment and fee sections when a transaction has none", () => {
    cy.getByTestid("credit-transactions-tab").click();
    cy.wait("@getCreditTransactions");
    cy.get("table tbody tr").eq(1).click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Détails de la transaction de crédit");
      cy.contains("Débit");
      cy.should("not.contain", "Paiement lié");
      cy.should("not.contain", "Frais concerné");
    });
  });
});
