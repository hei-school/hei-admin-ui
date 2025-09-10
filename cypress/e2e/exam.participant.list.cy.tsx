import {formatDate} from "@/utils/date";
import {courseMocks} from "../fixtures/api_mocks/course-mocks";
import {
  courseAssignmentMocks,
  examCreateMock,
  examMocks,
} from "../fixtures/api_mocks/exam-mocks";
import {groupsMock} from "../fixtures/api_mocks/groups-mocks";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

const pageAssertions = () => {
  cy.contains("Liste des examens").should("be.visible");
  cy.contains(
    "Veuillez trouver ci-joint la liste des différents examens."
  ).should("be.visible");
};

function getLocalDateTimeForUTC(targetUTCString: string) {
  const date = new Date(targetUTCString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

describe("ExamParticipantList", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
    cy.intercept("GET", "/exams?*", [examMocks[0]]).as("getExamsAfterUpdate");
    cy.intercept("PUT", "/exams", (req) => {
      const actual = req.body;
      expect(
        new Date(actual.examination_date).toISOString().slice(0, 16)
      ).to.eq(
        new Date(examCreateMock.examination_date).toISOString().slice(0, 16)
      );
      req.reply({statusCode: 200, body: examMocks[0]});
    }).as("putExam");

    cy.intercept("GET", "/exams?page=1&page_size=12", []).as("getNoExams");
    cy.intercept("GET", "/exams?page=2&page_size=12", []).as("NoExams2");
    cy.intercept("GET", "/teachers?**", teachersMock).as("getTeachers");
    cy.intercept("GET", "/courses?**", courseMocks).as("getCourses");
    cy.intercept("GET", "/groups?**", groupsMock).as("getGroups");
    cy.intercept(
      "GET",
      `teachers/${teachersMock[0].id}/course_assignments?**`,
      courseAssignmentMocks
    ).as("getCourseAssignments");
  });

  it("should return no exams", () => {
    cy.visit("/exams");
    cy.wait("@getNoExams");
    pageAssertions();
    cy.contains("Aucun examen trouvé.").should("be.visible");
    cy.get('[data-testid="exam-card"]').should("not.exist");
  });

  it("should return list of exams", () => {
    cy.intercept("GET", "/exams?page=1&page_size=12", examMocks).as("getExams");
    cy.intercept("GET", "/exams?page=2&page_size=12", examMocks).as(
      "getExams2"
    );
    cy.visit("/exams");
    cy.wait("@getExams");
    pageAssertions();
    cy.getByTestid("exam-card")
      .first()
      .contains(examMocks[0].title ?? "")
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(
        `Coef. ${examMocks[0].coefficient?.numerator}/${examMocks[0].coefficient?.denominator}`
      )
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(`${examMocks[0].course_assignment?.course?.code}`)
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(
        `${examMocks[0].course_assignment?.groups?.map((group) => group.ref).join(", ")}`
      )
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(`${examMocks[0].course_assignment?.main_teacher?.first_name}`)
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(`${formatDate(examMocks[0].examination_date)}`)
      .should("be.visible");
  });

  it("teacher should create or update a new exam", () => {
    cy.visit("/exams");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.url().should("include", "/exams/create");

    cy.get('input[name="title"]').type(examMocks[0].title!);
    cy.wait("@getCourseAssignments");

    cy.getByTestid("coefficient-numerator-input").type(
      String(examMocks[0].coefficient?.numerator)
    );
    cy.getByTestid("coefficient-numerator-input").type(
      String(examMocks[0].coefficient?.numerator)
    );
    cy.getByTestid("coefficient-denominator-input").type(
      String(examMocks[0].coefficient?.denominator)
    );

    cy.getByTestid("course-select").click();
    cy.get('[role="option"]')
      .contains(
        `${courseAssignmentMocks[0].course.code} - ${courseAssignmentMocks[0].groups.map((group) => group.ref).join(", ")}`
      )
      .click();

    const examDateUTC = "2025-08-01T06:30:00.000Z";
    cy.get('input[name="examination_date"]')
      .clear()
      .type(getLocalDateTimeForUTC(examDateUTC));

    cy.get('button[type="submit"]').click();
    cy.contains("Élément créé");
  });
});
