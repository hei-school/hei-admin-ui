import {renderMoney} from "../../src/operations/common/utils/money";
import {
  UpdateFeeWithPaymentMock,
  feesMock,
  unpaidFeeMock,
} from "../fixtures/api_mocks/fees-mocks";
import {
  createPaymentWithAmountMock,
  payment1Mock,
} from "../fixtures/api_mocks/payments-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const amount = 1 + Math.floor(Math.random() * 100_000);
const createPayment = createPaymentWithAmountMock(amount);

describe("Manager.Payment", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `students?page=1&page_size=10&ref=${student1Mock.ref}`,
      [student1Mock]
    ).as("getStudents");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getfees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}`,
      unpaidFeeMock
    ).as("getUnpaidFee");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}/payments?page=1&page_size=10`,
      []
    ).as("getPaymentOfUnpaidFee");
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}/payments`,
      [payment1Mock]
    ).as("addPayments");
    cy.getByTestid("students-menu").click(); // Étudiants category
    cy.get('a[href="#/students"]').click();
    cy.wait("@getStudentsPage1");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-ref").type(student1Mock.ref);
    cy.getByTestid("apply-filter").click();
    cy.get("table").contains(student1Mock.ref).click();
    cy.get('[aria-label="fees"]').click();

    cy.contains(unpaidFeeMock.comment as string).click();
    cy.contains("En attente");
    cy.getByTestid("AddIcon").click();
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}/payments?page=1&page_size=10`,
      [createPayment]
    ).as("getPayment");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}`,
      UpdateFeeWithPaymentMock(unpaidFeeMock, createPayment)
    ).as("getFee");
  });

  it("can add cash payment to a fee", () => {
    cy.get("#type_CASH").click();
    cy.get("#amount").click().type(createPayment.amount!.toString());
    cy.get("#comment").click().type(createPayment.comment!);
    cy.contains("Enregistrer").click();
    cy.contains("Élément créé");
    cy.get(`.MuiTableCell-alignRight:contains(${renderMoney(amount)})`).should(
      "have.length",
      1
    );
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");
  });

  it("can add mobile money payment to a fee", () => {
    cy.get("#type_MOBILE_MONEY").click();
    cy.get("#amount").click().type(createPayment.amount!.toString());
    cy.get("#comment").click().type(createPayment.comment!);
    cy.contains("Enregistrer").click();
    cy.contains("Élément créé");
    cy.get(`.MuiTableCell-alignRight:contains(${renderMoney(amount)})`).should(
      "have.length",
      1
    );
  });

  it("can't add mobile money payment to a fee without comment", () => {
    cy.get("#type_MOBILE_MONEY").click();
    cy.get("#amount").click().type(createPayment.amount!.toString());
    cy.contains("Enregistrer").click();
    cy.contains("Le formulaire n'est pas valide.");
  });

  it("can add bank payment to a fee", () => {
    cy.get("#type_BANK_TRANSFER").click();
    cy.get("#amount").click().type(createPayment.amount!.toString());
    cy.get("#comment").click().type(createPayment.comment!);
    cy.get("#ref").click().type(amount!.toString());
    cy.get("#specify-date").click();
    cy.get("#creation_datetime").click().type("2023-11-24");
    cy.contains("Enregistrer").click();
    cy.contains("Élément créé");
    cy.get(`.MuiTableCell-alignRight:contains(${renderMoney(amount)})`).should(
      "have.length",
      1
    );
  });
});
