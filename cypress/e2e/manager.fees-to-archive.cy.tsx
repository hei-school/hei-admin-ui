import {ArchiveStatusEnum} from "@haapi-b0fc7615/typescript-client";
import {
  feeArchiveRejectedMock,
  feeToArchiveMock,
} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.FeesToArchive", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.intercept("GET", `/fees?page=*&page_size=500`, {
      data: [feeToArchiveMock, feeArchiveRejectedMock],
    }).as("getFees");
    cy.visit("/fees-to-archive");
    cy.wait("@getFees");
  });

  it("lists fees pending archiving in the 'À archiver' tab by default", () => {
    cy.contains("button", "À archiver (1)");
    cy.contains("button", "Rejetés (1)");
    cy.get("table tbody tr").should("have.length", 1);
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", feeToArchiveMock.student_ref)
      .and("contain", feeToArchiveMock.student_first_name);
  });

  it("can archive a pending fee", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}/archive-status`,
      {}
    ).as("updateArchiveStatus");
    cy.get("table tbody tr").eq(0).contains("button", "Archiver").click();
    cy.get("#alert-dialog-title").should("contain", "Archivage de frais");
    cy.get(".ra-confirm").click();
    cy.wait("@updateArchiveStatus")
      .its("request.body")
      .should("deep.equal", {status: ArchiveStatusEnum.ARCHIVED});
    cy.contains("Frais archivé avec succès.");
  });

  it("can reject a pending fee's archive request", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}/archive-status`,
      {}
    ).as("updateArchiveStatus");
    cy.get("table tbody tr").eq(0).contains("button", "Rejeter").click();
    cy.get("#alert-dialog-title").should("contain", "Rejet de l'archivage");
    cy.get(".ra-confirm").click();
    cy.wait("@updateArchiveStatus")
      .its("request.body")
      .should("deep.equal", {status: ArchiveStatusEnum.REJECTED});
    cy.contains("Demande d'archivage rejetée.");
  });

  it("can re-archive a rejected fee from the 'Rejetés' tab", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeArchiveRejectedMock.id}`,
      {}
    ).as("reArchiveFee");
    cy.contains("button", "Rejetés (1)").click();
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", feeArchiveRejectedMock.student_ref)
      .and(
        "contain",
        `${feeArchiveRejectedMock.archived_by_first_name} ${feeArchiveRejectedMock.archived_by_last_name}`
      );
    cy.get("table tbody tr").eq(0).contains("button", "Réarchiver").click();
    cy.get("#alert-dialog-title").should("contain", "Réarchivage de frais");
    cy.get(".ra-confirm").click();
    cy.wait("@reArchiveFee");
    cy.contains("Demande d'archivage renvoyée.");
  });

  it("shows an error notification when archiving a fee fails", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}/archive-status`,
      {statusCode: 500, body: {}}
    ).as("updateArchiveStatus");
    cy.get("table tbody tr").eq(0).contains("button", "Archiver").click();
    cy.get(".ra-confirm").click();
    cy.wait("@updateArchiveStatus");
    cy.contains("Une erreur s'est produite.");
  });

  it("shows an error notification when rejecting a fee fails", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeToArchiveMock.id}/archive-status`,
      {statusCode: 500, body: {}}
    ).as("updateArchiveStatus");
    cy.get("table tbody tr").eq(0).contains("button", "Rejeter").click();
    cy.get(".ra-confirm").click();
    cy.wait("@updateArchiveStatus");
    cy.contains("Une erreur s'est produite.");
  });

  it("shows an error notification when re-archiving a fee fails", () => {
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${feeArchiveRejectedMock.id}`,
      {statusCode: 500, body: {}}
    ).as("reArchiveFee");
    cy.contains("button", "Rejetés (1)").click();
    cy.get("table tbody tr").eq(0).contains("button", "Réarchiver").click();
    cy.get(".ra-confirm").click();
    cy.wait("@reArchiveFee");
    cy.contains("Une erreur s'est produite.");
  });

  it("shows an empty state when there is no fee pending archiving", () => {
    cy.intercept("GET", `/fees?page=*&page_size=500`, {
      data: [feeArchiveRejectedMock],
    }).as("getFeesToArchiveOnly");
    cy.visit("/fees-to-archive");
    cy.wait("@getFeesToArchiveOnly");
    cy.contains("Aucun frais en attente d'archivage.");
  });

  it("shows an empty state when there is no rejected fee", () => {
    cy.intercept("GET", `/fees?page=*&page_size=500`, {
      data: [feeToArchiveMock],
    }).as("getRejectedFeesOnly");
    cy.visit("/fees-to-archive");
    cy.wait("@getRejectedFeesOnly");
    cy.contains("button", "Rejetés (0)").click();
    cy.contains("Aucun frais rejeté.");
  });
});

describe("Manager.FeesToArchive.AccessControl", () => {
  it("shows an access-denied message for a non-manager, non-admin role", () => {
    cy.mockLogin({role: "STUDENT"});
    cy.visit("/fees-to-archive");
    cy.contains(
      "Cette page est réservée aux gestionnaires et administrateurs."
    );
  });
});
