import {
  event1mock,
  eventParticipantsMock,
} from "../fixtures/api_mocks/event-mocks";
import {newLetter} from "../fixtures/api_mocks/letters-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Letter.event", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `*/events/${event1mock.id}/participants?page=1&page_size=10`,
      eventParticipantsMock
    ).as("getEventParticipantPage1");
    cy.intercept("POST", `*/users/${student1Mock.id}/letters?*`, newLetter).as(
      "createLetter"
    );
    cy.intercept("GET", `*/events/${event1mock.id}`, event1mock);
  });

  it("student can upload letter", () => {
    cy.login({role: "STUDENT"});
    cy.visit(`/events/${event1mock.id}/participants`);

    cy.getByTestid("attach-file").last().click({force: true});
    cy.get("#description").type("missing justify");
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.getByTestid("add-letter").within(() => {
      cy.contains("Enregistrer").last().click();
    });
    cy.contains("Confirmer").click();
    cy.wait("@createLetter");
    cy.contains("Lettre créée avec succès");
  });
});
