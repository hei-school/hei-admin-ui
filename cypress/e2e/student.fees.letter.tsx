import {
  acceptedPaymentSlip,
  feesMock,
  rejectedPaymentSlip,
} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Mobile payment by student", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");

    cy.login({role: "STUDENT"});
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click();
  });

  it("checks the icon button based on the existence of the payment slip in the fee", () => {
    cy.getByTestid(
      `letterTypeIcon-${rejectedPaymentSlip.student_id}--${rejectedPaymentSlip.id}`
    ).should("not.exist");
    cy.getByTestid(
      `addPaymentSlip-${rejectedPaymentSlip.student_id}--${rejectedPaymentSlip.id}`
    ).should("exist");
    cy.getByTestid(
      `letterTypeIcon-${acceptedPaymentSlip.student_id}--${acceptedPaymentSlip.id}`
    ).should("exist");
    cy.getByTestid(
      `addPaymentSlip-${acceptedPaymentSlip.student_id}--${acceptedPaymentSlip.id}`
    ).should("not.exist");
  });
});
