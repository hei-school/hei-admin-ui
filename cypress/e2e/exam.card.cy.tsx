import {formatDate} from "@/utils/date";
import {Exam} from "@haapi/typescript-client";
import {examMocks, gradesMocks} from "../fixtures/api_mocks/exam-mocks";

const baseExam: Exam = {
  id: "exam-001",
  title: "Math Final",
  coefficient: 3,
  examination_date: new Date("2025-06-20"),
  course_assignment: {
    course: {code: "MATH101"},
    groups: [{ref: "G1"}, {ref: "G2"}],
    main_teacher: {first_name: "Jean", last_name: "Dupont"},
  },
};

describe("ExamCard test", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
    cy.intercept("GET", "/exams?*", examMocks).as("getExams");
    cy.visit("/exams");
    cy.wait("@getExams");
    cy.intercept("GET", `/exams/${examMocks[0].id}`, examMocks[0]).as(
      "getExam"
    );
    cy.intercept("GET", `/exams/${examMocks[0].id}/grades?**`, gradesMocks).as(
      "getGrades"
    );
  });

  it("should render all exam info", () => {
    cy.getByTestid("exam-card").should("exist");
    cy.contains(examMocks[0].title ?? "").should("be.visible");
    cy.contains(`Coef. ${examMocks[0].coefficient}`).should("be.visible");
    cy.contains(`${examMocks[0].course_assignment?.course?.code}`).should(
      "be.visible"
    );
    cy.contains(
      `${examMocks[0].course_assignment?.groups?.map((group) => group.ref).join(", ")}`
    ).should("be.visible");
    cy.contains(
      `${examMocks[0].course_assignment?.main_teacher?.first_name}`
    ).should("be.visible");
    cy.contains(`${formatDate(examMocks[0].examination_date)}`).should(
      "be.visible"
    );
  });

  it("should navigate to grades page on click", () => {
    cy.getByTestid("exam-card").first().click();
    cy.url().should("include", `/exams/${examMocks[0].id}/grades`);
    cy.wait("@getGrades");
    cy.contains("Liste des participants").should("be.visible");
    cy.get(".participants-list .MuiTableRow-root")
      .contains(gradesMocks[0].student.ref)
      .should("be.visible");
    cy.get(".participants-list .MuiTableRow-root")
      .contains(gradesMocks[0].student.last_name)
      .should("be.visible");
    cy.get(".participants-list .MuiTableRow-root")
      .contains(gradesMocks[0].student.first_name)
      .should("be.visible");
    cy.get(".participants-list .MuiTableRow-root")
      .contains(gradesMocks[0].grade.score)
      .should("be.visible");
    cy.get(".participants-list .MuiTableRow-root")
      .contains(formatDate(gradesMocks[0].grade.created_at, false))
      .should("be.visible");
  });

  it("should handle missing/undefined fields gracefully", () => {
    const examWithMissing = {
      ...baseExam,
      title: undefined,
      coefficient: undefined,
      course_assignment: {
        ...baseExam.course_assignment,
        course: undefined,
        groups: undefined,
        main_teacher: undefined,
      },
    };
    cy.intercept("GET", "/exams?*", [examWithMissing]).as("getExamsMissing");
    cy.visit("/exams");
    cy.wait("@getExamsMissing");
    cy.getByTestid("exam-card").should("exist");
    cy.contains("non défini").should("be.visible");
  });
});
