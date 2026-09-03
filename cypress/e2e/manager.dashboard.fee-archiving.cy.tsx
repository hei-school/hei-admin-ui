import {
  feeArchiveRejectedMock,
  feeToArchiveMock,
} from "../fixtures/api_mocks/fees-mocks";

describe("Manager.Dashboard.PendingFeeArchiving", () => {
  it("shows the counts of fees pending archiving and rejected, and links to the archiving page", () => {
    cy.intercept("GET", `/fees?page=1&page_size=500`, {
      data: [
        feeToArchiveMock,
        {...feeToArchiveMock, id: "fee_to_archive_2_id"},
        feeArchiveRejectedMock,
      ],
    }).as("getFeesToArchiveSummary");
    cy.mockLogin({role: "MANAGER"});
    cy.wait("@getFeesToArchiveSummary");
    cy.contains("Frais à archiver");
    cy.contains("2 à archiver");
    cy.contains("1 rejetés");
    cy.contains("Voir les frais à archiver").click();
    cy.wait("@getFeesToArchiveSummary");
    cy.contains("button", "À archiver (2)");
    cy.contains("button", "Rejetés (1)");
  });

  it("shows zero counts when there is no fee pending archiving or rejected", () => {
    cy.intercept("GET", `/fees?page=1&page_size=500`, {
      data: [],
    }).as("getNoFeesToArchive");
    cy.mockLogin({role: "MANAGER"});
    cy.wait("@getNoFeesToArchive");
    cy.contains("0 à archiver");
    cy.contains("0 rejetés");
  });
});
