import {calendarMock} from "../../fixtures/api_mocks/calendar-mock";

describe("Aws waf handler", () => {
  it("should display captcha dialog on status: 405", () => {
    cy.mockLogin({
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

describe("Public link display calendar", () => {
  beforeEach(() => {
    cy.intercept("GET", "events?page=1&page_size=100**", calendarMock).as(
      "getEvents"
    );
  });

  it("their is event", () => {
    cy.visit("/calendar");
    cy.wait("@getEvents");
    cy.get(".rbc-event").should("have.length.at.least", 1);
    cy.contains("F").should("exist");
  });
});
