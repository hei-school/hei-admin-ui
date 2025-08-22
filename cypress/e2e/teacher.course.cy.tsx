import {CourseAssignment1Mock} from "../fixtures/api_mocks/course-assignment-mocks";
import {courseMock1} from "../fixtures/api_mocks/course-mocks";
import {student1LettersMocks} from "../fixtures/api_mocks/letters-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {teacher1Mock} from "../fixtures/api_mocks/teachers-mocks";

describe("Teacher course", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/letters?page=1&page_size=10`,
      student1LettersMocks.slice(0, 10)
    ).as("getStudent1LettersPage1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/letters?page=2&page_size=10`,
      student1LettersMocks.slice(0, 10)
    ).as("getStudent1LettersPage2");
    cy.getByTestid("course-menu").click();

    cy.intercept("GET", `/teachers/${teacher1Mock.id}/course_assignments?**`, [
      CourseAssignment1Mock,
    ]).as("getTeacherCourseAssignment");
  });

  it("can get courses assigned to teacher", () => {
    cy.wait("@getTeacherCourseAssignment");
    cy.contains(courseMock1.name);
  });
});
