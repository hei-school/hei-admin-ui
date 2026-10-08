import {
  RetakeExam,
  RetakeExamStatus,
  StudentLevel,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {courseMocks} from "../fixtures/api_mocks/course-mocks";
import {
  registeredParticipantMock,
  retakeExamCoursesMock,
  retakeExamParticipantsMock,
  retakeExamSession1Mock,
  retakeExamSessionsMock,
  studentIncompleteCourseResultsMock,
  studentNotRegisteredRetakeExamMock,
  studentRegisteredRetakeExamMock,
  toCancelParticipantMock,
} from "../fixtures/api_mocks/retake-exams-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const STUDENT_ID = student1Mock.id;
const SESSION_ID = retakeExamSession1Mock.id!;
const COURSE_ID = courseMocks[0].id!;
const ERROR_MESSAGE = "Une erreur est survenue. Merci de réessayer.";

const untitledSessionRetakeExamMock: RetakeExam = {
  id: "student_retake_exam_untitled_id",
  course: courseMocks[2],
  session: {id: SESSION_ID},
};

const visitStudentSession = (
  retakeExams: RetakeExam[],
  pendingList: RetakeExam[] = []
) => {
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
  cy.intercept("GET", "/retake_exams?*", pendingList).as("getRetakeExams");
  cy.intercept(
    "GET",
    `/students/${STUDENT_ID}/retake_exams*`,
    studentIncompleteCourseResultsMock
  ).as("getStudentRetakeExams");
  cy.intercept(
    "GET",
    `/students/${STUDENT_ID}/sessions/${SESSION_ID}/retake_exams*`,
    retakeExams
  ).as("getSessionRetakeExams");

  cy.visit(`/retakeExams/${SESSION_ID}/show`);
  cy.wait("@getSessionRetakeExams");
};

const rowOfCourse = (code: string) => cy.contains("table tbody tr", code);

describe("Boutons de rattrapage (étudiant)", () => {
  it("affiche l'état de traitement après une inscription réussie", () => {
    cy.intercept("PUT", "/retake_exam_sessions/*/retake_exams", (req) => {
      expect(req.body[0]).to.include({
        student_id: STUDENT_ID,
        status: RetakeExamStatus.REGISTERED,
      });
      req.reply({
        statusCode: 200,
        body: [
          {
            ...studentNotRegisteredRetakeExamMock,
            status: RetakeExamStatus.REGISTERED,
          },
        ],
      });
    }).as("register");

    visitStudentSession(
      [studentNotRegisteredRetakeExamMock],
      [studentNotRegisteredRetakeExamMock]
    );

    rowOfCourse(studentNotRegisteredRetakeExamMock.course!.code!)
      .contains("button", "S'inscrire")
      .click();
    cy.get('[role="dialog"]')
      .contains("button", "Confirmer l'inscription")
      .click();

    cy.wait("@register").its("response.statusCode").should("eq", 200);
    cy.contains("Inscription réussie.").should("be.visible");
    rowOfCourse(studentNotRegisteredRetakeExamMock.course!.code!)
      .contains("Traitement...")
      .should("be.visible");
  });

  it("notifie une erreur et rétablit le bouton quand l'inscription échoue", () => {
    cy.intercept("PUT", "/retake_exam_sessions/*/retake_exams", {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("registerError");

    visitStudentSession([studentNotRegisteredRetakeExamMock]);

    rowOfCourse(studentNotRegisteredRetakeExamMock.course!.code!)
      .contains("button", "S'inscrire")
      .click();
    cy.get('[role="dialog"]')
      .contains("button", "Confirmer l'inscription")
      .click();

    cy.wait("@registerError").its("response.statusCode").should("eq", 500);
    cy.contains(ERROR_MESSAGE).should("be.visible");
    rowOfCourse(studentNotRegisteredRetakeExamMock.course!.code!)
      .contains("button", "S'inscrire")
      .should("be.visible");
  });

  it("ferme la confirmation d'inscription sans rien envoyer", () => {
    cy.intercept("PUT", "/retake_exam_sessions/*/retake_exams").as(
      "registerSpy"
    );
    visitStudentSession([untitledSessionRetakeExamMock]);

    rowOfCourse(untitledSessionRetakeExamMock.course!.code!)
      .contains("button", "S'inscrire")
      .click();
    cy.contains("Confirmation d'inscription").should("be.visible");
    cy.get('[role="dialog"]')
      .should("contain.text", `"${untitledSessionRetakeExamMock.course!.name}"`)
      .and("contain.text", "(Session)");
    cy.get('[role="dialog"]').contains("button", "Annuler").click();

    cy.contains("Confirmation d'inscription").should("not.exist");
    cy.get("@registerSpy.all").should("have.length", 0);
  });

  it("garde la demande d'annulation désactivée sans raison et permet de la fermer", () => {
    visitStudentSession([studentRegisteredRetakeExamMock]);

    rowOfCourse(studentRegisteredRetakeExamMock.course!.code!)
      .contains("button", "Annuler")
      .click();
    cy.contains("Demande d'annulation").should("be.visible");

    cy.get('[role="dialog"]').find("textarea").first().type("   ");
    cy.contains("button", "Confirmer la demande").should("be.disabled");

    cy.get('[role="dialog"]')
      .contains("button", /^Annuler$/)
      .click();
    cy.contains("Demande d'annulation").should("not.exist");

    rowOfCourse(studentRegisteredRetakeExamMock.course!.code!)
      .contains("button", "Annuler")
      .click();
    cy.get('[role="dialog"]').find("textarea").first().should("have.value", "");
    cy.get("body").type("{esc}");
    cy.contains("Demande d'annulation").should("not.exist");
  });

  it("notifie une erreur quand la demande d'annulation échoue", () => {
    cy.intercept("PATCH", "/retake_exams/to_cancel", {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("requestCancellationError");

    visitStudentSession([studentRegisteredRetakeExamMock]);

    rowOfCourse(studentRegisteredRetakeExamMock.course!.code!)
      .contains("button", "Annuler")
      .click();
    cy.get('[role="dialog"]').find("textarea").first().type("Raison valable");
    cy.contains("button", "Confirmer la demande").click();

    cy.wait("@requestCancellationError")
      .its("response.statusCode")
      .should("eq", 500);
    cy.contains(ERROR_MESSAGE).should("be.visible");
    rowOfCourse(studentRegisteredRetakeExamMock.course!.code!)
      .contains("Inscrit")
      .should("be.visible");
  });
});

const goToParticipantsAs = (role: WhoamiRoleEnum) => {
  cy.mockLogin({role});
  cy.intercept("GET", "/retake_exam_sessions?*", retakeExamSessionsMock).as(
    "getRetakeExamSessions"
  );
  cy.intercept(
    "GET",
    `/retake_exam_sessions/${SESSION_ID}`,
    retakeExamSession1Mock
  ).as("getRetakeExamSession");
  cy.intercept("GET", "/retake_exams?*", retakeExamParticipantsMock).as(
    "getRetakeExams"
  );
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

  cy.visit(`/retakeExams-sessions/${SESSION_ID}/show`);
  cy.wait("@getRetakeExamCourses");
  cy.get("table tbody tr").first().contains("Afficher").click();
  cy.wait("@getRetakeExamParticipants");
};

const rowOfStudent = (ref: string) => cy.contains("table tbody tr", ref);
const REGISTERED_REF = registeredParticipantMock.student_identifier!.ref!;
const TO_CANCEL_REF = toCancelParticipantMock.student_identifier!.ref!;

describe("Boutons de rattrapage (manager)", () => {
  beforeEach(() => {
    goToParticipantsAs(WhoamiRoleEnum.MANAGER);
  });

  it("ferme les confirmations de validation et d'invalidation sans rien envoyer", () => {
    cy.intercept("PATCH", "/retake_exams/status").as("statusSpy");

    rowOfStudent(REGISTERED_REF)
      .contains("button", /^Valider$/)
      .click();
    cy.contains("Validation de rattrapage").should("be.visible");
    cy.get('[role="dialog"]').should(
      "contain.text",
      `(${retakeExamSession1Mock.title})`
    );
    cy.get('[role="dialog"]').contains("button", "Annuler").click();
    cy.contains("Validation de rattrapage").should("not.exist");

    rowOfStudent(REGISTERED_REF).contains("button", "Invalider").click();
    cy.contains("Invalidation de rattrapage").should("be.visible");
    cy.get('[role="dialog"]').contains("button", "Annuler").click();
    cy.contains("Invalidation de rattrapage").should("not.exist");

    cy.get("@statusSpy.all").should("have.length", 0);
  });

  it("ferme les dialogues de traitement d'une demande d'annulation", () => {
    rowOfStudent(TO_CANCEL_REF)
      .contains("button", /^Valider$/)
      .click();
    cy.contains("Validation d'une annulation").should("be.visible");
    cy.get('[role="dialog"]').contains("button", "Annuler").click();
    cy.contains("Validation d'une annulation").should("not.exist");

    rowOfStudent(TO_CANCEL_REF).contains("button", "Rejeter").click();
    cy.contains("Rejet de la demande d'annulation").should("be.visible");
    cy.get('[role="dialog"]').find("textarea").first().type("   ");
    cy.contains("button", "Confirmer le rejet").should("be.disabled");
    cy.get('[role="dialog"]')
      .contains("button", /^Annuler$/)
      .click();
    cy.contains("Rejet de la demande d'annulation").should("not.exist");

    rowOfStudent(TO_CANCEL_REF).contains("button", "Rejeter").click();
    cy.get('[role="dialog"]').find("textarea").first().should("have.value", "");
    cy.get("body").type("{esc}");
    cy.contains("Rejet de la demande d'annulation").should("not.exist");
  });

  it("notifie une erreur quand la validation du rattrapage échoue", () => {
    cy.intercept("PATCH", "/retake_exams/status", {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("validateError");

    rowOfStudent(REGISTERED_REF)
      .contains("button", /^Valider$/)
      .click();
    cy.get('[role="dialog"]').contains("button", "Valider").click();

    cy.wait("@validateError").its("response.statusCode").should("eq", 500);
    cy.contains(ERROR_MESSAGE).should("be.visible");
    rowOfStudent(REGISTERED_REF)
      .contains("button", "Invalider")
      .should("be.visible");
  });

  it("exporte la liste des rattrapages de la matière (par cours)", () => {
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}/retake_exam_courses/${COURSE_ID}/retake_exam_participants/export`,
      "FAKE-EXCEL-CONTENT"
    ).as("exportCourseParticipants");

    cy.window().then((win) => {
      cy.spy(win.URL, "createObjectURL").as("createObjectURL");
    });

    cy.getByTestid("download-button").click();

    cy.wait("@exportCourseParticipants")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Exportation en cours...").should("be.visible");
    cy.get("@createObjectURL").should("have.been.calledOnce");
  });

  it("notifie une erreur quand l'export de la matière échoue", () => {
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}/retake_exam_courses/${COURSE_ID}/retake_exam_participants/export`,
      {statusCode: 500, body: {message: "Internal Server Error"}}
    ).as("exportCourseParticipantsError");

    cy.getByTestid("download-button").click();

    cy.wait("@exportCourseParticipantsError")
      .its("response.statusCode")
      .should("eq", 500);
    cy.contains(
      "Une erreur est survenue lors de l'exportation du fichier."
    ).should("be.visible");
  });
});

describe("Export des rattrapages par session (manager)", () => {
  it("exporte la liste des rattrapages de la session", () => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", "/retake_exam_sessions?*", retakeExamSessionsMock).as(
      "getRetakeExamSessions"
    );
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}`,
      retakeExamSession1Mock
    ).as("getRetakeExamSession");
    cy.intercept("GET", "/retake_exams?*", retakeExamParticipantsMock).as(
      "getRetakeExams"
    );
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}/retake_exam_courses?*`,
      retakeExamCoursesMock
    ).as("getRetakeExamCourses");
    cy.intercept(
      "GET",
      `/retake_exam_sessions/${SESSION_ID}/retake_exam_participants/export`,
      "FAKE-EXCEL-CONTENT"
    ).as("exportSessionParticipants");

    cy.window().then((win) => {
      cy.spy(win.URL, "createObjectURL").as("createObjectURL");
    });

    cy.visit(`/retakeExams-sessions/${SESSION_ID}/show`);
    cy.wait("@getRetakeExamCourses");

    cy.getByTestid("download-button").click();

    cy.wait("@exportSessionParticipants")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Exportation en cours...").should("be.visible");
    cy.get("@createObjectURL").should("have.been.calledOnce");
  });
});

describe("Formulaire de session de rattrapage (manager)", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", "/retake_exam_sessions?*", retakeExamSessionsMock).as(
      "getRetakeExamSessions"
    );
    cy.intercept("GET", "/retake_exams?*", []).as("getRetakeExams");
    cy.visit("/retakeExams-sessions");
    cy.wait("@getRetakeExamSessions");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.contains("Création d'une session de rattrapage").should("be.visible");
  });

  it("exige les champs obligatoires", () => {
    cy.intercept("PUT", "/retake_exam_sessions").as("createSpy");

    cy.get("#date_to").click().type("2026-09-18");
    cy.get('button[type="submit"]').click();

    cy.get("#title-helper-text")
      .should("be.visible")
      .and("contain.text", "Ce champ est requis");
    cy.get("#date_from-helper-text").should(
      "contain.text",
      "Ce champ est requis"
    );
    cy.get("#date_to-helper-text").should("not.contain.text", "⚠");
    cy.get("@createSpy.all").should("have.length", 0);
  });

  it("remplace « Tous les niveaux » par les niveaux choisis ensuite", () => {
    cy.intercept("PUT", "/retake_exam_sessions", (req) => {
      expect(req.body.title).to.eq("Session ciblée");
      expect(req.body.student_levels).to.deep.eq([
        StudentLevel.L2,
        StudentLevel.L3,
      ]);
      expect(req.body.date_from).to.be.a("string");
      expect(req.body.date_to).to.be.a("string");
      req.reply({
        statusCode: 200,
        body: {
          ...retakeExamSession1Mock,
          id: "retake_exam_session_targeted_id",
          title: "Session ciblée",
          student_levels: [StudentLevel.L2, StudentLevel.L3],
        },
      });
    }).as("createTargetedSession");

    cy.get("#title").type("Session ciblée");
    cy.get("#date_from").click().type("2026-09-07");
    cy.get("#date_to").click().type("2026-09-18");

    cy.get("#student_levels").click();
    cy.get('[role="option"]').contains("Tous les niveaux").click();
    cy.get('[role="option"]').contains(/^L2$/).click();
    cy.get('[role="option"]').contains(/^L3$/).click();
    cy.get('[role="option"][aria-selected="true"]').then((options) => {
      const labels = options.toArray().map((option) => option.innerText);
      expect(labels).to.deep.eq(["L2", "L3"]);
    });
    cy.get("body").type("{esc}");

    cy.get('button[type="submit"]').click();
    cy.wait("@createTargetedSession")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Création d'une session de rattrapage").should("not.exist");
  });
});
