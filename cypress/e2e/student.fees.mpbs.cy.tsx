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

    cy.contains("Frais créés avec succès");

    cy.wait("@getMpbsFees");

    // cy.getByTestid(`pspTypeIcon-${fee1Mock.student_id}--${fee1Mock.id}`).should(
    //   "exist"
    // );
  });
});
