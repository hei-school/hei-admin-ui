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
import {updatedInfo} from "./utils";

let createdStudent = {
  ...createStudent,
  id: "ajbfq-fqdfjdh-2jkg3j",
};
describe("Notifications on error when create, e.g: StudentCreate", () => {
  it("notifies when there is error", () => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `*/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `*/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept("GET", `students/${createdStudent.id}`, createdStudent).as(
      "getStudent"
    );
    cy.intercept(
      "GET",
      `*/students?page=1&page_size=10&last_name=${student1Mock.last_name}`,
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

    cy.contains("Enseignants");
    cy.contains("Étudiants");
    cy.getByTestid("students-menu").click();
    cy.get('[href="/students"]').click();
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.get("#ref").type(createStudent.ref);
    cy.get("#first_name").type(createStudent.first_name);
    cy.get("#last_name").type(createStudent.last_name);
    cy.get("#sex_F").click();
    cy.get("#phone").type(createStudent.phone);
    cy.get("#birth_date").click().type(createStudent.birth_date);
    cy.get(".ra-input-address > .MuiInputBase-root").type(
      createStudent.address
    );
    cy.get("#email").type(createStudent.email);
    cy.get("#entrance_datetime")
      .click()
      .type(createStudent.entrance_datetime.toISOString().slice(0, 10));
    cy.intercept("PUT", "*/students", {
      statusCode: 500,
      body: {
        message: "error",
      },
    }).as("createStudent");
    cy.contains("Enregistrer").click();
    cy.contains("Une erreur s'est produite");
  });
});
describe("Notifications on error when edit, e.g: TeacherEdit", () => {
  it("notifies when there is error", () => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", "*/teachers?page=1&page_size=10", teachersMock).as(
      "getTeachers"
    );
    cy.intercept(
      "GET",
      /teachers\?page=1&page_size=10&(first_name|ref|last_name)=/,
      [teacher1Mock]
    ).as("getFilters");
    cy.intercept("GET", `*/teachers/${teachersMock[0].id}`, teachersMock[0]).as(
      "getTeachers1"
    );

    cy.wait("@getWhoami");
    cy.get('[href="/teachers"]').click();
    cy.get(":nth-child(1) > .column-undefined > .MuiButtonBase-root").as(
      "editButton"
    );
    cy.get("@editButton").click();
    cy.wait("@getTeachers1");
    cy.intercept("PUT", "*/teachers", {
      statusCode: 500,
      body: {
        message: "error",
      },
    }).as("createTeacher");
    cy.get("#last_name").clear().type(updatedInfo.last_name);
    cy.getByTestid("SaveIcon").click();
    cy.contains("Une erreur s'est produite");
  });
});
