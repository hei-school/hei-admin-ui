/// <reference types="cypress" />

describe("Sidebar en mode FEES_ONLY", () => {
  describe("Student", () => {
    beforeEach(() => {
      cy.mockLogin({role: "STUDENT"});
    });

    it("montre Frais et Se déconnecter, cache le reste", () => {
      cy.contains("Frais").should("exist");
      cy.contains("Se déconnecter").should("exist");

      cy.getByTestid("docs").should("not.exist");
      cy.getByTestid("other-docs").should("not.exist");
      cy.getByTestid("event-menu").should("not.exist");
      cy.getByTestid("retakeExam-menu").should("not.exist");
      cy.getByTestid("cor-menu").should("not.exist");
      cy.contains("Annonces").should("not.exist");
    });
  });

  describe("Monitor", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MONITOR"});
    });

    it("cache tous les liens métier, garde Se déconnecter", () => {
      cy.contains("Se déconnecter").should("exist");

      cy.getByTestid("students-menu").should("not.exist");
      cy.getByTestid("event-menu").should("not.exist");
      cy.contains("Annonces").should("not.exist");
    });
  });

  describe("Teacher", () => {
    beforeEach(() => {
      cy.mockLogin({role: "TEACHER"});
    });

    it("cache tous les liens métier", () => {
      cy.contains("Étudiants").should("not.exist");
      cy.getByTestid("docs").should("not.exist");
      cy.contains("Groupes").should("not.exist");
      cy.contains("Annonces").should("not.exist");
      cy.getByTestid("course-menu").should("not.exist");
      cy.getByTestid("exam-menu").should("not.exist");
      cy.getByTestid("event-menu").should("not.exist");
    });
  });

  describe("Staff", () => {
    beforeEach(() => {
      cy.mockLogin({role: "STAFF_MEMBER"});
    });

    it("cache le lien documents", () => {
      cy.getByTestid("other-docs").should("not.exist");
    });
  });

  describe("Organizer", () => {
    beforeEach(() => {
      cy.mockLogin({role: "ORGANIZER"});
    });

    it("cache le lien événements", () => {
      cy.getByTestid("event-menu").should("not.exist");
    });
  });
});