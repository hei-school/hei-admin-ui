import {fee1Mock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const creditTransactionsMock = [
  {
    transaction_id: "transaction1_id",
    movement: "CREDIT",
    amount: 100000,
    date_time: new Date("2024-02-01T10:00:00Z"),
    fee: {comment: fee1Mock.comment},
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
});
