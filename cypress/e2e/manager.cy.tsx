import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";
import {
  createStudent,
  student1Mock,
  studentsMock,
} from "../fixtures/api_mocks/students-mocks";
import {
  teacher1Mock,
  teacherNameToBeCheckedMock,
  teachersMock,
} from "../fixtures/api_mocks/teachers-mocks";

const newLastname = "Aina herilala";
let createdStudent = {
  ...createStudent,
};
createdStudent.id = "ajbfq-fqdfjdh-2jkg3j";
let updatedStudent = {
  ...student1Mock,
};
updatedStudent.first_name = newLastname;

describe("Manager", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `*/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `*/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `*/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept("GET", `*/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `*/teachers?page=2&page_size=10`, teachersMock).as(
      "getTeachersPage2"
    );
    cy.intercept(
      "GET",
      `*/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`,
      [teacher1Mock]
    ).as("getTeacherByName");
  });

  it("lands on profile page if succeeds", () => {
    cy.get("#main-content")
      .should("contain", manager1Mock.ref)
      .and("contain", manager1Mock.last_name)
      .and("contain", manager1Mock.address)
      .and("contain", manager1Mock.email)
      .and("contain", manager1Mock.phone);
  });

  it("can list and filter students", () => {
    cy.contains("Enseignants");
    cy.contains("Étudiants");

    cy.getByTestid("students-menu").click(); // Étudiants category
    cy.get('[href="#/students"]').click();
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");

    cy.get("button").contains("Suivant").click();
    cy.contains("Page : 2");

    cy.getByTestid("main-search-filter").type(student1Mock.first_name);
    cy.wait("@getStudentsByName");
    cy.get("#main-content table").contains(student1Mock.first_name);
    cy.contains("Page : 1");
  });

  it("can list and filter teachers", () => {
    cy.get('[href="#/teachers"]').click();
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");

    cy.get("button").contains("Suivant").click();
    cy.contains("Page : 2");

    cy.getByTestid("main-search-filter").type(teacherNameToBeCheckedMock);
    cy.wait("@getTeacherByName");
    cy.get("#main-content table").contains(teacherNameToBeCheckedMock);
    cy.contains("Page : 1");
  });
});
