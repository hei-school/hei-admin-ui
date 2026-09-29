import {
  RetakeExamStatus,
  StudentLevel,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {courseMocks} from "../fixtures/api_mocks/course-mocks";
import {
  createdRetakeExamSessionMock,
  registeredParticipantMock,
  retakeExamCoursesMock,
  retakeExamParticipantsMock,
  retakeExamSession1Mock,
  retakeExamSessionsMock,
  retakeExamsToCancelMock,
  toCancelParticipantMock,
  validatedParticipantMock,
} from "../fixtures/api_mocks/retake-exams-mocks";

const SESSION_ID = retakeExamSession1Mock.id!;
const COURSE_ID = courseMocks[0].id!;

const toLocaleDate = (date?: Date) =>
  date ? new Date(date).toLocaleDateString() : "";

const interceptSessions = () => {
  cy.intercept("GET", "/retake_exam_sessions?*", retakeExamSessionsMock).as(
    "getRetakeExamSessions"
  );
  cy.intercept(
    "GET",
    `/retake_exam_sessions/${SESSION_ID}`,
    retakeExamSession1Mock
  ).as("getRetakeExamSession");
};

const interceptPendingCancellations = (retakeExams: unknown[]) => {
  cy.intercept("GET", "/retake_exams?*", retakeExams).as("getRetakeExams");
};

const interceptCoursesAndParticipants = () => {
  cy.intercept(
    "GET",
    `/retake_exam_sessions/${SESSION_ID}/retake_exam_courses?*`,
    retakeExamCoursesMock
  ).as("getRetakeExamCourses");
  cy.intercept(
    "GET",
    `/retake_exam_sessions/${SESSION_ID}/retake_exam_courses/${COURSE_ID}/participants*`,
    retakeExamParticipantsMock
  ).as("getRetakeExamParticipants");
  cy.intercept("GET", `/courses/${COURSE_ID}`, courseMocks[0]).as("getCourse");
};

const goToParticipants = () => {
  cy.visit(`/retakeExams-sessions/${SESSION_ID}/show`);
  cy.wait("@getRetakeExamCourses");
  cy.get("table tbody tr").first().contains("Afficher").click();
  cy.wait("@getRetakeExamParticipants");
};

describe("Retake exam sessions as MANAGER", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    interceptSessions();
    interceptPendingCancellations([]);
  });

  it("should display the retake exam session list", () => {
    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExamSessions");

    cy.contains("Liste des sessions de rattrapage").should("be.visible");
    cy.get("table tbody tr").should(
      "have.length",
      retakeExamSessionsMock.length
    );

    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains(retakeExamSession1Mock.title!).should("be.visible");
        cy.contains(toLocaleDate(retakeExamSession1Mock.date_from)).should(
          "be.visible"
        );
        cy.contains(toLocaleDate(retakeExamSession1Mock.date_to)).should(
          "be.visible"
        );
        cy.contains(retakeExamSession1Mock.student_levels!.join(", ")).should(
          "be.visible"
        );
      });
  });

  it("should search a session by its name", () => {
    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExamSessions");

    cy.intercept("GET", "/retake_exam_sessions?title=Juin*", [
      retakeExamSessionsMock[1],
    ]).as("getFilteredSessions");

    cy.getByTestid("main-search-filter").type("Juin");
    cy.wait("@getFilteredSessions");

    cy.get("table tbody tr").should("have.length", 1);
    cy.contains(retakeExamSessionsMock[1].title!).should("be.visible");
  });

  it("should create a retake exam session for all student levels", () => {
    cy.intercept("PUT", "/retake_exam_sessions", (req) => {
      expect(req.body.title).to.eq(createdRetakeExamSessionMock.title);
      expect(req.body.student_levels).to.deep.eq(Object.values(StudentLevel));
      req.reply({statusCode: 200, body: createdRetakeExamSessionMock});
    }).as("createRetakeExamSession");

    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExamSessions");

    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.contains("Création d'une session de rattrapage").should("be.visible");

    cy.get("#title").type(createdRetakeExamSessionMock.title!);
    cy.get("#date_from").click().type("2026-09-07");
    cy.get("#date_to").click().type("2026-09-18");
    cy.get("#student_levels").click();
    cy.get('[role="option"]').contains("Tous les niveaux").click();
    cy.get("body").type("{esc}");

    cy.get('button[type="submit"]').click();
    cy.wait("@createRetakeExamSession");
    cy.contains("Création d'une session de rattrapage").should("not.exist");
  });

  it("should reject an end date earlier than the start date", () => {
    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExamSessions");

    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();

    cy.get("#title").type("Session invalide");
    cy.get("#date_from").click().type("2026-09-18");
    cy.get("#date_to").click().type("2026-09-07");
    cy.get('button[type="submit"]').click();

    cy.contains(
      "⚠ La date de fin doit être postérieure à la date de début"
    ).should("be.visible");
  });

  it("should update an existing retake exam session", () => {
    const updatedTitle = "Session de rattrapage Janvier (reportée)";
    cy.intercept("PUT", "/retake_exam_sessions", (req) => {
      expect(req.body.id).to.eq(SESSION_ID);
      expect(req.body.title).to.eq(updatedTitle);
      req.reply({
        statusCode: 200,
        body: {...retakeExamSession1Mock, title: updatedTitle},
      });
    }).as("updateRetakeExamSession");

    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExamSessions");

    cy.get("table tbody tr").first().find('[data-testid="EditIcon"]').click();
    cy.contains("Modifier la session de rattrapage").should("be.visible");

    cy.get("#title").clear().type(updatedTitle);
    cy.get('button[type="submit"]').click();

    cy.wait("@updateRetakeExamSession");
    cy.contains("Modifier la session de rattrapage").should("not.exist");
  });

  it("should display the session courses then the participants of a course", () => {
    interceptCoursesAndParticipants();

    cy.visit(`/retakeExams-sessions/${SESSION_ID}/show`);
    cy.wait("@getRetakeExamSession");
    cy.wait("@getRetakeExamCourses");

    cy.contains(retakeExamSession1Mock.title!).should("be.visible");
    cy.contains("Liste des matières à rattraper").should("be.visible");
    cy.get("table tbody tr").should(
      "have.length",
      retakeExamCoursesMock.length
    );
    cy.contains(courseMocks[0].code).should("be.visible");

    cy.get("table tbody tr").first().contains("Afficher").click();
    cy.wait("@getRetakeExamParticipants");

    cy.contains("Liste des étudiants").should("be.visible");
    cy.get("table tbody tr").should(
      "have.length",
      retakeExamParticipantsMock.length
    );
    cy.contains(
      "tr",
      registeredParticipantMock.student_identifier!.ref!
    ).within(() => {
      cy.contains("button", "Valider").should("be.visible");
      cy.contains("button", "Invalider").should("be.visible");
    });
    cy.contains("tr", toCancelParticipantMock.student_identifier!.ref!).within(
      () => {
        cy.contains("button", "Valider").should("be.visible");
        cy.contains("button", "Rejeter").should("be.visible");
      }
    );
    cy.contains("tr", validatedParticipantMock.student_identifier!.ref!).within(
      () => {
        cy.contains("Validé").should("be.visible");
        cy.get("button").should("not.exist");
      }
    );
  });

  it("should validate the retake exam of a registered student", () => {
    interceptCoursesAndParticipants();
    cy.intercept("PATCH", "/retake_exams/status", (req) => {
      expect(req.body).to.deep.eq([
        {
          retake_exam_id: registeredParticipantMock.id,
          status: RetakeExamStatus.VALIDATE,
        },
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {...registeredParticipantMock, status: RetakeExamStatus.VALIDATE},
        ],
      });
    }).as("updateRetakeExamStatus");

    goToParticipants();

    cy.get("table tbody tr").first().contains("button", "Valider").click();
    cy.contains("Validation de rattrapage").should("be.visible");
    cy.get('[role="dialog"]').contains("button", "Valider").click();

    cy.wait("@updateRetakeExamStatus");
    cy.contains("Rattrapage validé.").should("be.visible");
  });

  it("should invalidate the retake exam of a registered student", () => {
    interceptCoursesAndParticipants();
    cy.intercept("PATCH", "/retake_exams/status", (req) => {
      expect(req.body).to.deep.eq([
        {
          retake_exam_id: registeredParticipantMock.id,
          status: RetakeExamStatus.INVALIDATE,
        },
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {...registeredParticipantMock, status: RetakeExamStatus.INVALIDATE},
        ],
      });
    }).as("updateRetakeExamStatus");

    goToParticipants();

    cy.get("table tbody tr").first().contains("button", "Invalider").click();
    cy.contains("Invalidation de rattrapage").should("be.visible");
    cy.get('[role="dialog"]').contains("button", "Invalider").click();

    cy.wait("@updateRetakeExamStatus");
    cy.contains("Rattrapage invalidé.").should("be.visible");
  });

  it("should display the details of the course being retaken", () => {
    interceptCoursesAndParticipants();

    goToParticipants();
    cy.wait("@getCourse");

    cy.contains("Matière").should("be.visible");
    cy.contains("Niveau").should("be.visible");
    cy.contains(courseMocks[0].code).should("be.visible");
    cy.contains(courseMocks[0].name).should("be.visible");
    cy.contains(courseMocks[0].level).should("be.visible");
  });

  it("should search a participant by student reference", () => {
    interceptCoursesAndParticipants();
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}/retake_exam_courses/${COURSE_ID}/participants?student_ref=${validatedParticipantMock.student_identifier!.ref}*`,
      [validatedParticipantMock]
    ).as("getFilteredParticipants");

    goToParticipants();

    cy.getByTestid("main-search-filter").type(
      validatedParticipantMock.student_identifier!.ref!
    );
    cy.wait("@getFilteredParticipants");

    cy.get("table tbody tr").should("have.length", 1);
    cy.contains(validatedParticipantMock.student_identifier!.ref!).should(
      "be.visible"
    );
  });

  it("should accept a cancellation request from the participant list", () => {
    interceptCoursesAndParticipants();
    cy.intercept("PATCH", "/retake_exams/cancel", (req) => {
      expect(req.body).to.deep.eq([
        {retake_exam_id: toCancelParticipantMock.id},
      ]);
      req.reply({
        statusCode: 200,
        body: [{...toCancelParticipantMock, status: RetakeExamStatus.CANCELED}],
      });
    }).as("cancelRetakeExam");

    goToParticipants();

    cy.contains("tr", toCancelParticipantMock.student_identifier!.ref!)
      .contains("button", "Valider")
      .click();
    cy.contains("Validation d'une annulation").should("be.visible");
    cy.get('[role="dialog"]').contains("button", "Valider").click();

    cy.wait("@cancelRetakeExam");
    cy.contains("Annulation validée.").should("be.visible");
  });

  it("should reject a cancellation request from the participant list", () => {
    const rejectionReason = "La session est déjà complète";
    interceptCoursesAndParticipants();
    cy.intercept("PATCH", "/retake_exams/reject", (req) => {
      expect(req.body).to.deep.eq([
        {retake_exam_id: toCancelParticipantMock.id, reason: rejectionReason},
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {
            ...toCancelParticipantMock,
            status: RetakeExamStatus.REGISTERED,
            rejection_reason: rejectionReason,
          },
        ],
      });
    }).as("rejectCancellation");

    goToParticipants();

    cy.contains("tr", toCancelParticipantMock.student_identifier!.ref!)
      .contains("button", "Rejeter")
      .click();
    cy.contains("Rejet de la demande d'annulation").should("be.visible");
    cy.contains("button", "Confirmer le rejet").should("be.disabled");

    cy.get('[role="dialog"]').find("textarea").first().type(rejectionReason);
    cy.contains("button", "Confirmer le rejet").click();

    cy.wait("@rejectCancellation");
    cy.contains("Demande d'annulation rejetée.").should("be.visible");
  });
});

describe("Retake exam cancellation requests as ADMIN", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    interceptSessions();
    interceptPendingCancellations(retakeExamsToCancelMock);
  });

  it("should display the pending cancellation banner and open the list", () => {
    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExams");

    cy.contains("Demandes d'annulation de rattrapage en attente")
      .should("be.visible")
      .click();

    cy.routePathnameEq("/retake-exams/cancellation");
    cy.contains("Demandes d'annulation de rattrapage").should("be.visible");
    cy.get("table tbody tr").should(
      "have.length",
      retakeExamsToCancelMock.length
    );
    cy.contains(toCancelParticipantMock.cancel_reason!).should("be.visible");
  });

  it("should accept a cancellation request", () => {
    cy.intercept("PATCH", "/retake_exams/cancel", (req) => {
      expect(req.body).to.deep.eq([
        {retake_exam_id: toCancelParticipantMock.id},
      ]);
      req.reply({
        statusCode: 200,
        body: [{...toCancelParticipantMock, status: RetakeExamStatus.CANCELED}],
      });
    }).as("cancelRetakeExam");

    cy.visit("/retake-exams/cancellation");
    cy.wait("@getRetakeExams");

    cy.get("table tbody tr").first().contains("button", "Valider").click();
    cy.contains("Validation d'une annulation").should("be.visible");
    cy.get('[role="dialog"]').contains("button", "Valider").click();

    cy.wait("@cancelRetakeExam");
    cy.contains("Annulation validée.").should("be.visible");
  });

  it("should reject a cancellation request with a reason", () => {
    const rejectionReason = "Le justificatif fourni n'est pas recevable";
    cy.intercept("PATCH", "/retake_exams/reject", (req) => {
      expect(req.body).to.deep.eq([
        {retake_exam_id: toCancelParticipantMock.id, reason: rejectionReason},
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {
            ...toCancelParticipantMock,
            status: RetakeExamStatus.REGISTERED,
            rejection_reason: rejectionReason,
          },
        ],
      });
    }).as("rejectCancellation");

    cy.visit("/retake-exams/cancellation");
    cy.wait("@getRetakeExams");

    cy.get("table tbody tr").first().contains("button", "Rejeter").click();
    cy.contains("Rejet de la demande d'annulation").should("be.visible");
    cy.contains("button", "Confirmer le rejet").should("be.disabled");

    cy.get('[role="dialog"]').find("textarea").first().type(rejectionReason);
    cy.contains("button", "Confirmer le rejet").click();

    cy.wait("@rejectCancellation");
    cy.contains("Demande d'annulation rejetée.").should("be.visible");
  });

  it("should redirect to the session list when no request is left", () => {
    interceptPendingCancellations([]);

    cy.visit("/retake-exams/cancellation");
    cy.wait("@getRetakeExams");

    cy.routePathnameEq("/retakeExams-sessions");
    cy.contains("Liste des sessions de rattrapage").should("be.visible");
  });
});
