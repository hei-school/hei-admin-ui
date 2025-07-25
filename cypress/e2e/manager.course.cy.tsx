import {Course} from "@haapi/typescript-client";
import {
  CourseAssignment1Mock,
  createCourseAssignment,
} from "../fixtures/api_mocks/course-assignment-mocks";
import {courseMock1, courseMocks} from "../fixtures/api_mocks/course-mocks";
import {groupsMock} from "../fixtures/api_mocks/groups-mocks";
import {teacher1Mock, teachersMock} from "../fixtures/api_mocks/teachers-mocks";

const NEW_COURSE: Required<Course> = {
  ...courseMock1,
  name: "name updated",
  credits: 10,
  total_hours: 10,
  code: "new code",
};

describe("Manager.Courses", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/courses?page=1&page_size=10`, courseMocks).as(
      "getCoursesPage1"
    );
    cy.intercept("GET", `/courses?page=2&page_size=10`, courseMocks).as(
      "getCoursesPage2"
    );
    cy.intercept("GET", `/courses/${courseMock1.id}`, courseMock1).as(
      "getCourses1"
    );
    cy.intercept(
      "GET",
      `/courses?name=${courseMock1.name}&page=1&page_size=10`,
      [courseMock1]
    ).as("getFilteredCourses");
    cy.intercept(
      "GET",
      `/courses?name=${courseMock1.name}&page=2&page_size=10`,
      [courseMock1]
    ).as("getFilteredCourses2");
    cy.getByTestid("course-menu").click();
    cy.wait("@getCoursesPage1");
    cy.intercept(
      "GET",
      `/course_assignments?course_id=${courseMock1.id}&page=1&page_size=10`,
      [CourseAssignment1Mock]
    ).as("getTeacherCourseAssignment");
    cy.intercept(
      "GET",
      `/course_assignments?course_id=${courseMock1.id}&page=2&page_size=10`,
      [CourseAssignment1Mock]
    ).as("getTeacherCourseAssignment");
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
    cy.getByTestid("course-level-select").click();
    cy.get("li").contains(NEW_COURSE.level).click();
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

  it("can get teacher assigned to course", () => {
    cy.get("tbody tr").should("have.length", courseMocks.length);
    cy.getByTestid("show-button").first().click();
    cy.wait("@getCourses1");
    cy.wait("@getTeacherCourseAssignment");
    cy.get(
      ".teacher-assigned-list .MuiTableRow-root.MuiTableRow-hover.RaDatagrid-row.RaDatagrid-rowEven.RaDatagrid-selectable.css-fdcvim-MuiTableRow-root"
    ).contains(`${CourseAssignment1Mock.main_teacher.first_name}`);
    cy.get(
      ".teacher-assigned-list .MuiTableRow-root.MuiTableRow-hover.RaDatagrid-row.RaDatagrid-rowEven.RaDatagrid-selectable.css-fdcvim-MuiTableRow-root"
    ).contains(`${CourseAssignment1Mock.main_teacher.last_name}`);
    cy.get(
      ".teacher-assigned-list .MuiTableRow-root.MuiTableRow-hover.RaDatagrid-row.RaDatagrid-rowEven.RaDatagrid-selectable.css-fdcvim-MuiTableRow-root"
    ).contains(`${CourseAssignment1Mock.main_teacher.email}`);
    cy.get(
      ".teacher-assigned-list .MuiTableRow-root.MuiTableRow-hover.RaDatagrid-row.RaDatagrid-rowEven.RaDatagrid-selectable.css-fdcvim-MuiTableRow-root"
    ).contains(CourseAssignment1Mock.groups.map((g) => g.ref).join(", "));
  });
  it("can assign teacher to course", () => {
    cy.intercept("GET", "/teachers*", teachersMock).as("getTeachers");
    cy.intercept("GET", `/groups*`, groupsMock).as("getGroups");
    cy.intercept("PUT", `/course_assignments`, [createCourseAssignment]).as(
      "createCourseAssignment"
    );
    cy.get("tbody tr").should("have.length", courseMocks.length);
    cy.getByTestid("show-button").first().click();
    cy.wait("@getCourses1");
    cy.wait("@getTeacherCourseAssignment");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("teacher-select").click();
    teachersMock.forEach((teacher) => {
      cy.get("li")
        .contains(`${teacher?.first_name} ${teacher?.last_name}`)
        .should("exist");
    });
    cy.get("li")
      .contains(`${teacher1Mock.first_name} ${teacher1Mock.last_name}`)
      .click();
    cy.getByTestid("group-select").click();
    groupsMock.forEach((group) => {
      cy.get("li").contains(`${group.ref}`).should("exist");
    });
    cy.get("li").contains(groupsMock[0].ref).click();
    cy.get("body").type("{esc}");
    cy.contains("Enregistrer").click();
    cy.wait("@createCourseAssignment")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Élément créer avec succès");
  });
});
