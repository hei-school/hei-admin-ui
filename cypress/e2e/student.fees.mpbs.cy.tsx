import {
  fee1Mock,
  fee1MockMpbs,
  feesMock,
  unverifiedMpbsFee,
} from "../fixtures/api_mocks/fees-mocks";
import {feesTemplatesMocks} from "../fixtures/api_mocks/fees-templates-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Mobile payment by student", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");

    cy.login({role: "STUDENT"});
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click();
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
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      [{mpbs: fee1MockMpbs, ...fee1Mock}, ...fees]
    ).as("getMpbsFees");

    cy.getByTestid(
      `addMobileMoney-${fee1Mock.student_id}--${fee1Mock.id}`
    ).click({force: true});

    cy.get("#psp_id").click().type("reference orange no 1");
    cy.get('[data-testid="SaveIcon"]').click();

    cy.contains("Frais créés avec succès");

    cy.wait("@getMpbsFees");

    cy.getByTestid(`pspTypeIcon-${fee1Mock.student_id}--${fee1Mock.id}`).should(
      "exist"
    );
  });
});

describe("Student fees", () => {
  beforeEach(() => {
    cy.login({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");

    cy.intercept(
      "GET",
      "**fees/templates?page=1&page_size=25",
      feesTemplatesMocks
    ).as("getFeesTemplates");
    cy.intercept("POST", `/students/${student1Mock.id}/fees`, feesMock).as(
      "createFees"
    );
  });

  it("student can create fees", () => {
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("fees-create-button").click();
    cy.wait("@getFeesTemplates");
    cy.get("#feesTemplateId").click();
    cy.get('[data-value="annualTuition1x"]').click();
    cy.contains("Enregistrer").click();
    cy.contains("Frais créés avec succès");
  });
});
