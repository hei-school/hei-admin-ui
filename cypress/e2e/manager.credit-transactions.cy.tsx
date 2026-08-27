import {fee1Mock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const creditTransactionsMock = [
  {
    transaction_id: "transaction1_id",
    movement: "CREDIT",
    amount: 100000,
    date_time: new Date("2024-02-01T10:00:00Z"),
    fee: {...fee1Mock, archive_status: "ARCHIVED", archived_by_ref: "MGR21001"},
  },
  {
    transaction_id: "transaction2_id",
    movement: "DEBIT",
    amount: 40000,
    date_time: null,
    payment: {
      amount: 40000,
      status: "VALIDATE",
      comment: "Paiement du reste par crédit",
      validated_by_ref: "MGR21001",
      creation_datetime: new Date("2024-02-05T08:00:00Z"),
    },
  },
];

describe("Manager.Student.CreditTransactions", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
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
      .should("contain", "CREDIT")
      .and("contain", "100000 Ar");
    cy.get("table tbody tr")
      .eq(1)
      .should("contain", "DÉBIT")
      .and("contain", "40000 Ar")
      .and("contain", "Non définie");
  });

  it("opens a modal with the archived fee attached to a deposit", () => {
    cy.getByTestid("credit-transactions-tab").click();
    cy.wait("@getCreditTransactions");
    cy.get("table tbody tr").eq(0).click();
    cy.get(".MuiDialog-container").within(() => {
      cy.contains("Archivage d'un frais");
      cy.contains("Frais rattaché");
      cy.contains(fee1Mock.comment ?? "");
      cy.contains("Archivé");
      cy.contains("MGR21001");
    });
  });

  it("opens a modal with the payment attached to a withdrawal", () => {
    cy.getByTestid("credit-transactions-tab").click();
    cy.wait("@getCreditTransactions");
    cy.get("table tbody tr").eq(1).click();
    cy.get(".MuiDialog-container").within(() => {
      cy.contains("Paiement d'un frais par crédit");
      cy.contains("Paiement rattaché");
      cy.contains("Paiement du reste par crédit");
      cy.contains("MGR21001");
    });
  });

  it("closes the modal", () => {
    cy.getByTestid("credit-transactions-tab").click();
    cy.wait("@getCreditTransactions");
    cy.get("table tbody tr").eq(0).click();
    cy.get(".MuiDialog-container").contains("Fermer").click();
    cy.get(".MuiDialog-container").should("not.exist");
  });
});
