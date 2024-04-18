import {feesMock} from "../fixtures/fees-mocks";
import {createPaymentMock} from "../fixtures/payments-mocks";
import {student1Mock} from "../fixtures/students-mocks";

describe("Student", () => {
  beforeEach(() => {
    cy.login({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${
        feesMock[7 - 1].id
      }/payments?page=1&page_size=10`,
      createPaymentMock(feesMock[7 - 1])
    ).as("getPaymentsOfFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${feesMock[0].id}/payments?page=1&page_size=10`,
      createPaymentMock(feesMock[0])
    ).as("getPaymentsOfFee2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${feesMock[7 - 1].id}`,
      feesMock[7 - 1]
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${feesMock[0].id}`,
      feesMock[0]
    ).as("getFee2");
  });

  it("lands on profile page if succeeds", () => {
    cy.get('[href="#/profile"] > .MuiBox-root').click();
    cy.get("#main-content")
      .should("contain", student1Mock.ref)
      .and("contain", student1Mock.first_name)
      .and("contain", student1Mock.last_name)
      .and("contain", student1Mock.address)
      .and("contain", student1Mock.email)
      .and("contain", student1Mock.phone);
    cy.get("#ha-menu")
      .should("not.contain", "Enseignants", {timeout: 50})
      .and("not.contain", "Étudiants", {timeout: 50})
      .and("contain", "Frais");
  });

  it("can list fees", () => {
    const EXCPECTED_MONEY = 200_000;
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=500`,
      feesMock
    ).as("getFees");
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click();
    cy.wait("@getFees");
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");
    cy.get("td a").should("not.contain", "ÉDITER", {timeout: 50});
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.contains(`${EXCPECTED_MONEY.toLocaleString()} Ar`).click();
    cy.get("#main-content").should("contain", "Paiements");
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");
    cy.get("td").should("not.contain", "ÉDITER", {timeout: 50});
    cy.get(".RaList-main").should("not.contain", "CRÉER", {timeout: 50});
    cy.contains("En retard");
  });

  it("can detail fee (click on fee button)", () => {
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click();
    cy.get(":nth-child(7) > :nth-child(5)").click();
    cy.contains("En retard");
  });
});
