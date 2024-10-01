import {
  newLetter,
  statsMocks,
  student1LettersMocks,
} from "../fixtures/api_mocks/letters-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

const ITEM_PER_LIST = 10;

describe("Student.Letters", () => {
  beforeEach(() => {
    cy.login({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/letters?page=1&page_size=10`,
      student1LettersMocks.slice(0, ITEM_PER_LIST)
    ).as("getStudent1LettersPage1");
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/letters?*`,
      newLetter
    ).as("createLetter");
    cy.intercept("GET", `/students/${newLetter.id}`);
    cy.intercept("GET", `letters/stats`, statsMocks).as("getStats");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/letters?page=1&page_size=10&status=PENDING`,
      student1LettersMocks
    ).as("getStudent1LettersPending");
  });

  it("student can list his letters", () => {
    cy.getByTestid("letters-list-tab").click();
    cy.wait("@getStudent1LettersPage1");
    cy.getByTestid("letter-list-wrapper")
      .children()
      .should("have.length", ITEM_PER_LIST);
  });

  it("student can create his letters", () => {
    cy.getByTestid("letters-list-tab").click();
    cy.getByTestid("letter-create-button").click();
    cy.get("#description").type(newLetter.description!);
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.get(".ra-confirm").click();
    cy.wait("@createLetter").then((interception) => {
      expect(interception.response!.statusCode).to.eq(200);
    });
  });
});

describe("Manager.Letters.student", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.contains("Page : 1");
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.wait("@getStudentsByName");
    cy.contains("Page : 1");
    cy.contains("Taille : 1 ");
    cy.contains(student1Mock.first_name).click();
  });

  it("manager can list student letter", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/letters?page=1&page_size=10`,
      student1LettersMocks.slice(0, ITEM_PER_LIST)
    ).as("getStudent1LettersPage1");
    cy.getByTestid("letters-list-tab").click();
    cy.wait("@getStudent1LettersPage1");
    cy.getByTestid("letter-list-wrapper")
      .children()
      .should("have.length", ITEM_PER_LIST);
  });

  it("manager can create letters for student", () => {
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/letters?*`,
      newLetter
    ).as("createLetter");
    cy.getByTestid("letters-list-tab").click();
    cy.getByTestid("letter-create-button").click();
    cy.get("#description").type(newLetter.description!);
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.get(".ra-confirm").click();
    cy.wait("@createLetter").then((interception) => {
      expect(interception.response!.statusCode).to.eq(200);
    });
  });
});
