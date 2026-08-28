/// <reference types="cypress" />

describe("Fees-only mode", () => {
  describe("Global behavior (via whoami feesOnly flag)", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/whoami", {
        statusCode: 200,
        body: {
          feesOnly: true,
          email: "test.user@mail.com",
          role: "school-admin",
        },
      }).as("whoami");
      cy.mockLogin({role: "SCHOOL_ADMIN", feesOnly: true});
      cy.visit("/");
    });

    it("hides restricted navigation items", () => {
      cy.getByTestid("students-menu").should("not.exist");
      cy.getByTestid("monitors-menu").should("not.exist");
      cy.getByTestid("docs").should("not.exist");
      cy.getByTestid("promotions-menu").should("not.exist");
      cy.getByTestid("course-menu").should("not.exist");
      cy.getByTestid("exams-menu").should("not.exist");
      cy.contains("Frais").should("exist");
      cy.contains("Transactions").should("exist");
    });

    it("allows access to the fees page", () => {
      cy.intercept("GET", "**/fees*", {
        statusCode: 200,
        body: [],
      }).as("getFees");
      cy.visit("/fees");
      cy.wait("@getFees").its("response.statusCode").should("eq", 200);
      cy.get('[data-testid="fees-table"]').should("be.visible");
    });

    it("blocks access to restricted features", () => {
      cy.intercept("GET", "**/teachers*", {
        statusCode: 400,
        body: {
          error: "Bad Request: feature disabled in fees-only mode",
        },
      }).as("getTeachers");
      cy.visit("/teachers");
      cy.wait("@getTeachers").its("response.statusCode").should("eq", 400);
      cy.get('[data-testid="error-message"]').should("be.visible");
      cy.get('[data-testid="teachers-table"]').should("not.exist");
    });
  });

  describe("Sidebar behavior by role", () => {
    describe("Student", () => {
      beforeEach(() => {
        cy.mockLogin({role: "STUDENT", feesOnly: true});
        cy.visit("/");
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
        cy.mockLogin({role: "MONITOR", feesOnly: true});
        cy.visit("/");
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
        cy.mockLogin({role: "TEACHER", feesOnly: true});
        cy.visit("/");
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
        cy.mockLogin({role: "STAFF_MEMBER", feesOnly: true});
        cy.visit("/");
      });
      it("cache le lien documents", () => {
        cy.getByTestid("other-docs").should("not.exist");
      });
    });

    describe("Organizer", () => {
      beforeEach(() => {
        cy.mockLogin({role: "ORGANIZER", feesOnly: true});
        cy.visit("/");
      });
      it("cache le lien événements", () => {
        cy.getByTestid("event-menu").should("not.exist");
      });
    });
  });
});
