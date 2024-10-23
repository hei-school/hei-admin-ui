import { event1mock, eventparticipant1mock, eventParticipantsMock, eventsMock } from "../fixtures/api_mocks/event-mocks";

describe("Teacher.event", () => {
    beforeEach(() => {
      cy.login({role: "TEACHER"});
      cy.intercept(
        "GET",
        `/events?page=1&page_size=10`,
        eventsMock
      ).as("getEventsPage1");
      cy.intercept(
        "GET",
        `/events/${event1mock.id}`,
        event1mock
      )
      cy.intercept(
        "PUT",
        `/events/${event1mock.id}`,
        {...event1mock, title: "Change title"}
      )
      cy.intercept(
        "GET",
        `/events/${event1mock.id}/participants?page=1&page_size=10`,
        eventParticipantsMock
      ).as("getEventParticipantPage1");
      cy.intercept(
        "PUT",
        `/events/${event1mock.id}/participants`,
        eventParticipantsMock
      ).as("saveEventParticipant");
      cy.intercept(
        "GET",
        `/events/${event1mock.id}`,
        event1mock
      ).as("getEvent1");
      cy.intercept(
        "PUT",
        "/events",
        eventsMock
      )
      cy.getByTestid("event-menu").click();
    });

    xit("teacher can list event", () => { 
        cy.getByTestid("event-list-content")
        .should("contain", event1mock.title)
        .and("contain", `${event1mock.planner?.first_name} ${event1mock.planner?.last_name}`)
        .and("contain", event1mock.description)
        .children()
        .should("have.length", 2)
      });

    it("teacher cannot edit or create event", () => {
        cy.contains("Editer").should("not.exist")
        cy.getByTestid("menu-list-action").click()
        cy.contains("Créer").should("not.exist")
    })

    it("teacher can list & change status event participant", () => {
        cy.contains("Présence").click()
        cy.wait("@getEventParticipantPage1")
        cy.getByTestid(`eventparticipant-${eventparticipant1mock.id}-status`).as("participantStatus").within(() => {
          cy.getByTestid("PRESENT").should("have.class", "MuiChip-filled")
          cy.getByTestid("MISSING").should("have.class", "MuiChip-outlined")
          cy.contains("Absent").click()
        })
        cy.contains("Enregistrer").click()
        cy.wait("@saveEventParticipant").then((interception)=> {
          expect(interception.response?.statusCode).to.eq(200)
        })
        cy.contains("Enregistrer avec succès.")
        cy.get("@participantStatus").within(() => {
          cy.getByTestid("MISSING").should("have.class", "MuiChip-filled")
          cy.getByTestid("PRESENT").should("have.class", "MuiChip-outlined")
        })
      })
})