import {fee1Mock, feesMock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const openStudentProfile = () => {
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
  cy.getByTestid("students-menu").click();
  cy.get('a[href="/students"]').click();
  cy.wait("@getStudents");
  cy.getByTestid("menu-list-action").click();
  cy.getByTestid("add-filter").click();
  cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
  cy.getByTestid("apply-filter").click();
  cy.contains(student1Mock.first_name).click();
};

const firstRowActions = () =>
  cy.get(
    ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
  );

describe("Manager.Fee.Archive", () => {
  beforeEach(() => openStudentProfile());

  it("can request the archiving of a fee", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFees2");
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      {}
    ).as("archiveFee");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    firstRowActions().find('[data-testid="archive-button-confirm"]').click();
    cy.get("#alert-dialog-title").should("contain", "Archivage de frais");
    cy.contains("Confirmez-vous la demande d'archivage de ce frais ?");
    cy.get(".ra-confirm").click();
    cy.wait("@archiveFee");
    cy.contains("Demande d'archivage envoyée.");
  });

  it("can validate a pending archiving request", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      [{...fee1Mock, archive_status: "TO_ARCHIVE"}, ...feesMock.slice(1)]
    ).as("getFeesToArchive");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFeesToArchive2");
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/archive-status`,
      {}
    ).as("validateArchiveFee");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFeesToArchive");
    firstRowActions()
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

  it("can reject a pending archiving request", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      [{...fee1Mock, archive_status: "TO_ARCHIVE"}, ...feesMock.slice(1)]
    ).as("getFeesToArchive");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFeesToArchive2");
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/archive-status`,
      {}
    ).as("rejectArchiveFee");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFeesToArchive");
    firstRowActions()
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

  it("shows an archived badge for an already archived fee", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      [{...fee1Mock, archive_status: "ARCHIVED"}, ...feesMock.slice(1)]
    ).as("getFeesArchived");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFeesArchived2");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFeesArchived");
    firstRowActions()
      .find('[data-testid="fee-archive-status"]')
      .should("contain", "Archivé");
  });

  it("allows re-requesting the archiving of a fee once rejected", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      [{...fee1Mock, archive_status: "REJECTED"}, ...feesMock.slice(1)]
    ).as("getFeesRejected");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFeesRejected2");
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      {}
    ).as("reArchiveFee");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFeesRejected");
    firstRowActions()
      .find('[data-testid="archive-button-confirm"]')
      .should("be.enabled")
      .should("contain", "Réarchiver")
      .click();
    cy.get(".ra-confirm").click();
    cy.wait("@reArchiveFee");
    cy.contains("Demande d'archivage envoyée.");
  });
});
