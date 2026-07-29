import {formatDate} from "@/utils/date";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {courseMocks} from "../../fixtures/api_mocks/course-mocks";
import {
  courseAssignmentMocks,
  examCreateMock,
  examMocks,
  examMocksfiltered,
} from "../../fixtures/api_mocks/exam-mocks";
import {group1Mock, groupsMock} from "../../fixtures/api_mocks/groups-mocks";
import {teachersMock} from "../../fixtures/api_mocks/teachers-mocks";

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

    cy.intercept("GET", `/exams?teacher_id=${teachersMock[0].id}**`, []).as(
      "getNoExams"
    );
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
    cy.intercept(
      "GET",
      `/exams?teacher_id=${teachersMock[0].id}**`,
      examMocks
    ).as("getExams");
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

describe("Exam as ADMIN", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept("GET", "/exams?page=1&page_size=12", examMocks).as("getExams");
    cy.intercept("GET", "/exams?page=2&page_size=12", examMocks).as("getExams");
    cy.intercept("GET", "/teachers?**", teachersMock).as("getTeachers");
    cy.intercept("GET", "/courses?**", courseMocks).as("getCourses");
    cy.intercept("GET", "/groups?**", groupsMock).as("getGroups");
    cy.intercept(
      "GET",
      `/exams?course_code=${courseMocks[0].code}&**`,
      examMocksfiltered
    ).as("getExamsfiltered");
    cy.intercept(
      "GET",
      `/exams?group_ref=${group1Mock.ref}&**`,
      examMocksfiltered
    ).as("getExamsfilteredGroup");
    cy.intercept(
      "GET",
      `/exams?teacher_id=${teachersMock[0].id}&**`,
      examMocksfiltered
    ).as("getTeacherExams");
    cy.visit("/exams");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
  });

  it("display exam list filter by code  ", () => {
    cy.getByTestid("course-filter").click();
    cy.getByTestid(`option-${courseMocks[0].code}`).click();
    cy.getByTestid("apply-filter").click();
    cy.wait("@getExamsfiltered");
    cy.getByTestid("exam-card")
      .first()
      .contains(examMocksfiltered[0].title ?? "")
      .should("be.visible");
    cy.getByTestid("exam-card").should("have.length", examMocksfiltered.length);
    cy.getByTestid("exam-card")
      .first()
      .contains(`${examMocksfiltered[0].course_assignment?.course?.code}`)
      .should("be.visible");
  });

  it("display exam list filter by group", () => {
    cy.getByTestid("group-filter").click();
    cy.getByTestid(`option-${group1Mock.ref}`).click();
    cy.getByTestid("apply-filter").click();
    cy.wait("@getExamsfilteredGroup");
    cy.getByTestid("exam-card")
      .first()
      .contains(examMocksfiltered[0].title ?? "")
      .should("be.visible");
    cy.getByTestid("exam-card").should("have.length", examMocksfiltered.length);
    cy.getByTestid("exam-card")
      .first()
      .contains(`${examMocksfiltered[0].course_assignment?.course?.code}`)
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(
        `${examMocksfiltered[0].course_assignment?.groups
          ?.map((group) => group.ref)
          .join(", ")}`
      )
      .should("be.visible");
  });

  it("display exam list with teacher filter", () => {
    cy.getByTestid("teacher-filter").click();
    cy.getByTestid(`option-${teachersMock[0].id}`).click();
    cy.getByTestid("apply-filter").click();
    cy.wait("@getTeacherExams");
    cy.getByTestid("exam-card")
      .first()
      .contains(examMocksfiltered[0].title ?? "")
      .should("be.visible");
    cy.getByTestid("exam-card").should("have.length", examMocksfiltered.length);
    cy.getByTestid("exam-card")
      .first()
      .contains(`${examMocksfiltered[0].course_assignment?.course?.code}`)
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(
        `${examMocksfiltered[0].course_assignment?.groups
          ?.map((group) => group.ref)
          .join(", ")}`
      )
      .should("be.visible");
    cy.getByTestid("exam-card")
      .first()
      .contains(
        `${examMocksfiltered[0].course_assignment?.main_teacher?.first_name}`
      )
      .should("be.visible");
  });
});
