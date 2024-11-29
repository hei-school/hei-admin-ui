import {
  lettersMocks,
  newLetter2,
  statsMocks,
  student1LettersMocks,
} from "../fixtures/api_mocks/letters-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const ITEM_PER_LIST = 10;

describe("Manager.Letters", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `students/letters/stats`, statsMocks).as("getStats");
    cy.intercept(
      "GET",
      `/students/letters?page=1&page_size=10`,
      lettersMocks.slice(0, ITEM_PER_LIST)
    ).as("getAllLetters");
    cy.intercept(
      "GET",
      `/students/letters?page=1&page_size=10&name=${student1Mock.first_name}`,
      student1LettersMocks.slice(0, ITEM_PER_LIST)
    ).as("getLettersFilteredByfirstName");
    cy.intercept(
      "GET",
      `/students/letters?page=1&page_size=10&ref=${newLetter2[0].ref}`,
      newLetter2
    ).as("getLettersFilteredByRef");
    cy.intercept(
      "GET",
      `/students/letters?page=1&page_size=10&status=${newLetter2[0].status}`,
      newLetter2
    ).as("getLettersFilteredByStatus");
    cy.intercept("PUT", `/letters`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: req.body.id,
          status: "RECEIVED",
          message: "Lettre acceptée avec succès",
        },
      });
    }).as("updateLetter");

    cy.wait("@getStats");
    cy.getByTestid("letters-list-tab").click();
    cy.wait("@getAllLetters");
  });

  it("manager can list all letters", () => {
    cy.getByTestid("letter-list-wrapper")
      .children()
      .should("have.length", ITEM_PER_LIST);
  });

  it("manager can filter by student name", () => {
    cy.getByTestid("more-button").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-letter-first_name").type(student1Mock.first_name);
    cy.contains("Appliquer").click();
    cy.wait("@getLettersFilteredByfirstName");
    cy.getByTestid("letter-list-wrapper")
      .children()
      .first()
      .contains(student1Mock.first_name);
  });

  it("manager can filter by letter ref", () => {
    cy.getByTestid("more-button").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-letter-ref").type(newLetter2[0].ref!);
    cy.contains("Appliquer").click();
    cy.wait("@getLettersFilteredByRef");
    cy.getByTestid("letter-list-wrapper")
      .children()
      .contains(newLetter2[0].ref!);
  });

  it("manager can accept letter", () => {
    cy.getByTestid("more-button").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-letter-status").click();
    cy.get('[role="option"]').contains("En attente").click();
    cy.contains("Appliquer").click();
    cy.wait("@getLettersFilteredByStatus");
    cy.getByTestid("more-icon-item").click();
    cy.getByTestid("accept-letter-button").click();
    cy.get(".ra-confirm").click();
    cy.wait("@updateLetter").then((interception) => {
      expect(interception.response!.statusCode).to.eq(200);
      expect(interception.response!.body).to.have.property(
        "message",
        "Lettre acceptée avec succès"
      );
    });
  });

  it("manager can refuse letter", () => {
    cy.getByTestid("more-button").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-letter-status").click();
    cy.get('[role="option"]').contains("En attente").click();
    cy.contains("Appliquer").click();
    cy.wait("@getLettersFilteredByStatus");
    cy.getByTestid("more-icon-item").click();
    cy.getByTestid("refuse-button").click();
    cy.getByTestid("refuse-reason-input").type(
      "because your document is not valid"
    );
    cy.get(".ra-confirm").click();
    cy.wait("@updateLetter").then((interception) => {
      expect(interception.response!.statusCode).to.eq(200);
    });
  });
});
