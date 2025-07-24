import {
  calendarMock,
  nextcalendarMock,
} from "../fixtures/api_mocks/calendar-mock";
import {
  event1mock,
  eventparticipant1mock,
  eventParticipantsMock,
  eventsMock,
} from "../fixtures/api_mocks/event-mocks";

describe("Student.event", () => {
  beforeEach(() => {
    cy.mockLogin({role: "STUDENT"});
    cy.intercept("GET", `/events?page=1&page_size=10`, eventsMock).as(
      "getEventsPage1"
    );
    cy.intercept("GET", "events?page=1&page_size=100**", calendarMock).as(
      "getEvents"
    );
    cy.intercept("GET", `/events?page=2&page_size=10`, eventsMock).as(
      "getEventsPage2"
    );
    cy.intercept("GET", `/events/${event1mock.id}`, event1mock);
    cy.intercept("PUT", `/events/${event1mock.id}`, {
      ...event1mock,
      title: "Change title",
    });
    cy.intercept(
      "GET",
      `/events/${event1mock.id}/participants?page=1&page_size=50`,
      eventParticipantsMock
    ).as("getEventParticipantPage1");
    cy.intercept(
      "GET",
      `/events/${event1mock.id}/participants?page=2&page_size=50`,
      eventParticipantsMock
    ).as("getEventParticipantPage2");
    cy.intercept(
      "PUT",
      `/events/${event1mock.id}/participants`,
      eventParticipantsMock
    ).as("saveEventParticipant");
    cy.intercept("GET", `/events/${event1mock.id}`, event1mock).as("getEvent1");
    cy.intercept("PUT", "/events", eventsMock);
    cy.getByTestid("event-menu").click();
    cy.intercept("GET", "/events?page=1&page_size=500**", eventsMock);
    cy.intercept("GET", "/events?page=2&page_size=500**", eventsMock);
  });

  it("student can list event", () => {
    cy.contains("Listes").click();
    cy.getByTestid("event-list-content")
      .should("contain", event1mock.course?.code)
      .and(
        "contain",
        `${event1mock.planner?.first_name} ${event1mock.planner?.last_name}`
      )
      .and("contain", event1mock.description)
      .children()
      .should("have.length", 2);
  });

  it("student cannot edit or create event", () => {
    cy.contains("Listes").click();
    cy.contains("Editer").should("not.exist");
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").should("not.exist");
  });

  it("student cannot change status event participant", () => {
    cy.contains("Listes").click();
    cy.get("#event-show").click({force: true});
    cy.wait("@getEventParticipantPage1");
    cy.getByTestid(`eventparticipant-${eventparticipant1mock.id}-status`)
      .as("participantStatus")
      .within(() => {
        cy.getByTestid("MISSING").should("have.class", "MuiChip-outlined");
        cy.contains("Absent").click();
        cy.getByTestid("PRESENT").should("have.class", "MuiChip-filled");
      });
    cy.contains("Enregistrer").should("not.exist");
  });

  it("student can export calendar", () => {
    cy.getByTestid("menu-list-action").click();
    cy.contains("Export").click();
    cy.getByTestid("export-calendar-button").click();
    const downloadedFile = "cypress/downloads/calendar_week.jpg";
    cy.readFile(downloadedFile, "binary", {timeout: 5000}).should((buffer) => {
      expect(buffer.length).to.be.gt(0);
    });
  });
});

describe("Student.event participant", () => {
  beforeEach(() => {
    cy.mockLogin({role: "STUDENT"});
    cy.intercept("GET", "events**", calendarMock).as("getEvents");
    cy.getByTestid("event-menu").click();
  });
  it("calendar is display", () => {
    cy.get("#calendar_content").should("exist");
    it("displays initial events", () => {
      cy.get(".rbc-event").should("have.length.at.least", 1);
      cy.contains("F").should("exist");
    });
  });

  it("handles range change with Date array (week view navigation)", () => {
    cy.intercept("GET", "events?**", nextcalendarMock).as("getNextWeekEvents");
    cy.get(".fc-next-button > .fc-icon").click();
    cy.wait("@getNextWeekEvents");
    cy.get(".fc").should("have.length.at.least", 1);
  });

  it("calendar event click and popover actions are covered", () => {
    cy.get("#calendar_content").should("exist");
    cy.contains(calendarMock[0].course?.code!).click();
    cy.get("[role='presentation']").should("be.visible");
    cy.get("[role='presentation']").should("contain.text", "[");
    cy.get("[role='presentation']").should("contain.text", "Présence");
    cy.get("body").type("{esc}");
    cy.getByTestid("menu-list-action").click();
    cy.contains("Export").click();
    cy.getByTestid("export-calendar-button").click();
    cy.get("body").type("{esc}");
  });
});
