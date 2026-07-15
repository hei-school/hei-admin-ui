describe("Fees-only mode", () => {
  describe("when fees-only mode is enabled", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/whoami", {
        statusCode: 200,
        body: {
          feesOnly: true,
          email: "test.user@mail.com",
          role: "school-admin",
        },
      }).as("whoami");

      cy.login("test.user@mail.com");
      cy.visit("/");
      cy.wait("@whoami");
    });

    it("hides restricted navigation items", () => {
      cy.get('[data-testid="sidebar"]').should("not.exist");
    });

    it("allows access to the fees page", () => {
      cy.intercept("GET", "**/fees*", {
        statusCode: 200,
        body: [],
      }).as("getFees");

      cy.visit("/fees");

      cy.wait("@getFees")
        .its("response.statusCode")
        .should("eq", 200);

      cy.get('[data-testid="fees-table"]')
        .should("be.visible");
    });

    it("blocks access to restricted features", () => {
      cy.intercept("GET", "**/teachers*", {
        statusCode: 400,
        body: {
          error: "Bad Request: feature disabled in fees-only mode",
        },
      }).as("getTeachers");

      cy.visit("/teachers");

      cy.wait("@getTeachers")
        .its("response.statusCode")
        .should("eq", 400);

      cy.get('[data-testid="error-message"]')
        .should("be.visible");

      cy.get('[data-testid="teachers-table"]')
        .should("not.exist");
    });

    it("prevents direct navigation to restricted routes", () => {
      cy.visit("/teachers");

      cy.url()
        .should("not.include", "/teachers");
    });
  });
});