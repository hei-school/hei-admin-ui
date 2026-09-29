import {
  RetakeExamStatus,
  StudentLevel,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {
  retakeExamSession1Mock,
  retakeExamSessionsMock,
  studentIncompleteCourseResultsMock,
  studentNotRegisteredRetakeExamMock,
  studentRegisteredRetakeExamMock,
  studentRejectedRetakeExamMock,
  studentRetakeExamsBySessionMock,
} from "../fixtures/api_mocks/retake-exams-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const STUDENT_ID = student1Mock.id;
const SESSION_ID = retakeExamSession1Mock.id!;

const interceptStudentRetakeExams = (courseResults: unknown[]) => {
  cy.intercept(
    "GET",
    `/students/${STUDENT_ID}/retake_exams*`,
    courseResults
  ).as("getStudentRetakeExams");
};

const interceptSessionRetakeExams = (retakeExams: unknown[]) => {
  cy.intercept(
    "GET",
    `/students/${STUDENT_ID}/sessions/${SESSION_ID}/retake_exams*`,
    retakeExams
  ).as("getSessionRetakeExams");
};

describe("Retake exams as STUDENT", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.STUDENT});
    cy.intercept("GET", `/students/${STUDENT_ID}/level`, StudentLevel.L1).as(
      "getStudentLevel"
    );
    cy.intercept("GET", "/retake_exam_sessions?*", retakeExamSessionsMock).as(
      "getRetakeExamSessions"
    );
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}`,
      retakeExamSession1Mock
    ).as("getRetakeExamSession");
    cy.intercept("GET", "/retake_exams?*", []).as("getRetakeExams");
    interceptStudentRetakeExams(studentIncompleteCourseResultsMock);
    interceptSessionRetakeExams(studentRetakeExamsBySessionMock);
  });

  it("should not allow creating or editing a session", () => {
    cy.visit("/retake-exams");
    cy.wait("@getRetakeExamSessions");

    cy.contains("Liste des sessions de rattrapage").should("be.visible");
    cy.getByTestid("menu-list-action").should("not.exist");
    cy.get('[data-testid="EditIcon"]').should("not.exist");
    cy.get("table tbody tr").first().contains("Afficher").should("be.visible");
  });

  it("should open the list of retake exams to do from the banner", () => {
    cy.visit("/retake-exams");
    cy.wait("@getStudentRetakeExams");

    cy.contains("Liste de mes rattrapages à faire")
      .should("be.visible")
      .click();

    cy.routePathnameEq("/student/retake-exams");
    cy.contains("Rattrapages à faire").should("be.visible");
    cy.contains("1 validé sur 3 cours").should("be.visible");
    studentIncompleteCourseResultsMock.forEach(({course}) => {
      cy.contains(course!.name!).should("be.visible");
    });
  });

  it("should display an empty state when there is no retake exam to do", () => {
    interceptStudentRetakeExams([]);

    cy.visit("/student/retake-exams");
    cy.wait("@getStudentRetakeExams");

    cy.contains("Aucun rattrapage trouvé").should("be.visible");
    cy.contains("Tous vos cours sont validés.").should("be.visible");
  });

  it("should display the retake exams of a session with their status", () => {
    cy.visit(`/retakeExams/${SESSION_ID}/show`);
    cy.wait("@getSessionRetakeExams");

    cy.contains(`Rattrapages – ${retakeExamSession1Mock.title}`).should(
      "be.visible"
    );
    cy.get("table tbody tr").should(
      "have.length",
      studentRetakeExamsBySessionMock.length
    );

    cy.contains("tr", studentNotRegisteredRetakeExamMock.course!.code!)
      .contains("button", "S'inscrire")
      .should("be.visible");
    cy.contains("tr", studentRegisteredRetakeExamMock.course!.code!).within(
      () => {
        cy.contains("Inscrit").should("be.visible");
        cy.contains("button", "Annuler").should("be.visible");
      }
    );
    cy.contains("tr", studentRejectedRetakeExamMock.course!.code!).within(
      () => {
        cy.contains(studentRejectedRetakeExamMock.rejection_reason!).should(
          "be.visible"
        );
        cy.contains("button", "Annuler").should("not.exist");
      }
    );
  });

  it("should register to a retake exam", () => {
    cy.intercept("PUT", "/retake_exam_sessions/*/retake_exams", (req) => {
      expect(req.url, "url d'inscription").to.contain(SESSION_ID);
      expect(req.body).to.have.length(1);
      expect(req.body[0]).to.include({
        course_id: studentNotRegisteredRetakeExamMock.course!.id,
        session_id: SESSION_ID,
        student_id: STUDENT_ID,
        status: RetakeExamStatus.REGISTERED,
      });
      req.reply({
        statusCode: 200,
        body: [
          {
            ...studentNotRegisteredRetakeExamMock,
            registration_date: new Date("2026-01-09T09:00:00.000Z"),
            status: RetakeExamStatus.REGISTERED,
          },
        ],
      });
    }).as("registerToRetakeExam");

    cy.visit(`/retakeExams/${SESSION_ID}/show`);
    cy.wait("@getSessionRetakeExams");

    cy.contains("tr", studentNotRegisteredRetakeExamMock.course!.code!)
      .contains("button", "S'inscrire")
      .click();

    cy.contains("Confirmation d'inscription").should("be.visible");
    cy.get('[role="dialog"]')
      .contains("button", "Confirmer l'inscription")
      .click();

    cy.wait("@registerToRetakeExam");
    cy.contains("Inscription réussie.").should("be.visible");
  });

  it("should request the cancellation of a retake exam with a reason", () => {
    const cancelReason = "Je suis en stage pendant toute la session";
    cy.intercept("PATCH", "/retake_exams/to_cancel", (req) => {
      expect(req.body).to.deep.eq([
        {
          retake_exam_id: studentRegisteredRetakeExamMock.id,
          reason: cancelReason,
        },
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {
            ...studentRegisteredRetakeExamMock,
            cancel_reason: cancelReason,
            status: RetakeExamStatus.TO_CANCEL,
          },
        ],
      });
    }).as("requestCancellation");

    cy.visit(`/retakeExams/${SESSION_ID}/show`);
    cy.wait("@getSessionRetakeExams");

    cy.contains("tr", studentRegisteredRetakeExamMock.course!.code!)
      .contains("button", "Annuler")
      .click();

    cy.contains("Demande d'annulation").should("be.visible");
    cy.contains("button", "Confirmer la demande").should("be.disabled");

    cy.get('[role="dialog"]').find("textarea").first().type(cancelReason);
    cy.contains("button", "Confirmer la demande").click();

    cy.wait("@requestCancellation");
    cy.contains("Demande d'annulation envoyée.").should("be.visible");
  });
});
