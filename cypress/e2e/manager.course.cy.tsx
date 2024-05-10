import {Course} from "@haapi/typescript-client";
import {courseMock1, courseMocks} from "../fixtures/api_mocks/course-mocks";

const NEW_COURSE: Required<Course> = {
  ...courseMock1,
  name: "name updated",
  credits: 10,
  total_hours: 10,
  code: "new code",
};

describe("Manager.Courses", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `/courses?page=1&page_size=10`, courseMocks).as(
      "getCoursesPage1"
    );
    cy.intercept("GET", `/courses/${courseMock1.id}`, courseMock1).as(
      "getCourses1"
    );
    cy.intercept(
      "GET",
      `/courses?name=${courseMock1.name}&page=1&page_size=10`,
      [courseMock1]
    ).as("getFilteredCourses");
    cy.getByTestid("course-menu").click();
    cy.wait("@getCoursesPage1");
  });

  it("can list all courses", () => {
    cy.get("tbody tr").should("have.length", courseMocks.length);
    cy.contains(courseMock1.name);
    cy.contains(courseMock1.total_hours);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("course-filter-name").type(courseMock1.name);
    cy.getByTestid("apply-filter").click();

    cy.wait("@getFilteredCourses");
    cy.get("tbody tr").should("have.length", 1);
    cy.contains(courseMock1.name);
    cy.contains(courseMock1.total_hours);
  });

  it("can create new course", () => {
    cy.intercept("PUT", "/courses", [NEW_COURSE]).as("createCourse");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.get("#name").type(NEW_COURSE.name);
    cy.get("#code").type(NEW_COURSE.code);
    cy.get("#total_hours").type(NEW_COURSE.total_hours.toString());
    cy.get("#credits").type(NEW_COURSE.credits.toString());
    cy.get(".RaToolbar-defaultToolbar > .MuiButtonBase-root")
      .as("saveButton")
      .click();

    cy.wait("@createCourse").then((intereception) => {
      const body = intereception.request.body as Required<Course>[];
      expect(body).to.deep.equal([{...NEW_COURSE, id: body[0].id}]);
    });
    cy.contains("Cours créer avec succès");
  });

  it("can edit course", () => {
    cy.get("tbody tr").should("have.length", courseMocks.length);
    cy.intercept("PUT", "/courses", [courseMock1]).as("editCourses");
    cy.getByTestid("edit-button").first().click();
    cy.get("#name").clear().type(NEW_COURSE.name);
    cy.get("#code").clear().type(NEW_COURSE.code);
    cy.get("#total_hours").clear().type(NEW_COURSE.total_hours.toString());
    cy.get("#credits").clear().type(NEW_COURSE.credits.toString());
    cy.get('form > .MuiToolbar-root > [data-testid="edit-button"]')
      .as("saveButton")
      .click();

    cy.wait("@editCourses").then((intereception) => {
      const body = intereception.request.body as Course[];
      expect(body.length).to.be.equal(1);
      expect(body[0]).to.deep.equal(NEW_COURSE);
    });

    cy.contains("Cours mis à jour");
  });
});
