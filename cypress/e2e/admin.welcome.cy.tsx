/// <reference types="cypress" />

import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {advanceStatsMocks} from "../fixtures/api_mocks/advanceStats-mocks";
import {announcementsMock} from "../fixtures/api_mocks/announcement-mocks";
import {commentMocks} from "../fixtures/api_mocks/comment-mocks";
import {unpaidFeeMock} from "../fixtures/api_mocks/fees-mocks";
import {lettersMocks, statsMocks} from "../fixtures/api_mocks/letters-mocks";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";

const ITEM_PER_LIST = 12;

describe("AdminWelcome Page", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept("GET", `/letters/stats`, statsMocks).as("getStats");
    cy.intercept(
      "GET",
      `/letters?page=1&page_size=12`,
      lettersMocks.slice(0)
    ).as("getAllLetters");
    cy.intercept(
      "GET",
      `/letters?page=2&page_size=12`,
      lettersMocks.slice(0, ITEM_PER_LIST)
    ).as("getAllLetters2");

    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&status=SUSPENDED`,
      studentsMock
    ).as("getStudentsPage1");
    cy.intercept(
      "GET",
      `/students?page=2&page_size=10&status=SUSPENDED`,
      studentsMock
    ).as("getStudentsPage2");

    cy.intercept(
      "GET",
      `/comments?page=1&page_size=10`,
      commentMocks.slice(0, ITEM_PER_LIST)
    ).as("getCommentsPage1");

    cy.intercept(
      "GET",
      `/comments?page=2&page_size=10`,
      commentMocks.slice(0, ITEM_PER_LIST)
    ).as("getCommentsPage2");

    cy.intercept("GET", `advanced-stats**`, advanceStatsMocks).as(
      "getAdvancedStats"
    );

    cy.intercept(
      "GET",
      `/announcements?page=1&page_size=4`,
      announcementsMock.slice(0, 4)
    ).as("getAnnouncements");
    cy.intercept(
      "GET",
      `/announcements?page=2&page_size=4`,
      announcementsMock.slice(0, 4)
    ).as("getAnnouncements2");

    cy.intercept("GET", `/fees**`, {data: [unpaidFeeMock]}).as("getFees");
  });

  it("should display 'Bonjour' greeting in WelcomingCard", () => {
    cy.clock(new Date(2025, 6, 18, 8, 0, 0));
    cy.contains("Bonjour Admin").should("exist");
  });

  it("should display 'Bon après-midi' greeting in WelcomingCard", () => {
    cy.clock(new Date(2025, 6, 18, 15, 0, 0));
    cy.contains("Bon après-midi Admin").should("exist");
  });

  it("should display 'Bonsoir' greeting in WelcomingCard", () => {
    cy.clock(new Date(2025, 6, 18, 20, 0, 0));
    cy.contains("Bonsoir Admin").should("exist");
  });

  it("should display RecentLetters section", () => {
    cy.contains("Lettres récemment envoyées").should("exist");
    cy.contains("Voir toutes les lettres").should("exist");
  });

  it("should display late fees list", () => {
    cy.contains("Listes des frais en retard").should("exist");
    cy.contains("Tous les frais en retard").should("exist");
  });

  it("should display suspended students list", () => {
    cy.contains("Listes de étudiants suspendus").should("exist");
    cy.contains("Tous les étudiants").should("exist");
  });

  it("should display latest announcements", () => {
    cy.contains("Les dernières annonces").should("exist");
    cy.contains("Tous les annonces").should("exist");
  });

  it("should navigate to fees page when clicking the button", () => {
    cy.contains("Tous les frais en retard").click();
    cy.url().should("include", "/fees");
  });

  it("should navigate to students page when clicking the button", () => {
    cy.contains("Tous les étudiants").click();
    cy.url().should("include", "/students");
  });

  it("should navigate to announcements page when clicking the button", () => {
    cy.contains("Tous les annonces").click();
    cy.url().should("include", "/announcements");
  });

  it("should display correct category and remaining amount in late fees list", () => {
    cy.contains("Catégorie").should("exist");
    cy.contains(unpaidFeeMock.category!).should("exist");

    cy.contains("Reste à payer").should("exist");
    cy.contains(unpaidFeeMock.remaining_amount!).should("exist");
  });
});
