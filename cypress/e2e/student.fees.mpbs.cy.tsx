import {studentCreditMock} from "../fixtures/api_mocks/credit-payments-mocks";
import {
  fee1Mock,
  fee1MockMpbs,
  feesMock,
  unverifiedMpbsFee,
} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Mobile payment by student", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=*`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=*`,
      feesMock
    ).as("getFees2");
    cy.intercept("GET", `/students/${student1Mock.id}/level`, "L1").as(
      "getStudentLevel"
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/credit`,
      studentCreditMock
    ).as("getStudentCredit");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=500`,
      []
    ).as("getFeesForCredit");

    cy.mockLogin({role: "STUDENT"});
    cy.get(`[href="/students/${student1Mock.id}/fees"]`).click();
  });

  it("checks the icon button based on the existence of the mpbs in the fee", () => {
    cy.getByTestid(
      `pspTypeIcon-${unverifiedMpbsFee.student_id}--${unverifiedMpbsFee.id}`
    ).should("not.exist");
    cy.getByTestid(
      `addMobileMoney-${unverifiedMpbsFee.student_id}--${unverifiedMpbsFee.id}`
    ).should("exist");
    cy.getByTestid(`pspTypeIcon-${fee1Mock.student_id}--${fee1Mock.id}`).should(
      "not.exist"
    );
    cy.getByTestid(
      `addMobileMoney-${fee1Mock.student_id}--${fee1Mock.id}`
    ).should("exist");
  });

  it("can create a mpbs", () => {
    const [fee1Mock, ...fees] = feesMock;

    cy.intercept(
      "PUT",
      `/students/${fee1Mock.student_id}/fees/${fee1Mock.id}/mpbs`,
      fee1MockMpbs
    ).as("addMpbs");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=*`,
      [{mpbs: fee1MockMpbs, ...fee1Mock}, ...fees]
    ).as("getMpbsFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=*`,
      [{mpbs: fee1MockMpbs, ...fee1Mock}, ...fees]
    ).as("getMpbsFees2");

    cy.getByTestid(
      `addMobileMoney-${fee1Mock.student_id}--${fee1Mock.id}`
    ).click({force: true});

    cy.get("#psp_id").click().type("MP240726.1541.D88429");
    cy.contains("Enregistrer").click();

    cy.contains("Paiement enregistré avec succès");

    cy.wait("@getMpbsFees");
  });

  it("can pay a fee by credit when the student has enough credit", () => {
    cy.intercept(
      "POST",
      `/students/${fee1Mock.student_id}/fees/${fee1Mock.id}/payments`,
      [{id: "credit_payment_new_id"}]
    ).as("createCreditPayment");

    cy.wait("@getStudentCredit");

    cy.getByTestid(
      `addMobileMoney-${fee1Mock.student_id}--${fee1Mock.id}`
    ).click({force: true});

    cy.contains("Crédit").click();
    cy.get("#amount").click().type("100000");
    cy.contains("Enregistrer").click();

    cy.contains("Paiement enregistré avec succès");
    cy.wait("@createCreditPayment");
  });

  it("cannot pay a fee by credit for more than the available credit", () => {
    cy.wait("@getStudentCredit");

    cy.getByTestid(
      `addMobileMoney-${fee1Mock.student_id}--${fee1Mock.id}`
    ).click({force: true});

    cy.contains("Crédit").click();
    cy.get("#amount")
      .click()
      .type((studentCreditMock.amount + 1).toString());
    cy.contains("Enregistrer").click();

    cy.contains("Le montant saisi est supérieur à votre crédit actuel.");
  });
});
