import {
  calendarMock,
  nextcalendarMock,
} from "../fixtures/api_mocks/calendar-mock";

describe("Public link display calendar", () => {
  beforeEach(() => {
    cy.mockLogin({
      role: "STUDENT",
    });
    cy.intercept("GET", "events?page=1&page_size=100**", calendarMock).as(
      "getEvents"
    );
    cy.visit("/calendar");
    cy.wait("@getEvents");
  });

  it("displays initial events", () => {
    cy.get(".rbc-event").should("have.length.at.least", 1);
    cy.contains("F").should("exist");
  });

  it("handles range change with Date array (week view navigation)", () => {
    cy.intercept("GET", "events?page=1&page_size=100**", nextcalendarMock).as(
      "getNextWeekEvents"
    );
    cy.get(".rbc-toolbar button").contains("Suivant").click();
    cy.wait("@getNextWeekEvents");
    cy.get(".rbc-event").should("have.length.at.least", 1);
  });

  it("handles range change with DateRange (month view navigation)", () => {
    cy.intercept("GET", "events?page=1&page_size=100**", calendarMock).as(
      "getMonthEvents"
    );
    cy.get(".rbc-toolbar button").contains("Mois").click();
    cy.wait("@getMonthEvents");
    cy.get(".rbc-event").should("have.length.at.least", 1);
  });

  it("changes calendar view", () => {
    cy.get(".rbc-toolbar button").contains("Mois").click();
    cy.get(".rbc-month-view").should("exist");
    cy.get(".rbc-toolbar button").contains("Semaine").click();
    cy.get(".rbc-time-view").should("exist");
    cy.get(".rbc-toolbar button").contains("Jour").click();
    cy.get(".rbc-time-view").should("exist");
  });
});
