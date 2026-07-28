/// <reference types="cypress" />

describe("Sidebar en mode normal (FEES_ONLY=false)", () => {
  describe("Student", () => {
    beforeEach(() => {
      cy.mockLogin({role: "STUDENT"});
    });

    it("montre tous les liens", () => {
      cy.contains("Frais").should("exist");
      cy.getByTestid("docs").should("exist");
      cy.getByTestid("event-menu").should("exist");
      cy.getByTestid("retakeExam-menu").should("exist");
      cy.getByTestid("cor-menu").should("exist");
      cy.contains("Annonces").should("exist");
      cy.contains("Se déconnecter").should("exist");
    });
  });

  describe("Monitor", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MONITOR"});
    });

    it("montre tous les liens", () => {
      cy.getByTestid("students-menu").should("exist");
      cy.getByTestid("event-menu").should("exist");
      cy.contains("Annonces").should("exist");
      cy.contains("Se déconnecter").should("exist");
    });
  });

  describe("Teacher", () => {
    beforeEach(() => {
      cy.mockLogin({role: "TEACHER"});
    });

    it("montre tous les liens", () => {
      cy.contains("Étudiants").should("exist");
      cy.getByTestid("docs").should("exist");
      cy.contains("Groupes").should("exist");
      cy.contains("Annonces").should("exist");
      cy.getByTestid("course-menu").should("exist");
      cy.getByTestid("exam-menu").should("exist");
      cy.getByTestid("event-menu").should("exist");
    });
  });

  describe("Staff", () => {
    beforeEach(() => {
      cy.mockLogin({role: "STAFF_MEMBER"});
    });

    it("montre le lien documents", () => {
      cy.getByTestid("other-docs").should("exist");
    });
  });

  describe("Organizer", () => {
    beforeEach(() => {
      cy.mockLogin({role: "ORGANIZER"});
    });

    it("montre le lien événements", () => {
      cy.getByTestid("event-menu").should("exist");
    });
  });

  describe("Admin", () => {
    beforeEach(() => {
      cy.mockLogin({role: "ADMIN"});
    });

    it("montre tous les liens", () => {
      cy.getByTestid("students-menu").should("exist");
      cy.getByTestid("monitors-menu").should("exist");
      cy.getByTestid("docs").should("exist");
      cy.getByTestid("promotions-menu").should("exist");
      cy.getByTestid("course-menu").should("exist");
      cy.getByTestid("exams-menu").should("exist");
      cy.getByTestid("retakeExamsSessions-menu").should("exist");
      cy.getByTestid("event-point").should("exist");
      cy.getByTestid("staffmembers-menu").should("exist");
    });
  });

  describe("Manager", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MANAGER"});
    });

    it("montre tous les liens", () => {
      cy.getByTestid("students-menu").should("exist");
      cy.getByTestid("monitors-menu").should("exist");
      cy.getByTestid("docs").should("exist");
      cy.getByTestid("promotions-menu").should("exist");
      cy.getByTestid("course-menu").should("exist");
      cy.getByTestid("exams-menu").should("exist");
      cy.getByTestid("retakeExamsSessions-menu").should("exist");
      cy.getByTestid("event-point").should("exist");
    });
  });
});
