import {courseMocks} from "../fixtures/api_mocks/course-mocks";
import {
  event1mock,
  eventparticipant1mock,
  eventParticipantsMock,
  eventsMock,
} from "../fixtures/api_mocks/event-mocks";
import {groupsMock} from "../fixtures/api_mocks/groups-mocks";

describe("Manager.event", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `*/events*`, eventsMock).as("getEventsPage1");
    cy.intercept("GET", `*/events/${event1mock.id}`, event1mock);
    cy.intercept("PUT", `*/events/${event1mock.id}`, {
      ...event1mock,
      title: "Change title",
    });
    cy.intercept(
      "GET",
      `*/events/${event1mock.id}/participants?page=1&page_size=10`,
      eventParticipantsMock
    ).as("getEventParticipantPage1");
    cy.intercept(
      "PUT",
      `*/events/${event1mock.id}/participants`,
      eventParticipantsMock
    ).as("saveEventParticipant");
    cy.intercept("GET", `*/events/${event1mock.id}`, event1mock).as(
      "getEvent1"
    );
    cy.intercept("GET", "*/groups?page=1&page_size=499", groupsMock).as(
      "getGroups"
    );
    cy.intercept("GET", "*/courses?page=1&page_size=499", courseMocks).as(
      "getCourses"
    );
    cy.intercept("PUT", "*/events", eventsMock);
    cy.visit("/events");
  });

  it("manager can create event", () => {
    cy.contains("Listes").click();
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").click();
    cy.getByTestid("event-title").click();
    cy.get('[data-value="Pi"]').click();
    cy.getByTestid("event-description").type("Test for event");
    cy.get("[name=start]").type("101020240800");
    cy.get("[name=end]").type("101020241000");
    cy.getByTestid("event-type").click();
    cy.contains("Intégration").click();
    cy.getByTestid("event-groups").type("g");
    cy.contains("group_ref1").click();
    cy.contains("Enregistrer").click();
    cy.contains("Élément créé");
  });

  it("manager can list event", () => {
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

  it("manager can edit event", () => {
    cy.contains("Listes").click();
    cy.contains("Editer").first().click();
    cy.getByTestid("event-title").click();
    cy.get('[data-value="Pi"]').click();
    cy.contains("Enregistrer").click();
  });

  it("manager can list & change status event participant", () => {
    cy.contains("Listes").click();
    cy.get("#event-show").click({force: true});
    cy.wait("@getEventParticipantPage1");
    cy.getByTestid(`eventparticipant-${eventparticipant1mock.id}-status`)
      .as("participantStatus")
      .within(() => {
        cy.getByTestid("PRESENT").should("have.class", "MuiChip-filled");
        cy.getByTestid("MISSING").should("have.class", "MuiChip-outlined");
        cy.contains("Absent").click();
      });
    cy.contains("Enregistrer").click();
    cy.wait("@saveEventParticipant").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });
    cy.contains("Enregistrer avec succès.");
  });

  it("manager can add group", () => {
    cy.contains("Listes").click();
    cy.get("#event-show").click({force: true});
    cy.wait("@getEventParticipantPage1");
    cy.getByTestid("menu-list-action").click();
    cy.contains("Ajout groupe").click();
    cy.wait("@getGroups");
    cy.getByTestid("add-group").type("g");
    cy.contains("group_ref1").click();
    cy.getByTestid("add-group-form").within(() => {
      cy.contains("Enregistrer").click();
    });
    cy.contains("Groupe ajouté avec succès");
  });
});
