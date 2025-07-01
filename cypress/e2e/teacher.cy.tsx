import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";
import {teacher1Mock} from "../fixtures/api_mocks/teachers-mocks";

describe("Teacher", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
  });

  it("lands on profile page if succeeds", () => {
    cy.get("#ha-menu")
      .should("not.contain", "Enseignants")
      .and("contain", "Étudiants");
    cy.get("#main-content")
      .should("contain", teacher1Mock.ref)
      .and("contain", teacher1Mock.last_name)
      .and("contain", teacher1Mock.address)
      .and("contain", teacher1Mock.email)
      .and("contain", teacher1Mock.phone);
  });

  it("can check one student", () => {
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudents2"
    );
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.get('a[href="/students"]').click(); // Étudiants menu
    cy.wait("@getStudents");
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.contains(student1Mock.first_name).click();
    cy.wait("@getStudent1");
    cy.get("#main-content")
      .should("contain", student1Mock.ref)
      .and("contain", student1Mock.first_name)
      .and("contain", student1Mock.last_name)
      .and("contain", student1Mock.address)
      .and("contain", student1Mock.email)
      .and("contain", student1Mock.phone)
      .and("not.contain", "CRÉER")
      .and("not.contain", "ÉDITER");
  });

  it("can list and filter students", () => {
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentByFirstName");
    cy.intercept(
      "GET",
      `/students?page=2&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentByFirstName2");
    // note(listAndFilterStudents)
    cy.get('a[href="/students"]').click(); // Étudiants menu
    cy.wait("@getStudentsPage1");
    cy.wait("@getStudentsPage2");
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.window().scrollTo("bottom");
    cy.contains("Page: 1");
    cy.contains(`Taille: ${studentsMock.length}`);
    cy.get('td input[type="checkbox"]').should("not.exist");
    cy.get("td a").should("not.contain", "ÉDITER");
    cy.get(".RaList-main>").should("not.contain", "CRÉER");

    cy.get("#next-button").click();
    cy.wait("@getStudentsPage2");
    cy.contains("Page: 2");

    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.get('[data-testid="apply-filter"]').click();
    cy.wait("@getStudentByFirstName");
    cy.contains("Page: 1");
  });
});
