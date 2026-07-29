describe("Fees-only mode - Manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
  });

  it("shows only fees-related items in the menu", () => {
    cy.get("#ha-menu")
      .should("contain", "Étudiants")
      .and("contain", "Transactions")
      .and("contain", "Frais")
      .and("not.contain", "Enseignants");
  });

  it("can access the fees page", () => {
    cy.get('[href="/fees"]').click();
    cy.url().should("include", "/fees");
  });

  it("does not render restricted routes, even via direct URL", () => {
    cy.visit("/teachers");
    cy.get('[data-testid="teachers-list"]').should("not.exist");
  });
});

describe("Fees-only mode - Student", () => {
  beforeEach(() => {
    cy.mockLogin({role: "STUDENT"});
    cy.visit("/profile");
  });

  it("shows only the fees link in the menu", () => {
    cy.get("#ha-menu")
      .should("contain", "Frais")
      .and("not.contain", "Enseignants")
      .and("not.contain", "Étudiants");
  });
});
