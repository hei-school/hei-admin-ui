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
      `/events/${event1mock.id}/participants?page=1&page_size=50`,
      eventParticipantsMock
    ).as("getEventParticipantPage1");
    cy.intercept(
      "GET",
      `/events/${event1mock.id}/participants?page=2&page_size=50`,
      eventParticipantsMock
    ).as("getEventParticipantPage2");
    cy.intercept("POST", `/users/${student1Mock.id}/letters?*`, newLetter).as(
      "createLetter"
    );
    cy.intercept("GET", `/events/${event1mock.id}`, event1mock);
  });

  it("student can upload letter", () => {
    cy.mockLogin({role: "STUDENT"});
    cy.visit(`/events/${event1mock.id}/participants`);

    cy.getByTestid(`attach-file`).last().click();
    cy.get("#description").type("missing justify");
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.getByTestid("add-letter").within(() => {
      cy.contains("Enregistrer").last().click();
    });
    cy.contains("Confirmer").click();
    cy.wait("@createLetter");
    cy.contains("La lettre a été créée avec succès");
  });

  it("student can view uploaded letter", () => {
    cy.mockLogin({role: "STUDENT"});
    cy.visit(`/events/${event1mock.id}/participants`);

    cy.getByTestid("view-file").first().click();
    cy.contains(`Document : Justificatif de ${student1Mock.first_name}`);
  });
});
