describe("Aws waf handler", () => {
  it("should display captcha dialog on status: 405", () => {
    cy.login({
      role: "MANAGER",
    });

    cy.intercept("GET", "**/monitors*", (req) => {
      req.reply({
        statusCode: 405,
        body: {},
      });
    }).as("monitorsRequest");
    cy.get('[href="/monitors"]').click();

    cy.wait("@monitorsRequest");

    cy.location("pathname").should("include", "human-verification");

    cy.getByTestid("aws-waf-captcha-dialog").should("be.visible");
  });
});
