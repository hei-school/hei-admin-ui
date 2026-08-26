import {ArchiveStatusEnum, Fee} from "@haapi-3d601c85/typescript-client";
import {fee1Mock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const feeToArchiveMock: Fee = {
  ...fee1Mock,
  id: "fee_to_archive_id",
  student_ref: student1Mock.ref,
  student_first_name: student1Mock.first_name,
  archive_status: ArchiveStatusEnum.TO_ARCHIVE,
  archived_by_ref: "MGR21001",
};

describe("Manager.Fees.ArchiveValidations", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.intercept("GET", `/fees**`, {data: [feeToArchiveMock]}).as(
      "getFeesToArchive"
    );
    cy.visit("/fees/archive-validations");
    cy.wait("@getFeesToArchive");
  });

  it("lists fees pending archive validation", () => {
    cy.contains("Archivages de frais à valider").should("exist");
    cy.contains("tr", student1Mock.ref!).within(() => {
      cy.contains(student1Mock.first_name!);
      cy.contains(feeToArchiveMock.comment!);
      cy.contains(feeToArchiveMock.category!);
    });
  });

  it("can validate a pending archiving request from the list", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}/archive-status`,
      {}
    ).as("validateArchiveFee");
    cy.contains("tr", student1Mock.ref!)
      .find('[data-testid="validate-archive-button-confirm"]')
      .click();
    cy.get("#alert-dialog-title").should(
      "contain",
      "Validation d'archivage de frais"
    );
    cy.get(".ra-confirm").click();
    cy.wait("@validateArchiveFee")
      .its("request.body")
      .should("deep.equal", {status: "ARCHIVED"});
    cy.contains("Frais archivé avec succès.");
  });

  it("navigates to the fee show page when clicking a row", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}`,
      feeToArchiveMock
    ).as("getFeeShow");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent"
    );
    cy.intercept("GET", `/fees/${feeToArchiveMock.id}/payments**`, {
      data: [],
    }).as("getFeePayments");
    cy.contains("tr", student1Mock.ref!).click();
    cy.url().should(
      "include",
      `/fees/${student1Mock.id}--${feeToArchiveMock.id}/show`
    );
    cy.wait("@getFeeShow");
    cy.contains("Détails du frais").should("exist");
  });

  it("can reject a pending archiving request from the list", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}/archive-status`,
      {}
    ).as("rejectArchiveFee");
    cy.contains("tr", student1Mock.ref!)
      .find('[data-testid="reject-archive-button-confirm"]')
      .click();
    cy.get("#alert-dialog-title").should(
      "contain",
      "Rejet de la demande d'archivage"
    );
    cy.get(".ra-confirm").click();
    cy.wait("@rejectArchiveFee")
      .its("request.body")
      .should("deep.equal", {status: "REJECTED"});
    cy.contains("Demande d'archivage rejetée.");
  });
});
