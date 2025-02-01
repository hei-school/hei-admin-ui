import {examMocks} from "../fixtures/api_mocks/exam-mocks";
import {gradeMocks} from "../fixtures/api_mocks/grade-mocks";
import {studentGradeMocks} from "../fixtures/api_mocks/student-grade-mocks";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";

const SELECTORS = {
  APPLY_BUTTON: 'button[type="submit"]',
  NO_EXAM_MESSAGE: '[data-testid="no-exam-selected-message"]',
  NO_GRADE_MESSAGE: `[data-testid="no-grade-message"]`,
  EXAM_SELECT: 'input[name="exams"]',
  GRADE_TABLE: '[data-testid="grade_table"]',
  EXAM_SELECT_BUTTON: '[data-testid="exam-select-button"]',
  EXAM_OPTION: 'li[role="option"]',
};

describe("Manager.ExamGradeList", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", "**/exams?page=1&page_size=25", examMocks).as(
      "getExams"
    );
    cy.intercept("GET", "**/students/letters/stats*", []);
    cy.intercept("GET", `**/exams/${examMocks[0].id}/grades*`, gradeMocks).as(
      "getGrades"
    );
    cy.intercept("GET", `**/exams/${examMocks[1].id}/grades*`, []).as(
      "getNoGrades"
    );
    cy.visit("/grades");
    cy.wait("@getExams");
  });

  it("should display the exam selection form", () => {
    cy.get("form").should("exist");
    cy.get("label").contains("Examen").should("exist");
    cy.get(SELECTORS.APPLY_BUTTON).contains("Appliquer").should("exist");
  });

  it("should display a message when no exam is selected", () => {
    cy.get(SELECTORS.NO_EXAM_MESSAGE)
      .should("exist")
      .contains(
        'Veuillez choisir un examen dans la liste déroulante ci-dessus et cliquer sur "Appliquer" pour afficher les notes des participants.'
      );
  });

  it.skip("should display grades for the selected exam", () => {
    selectExamByTitle(examMocks[0].title);
    cy.get(SELECTORS.APPLY_BUTTON).click();
    cy.wait("@getGrades");

    verifyGradeTable(gradeMocks);
  });

  it("should display an error message if no grades are found for the selected exam", () => {
    selectExamByTitle(examMocks[1].title);
    cy.get(SELECTORS.APPLY_BUTTON).click();
    cy.wait("@getNoGrades");

    cy.get(SELECTORS.NO_GRADE_MESSAGE)
      .should("exist")
      .contains(
        "Veuillez vérifier que l'examen sélectionné a des notes enregistrées."
      );
  });

  it("should disable the apply button when no exam is selected", () => {
    cy.get(SELECTORS.APPLY_BUTTON).should("be.disabled");
    selectExamByTitle(examMocks[0].title);
    cy.get(SELECTORS.APPLY_BUTTON).should("not.be.disabled");
  });
});

describe("StudentGradeList", () => {
  const studentId = "1";

  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `**/students/${studentId}`, {
      statusCode: 200,
      body: studentsMock[0],
    }).as("getStudent");
    cy.intercept("GET", `**/students/${studentId}/grades?page=1&page_size=10`, {
      statusCode: 200,
      body: studentGradeMocks,
    }).as("getStudentGrades");

    cy.visit(`/students/${studentId}/grades`);
    cy.wait("@getStudentGrades");
  });

  it("should display the student grades list", () => {
    cy.getByTestid("student-grade-list").should("exist");
    verifyStudentGrades(studentGradeMocks);
  });
});

function selectExamByTitle(title: string): void {
  cy.get(SELECTORS.EXAM_SELECT_BUTTON).click();
  cy.get(SELECTORS.EXAM_OPTION).contains(title).click();
}

function verifyGradeTable(
  grades: {
    student: {ref: string; first_name: string; last_name: string};
    grade: {score: string};
  }[]
): void {
  cy.get(SELECTORS.GRADE_TABLE)
    .should("exist")
    .within(() => {
      grades.forEach(({student, grade}) => {
        cy.contains(student.ref).should("exist");
        cy.contains(student.first_name).should("exist");
        cy.contains(student.last_name).should("exist");
        cy.contains(grade.score).should("exist");
      });
    });
}

function verifyStudentGrades(grades: any[]): void {
  cy.getByTestid("student-grade-list").within(() => {
    grades.forEach(({main_teacher, course, group, exams}) => {
      cy.contains(main_teacher.id).should("exist");
      cy.contains(main_teacher.first_name).should("exist");
      cy.contains(main_teacher.last_name).should("exist");
      cy.contains(course.id).should("exist");
      cy.contains(course.code).should("exist");
      cy.contains(group.id).should("exist");
      exams.forEach(({grade, student}: any) => {
        cy.contains(grade.score).should("exist");
        cy.contains(student.specialization_field).should("exist");
      });
    });
  });
}
