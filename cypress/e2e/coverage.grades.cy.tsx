import {StudentGrade, WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  COVERAGE_EXAM_ID,
  GRADED_GRADE_ID,
  examGradesCoverageMock,
  gradeHistoryMock,
  gradedStudentGradeMock,
  gradedWithoutIdStudentGradeMock,
  importGradeResultSuccessMock,
  importGradeResultWithErrorsMock,
  ungradedStudentGradeMock,
} from "../fixtures/api_mocks/coverage-grades-mocks";
import {examMocks} from "../fixtures/api_mocks/exam-mocks";

const GRADED_STUDENT_ID = gradedStudentGradeMock.student!.id!;
const GRADED_STUDENT_REF = gradedStudentGradeMock.student!.ref!;
const UNGRADED_STUDENT_ID = ungradedStudentGradeMock.student!.id!;
const UNGRADED_STUDENT_REF = ungradedStudentGradeMock.student!.ref!;
const NO_ID_STUDENT_REF = gradedWithoutIdStudentGradeMock.student!.ref!;

const GRADES_URL = `/exams/${COVERAGE_EXAM_ID}/grades?*`;

const visitExamGrades = (
  role: WhoamiRoleEnum,
  grades: StudentGrade[] = examGradesCoverageMock
) => {
  cy.mockLogin({role});
  cy.intercept("GET", `/exams/${COVERAGE_EXAM_ID}`, examMocks[0]).as("getExam");
  cy.intercept("GET", GRADES_URL, grades).as("getExamGrades");
  cy.intercept("GET", "/exams?*", [examMocks[0]]).as("getExams");
  // client side navigation: avoids a second full page load
  cy.get('a[href="/exams"]').first().click();
  cy.wait("@getExams");
  cy.getByTestid("exam-card").first().click();
  cy.routePathnameEq(`/exams/${COVERAGE_EXAM_ID}/grades`);
  cy.wait("@getExamGrades");
  cy.contains("Liste des participants").should("be.visible");
  cy.get(".participants-list tbody tr").should("have.length", grades.length);
};

const rowOf = (studentRef: string) =>
  cy.contains(".participants-list tbody tr", studentRef);

const openHistoryOf = (studentRef: string) => {
  rowOf(studentRef)
    .find('svg[class*="lucide-eye"]')
    .closest("button")
    .should("be.enabled")
    .click();
  cy.contains("Historique des modifications").should("be.visible");
};

// Some notifications are immediately replaced by the next one: every text
// added to the page is recorded so that a short-lived message can be asserted.
const recordDisplayedTexts = (): string[] => {
  const texts: string[] = [];
  cy.window().then((win) => {
    const observer = new win.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          texts.push(mutation.target.textContent ?? "");
          return;
        }
        mutation.addedNodes.forEach((node) => {
          texts.push(node.textContent ?? "");
        });
      });
    });
    observer.observe(win.document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
  return texts;
};

const expectDisplayed = (texts: string[], message: string) => {
  cy.wrap(texts).should((displayed) => {
    expect(displayed.join(" | ")).to.contain(message);
  });
};

const dropGradeFile = () => {
  cy.get('[role="dialog"] .RaFileInput-dropZone').selectFile(
    "cypress/fixtures/fees_import/valid_fees_template.xlsx",
    {action: "drag-drop"}
  );
};

const openActionsMenu = () => {
  cy.getByTestid("menu-list-action").click();
  return cy.get(".MuiPopover-paper").should("be.visible");
};

const openImportDialog = () => {
  openActionsMenu().contains("button", "Importer").click();
  cy.contains("Importer les notes").should("be.visible");
};

describe("Notes d'un examen (manager)", () => {
  beforeEach(() => {
    visitExamGrades(WhoamiRoleEnum.MANAGER);
  });

  it("affiche les actions adaptées selon que l'étudiant a une note ou non", () => {
    rowOf(GRADED_STUDENT_REF).within(() => {
      cy.contains("button", "ÉDITER").should("be.enabled");
      cy.get('svg[class*="lucide-eye"]').should("have.length", 1);
    });
    rowOf(UNGRADED_STUDENT_REF).within(() => {
      cy.contains("Non définie").should("be.visible");
      cy.contains("button", "ATTRIBUER").should("be.enabled");
      cy.get('svg[class*="lucide-eye"]').should("not.exist");
    });
  });

  it("valide le formulaire d'attribution puis crée la note", () => {
    cy.intercept(
      "POST",
      `/exams/${COVERAGE_EXAM_ID}/students/${UNGRADED_STUDENT_ID}/grade`,
      (req) => {
        expect(req.body).to.deep.eq({score: 12});
        req.reply({
          statusCode: 200,
          body: {id: "new_grade_id", score: 12},
        });
      }
    ).as("createGrade");

    rowOf(UNGRADED_STUDENT_REF).contains("button", "ATTRIBUER").click();
    cy.contains("Attribuer une note").should("be.visible");
    cy.contains("Note sur 20").should("be.visible");

    cy.get('[role="dialog"] input[name="grade.score"]').type("25");
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();
    cy.get('[role="dialog"]').contains("Maximum 20").should("be.visible");

    cy.get('[role="dialog"] input[name="grade.score"]').clear().type("12");
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();
    cy.contains(
      "Un commentaire est obligatoire lorsque une note est attribuée"
    ).should("be.visible");
    cy.get("@createGrade.all").should("have.length", 0);

    cy.get('[role="dialog"] textarea[name="comment"]').type("Première note");
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();
    cy.wait("@createGrade").its("response.statusCode").should("eq", 200);
    cy.contains("Note enregistrée avec succès").should("be.visible");
  });

  it("notifie une erreur quand la création de la note échoue", () => {
    cy.intercept(
      "POST",
      `/exams/${COVERAGE_EXAM_ID}/students/${UNGRADED_STUDENT_ID}/grade`,
      {statusCode: 500, body: {message: "Internal Server Error"}}
    ).as("createGradeError");

    rowOf(UNGRADED_STUDENT_REF).contains("button", "ATTRIBUER").click();
    cy.get('[role="dialog"] input[name="grade.score"]').type("11");
    cy.get('[role="dialog"] textarea[name="comment"]').type("Note test");
    const displayedTexts = recordDisplayedTexts();
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();

    cy.wait("@createGradeError").its("response.statusCode").should("eq", 500);
    expectDisplayed(displayedTexts, "Erreur lors de la mise à jour de la note");
    cy.contains("Attribuer une note").should("not.exist");
  });

  it("corrige une note existante avec un commentaire", () => {
    cy.intercept(
      "POST",
      `/exams/${COVERAGE_EXAM_ID}/students/${GRADED_STUDENT_ID}/grade/update`,
      (req) => {
        expect(req.body).to.deep.eq({
          grade: {score: 16, student_id: GRADED_STUDENT_ID},
          student_ref: GRADED_STUDENT_REF,
          comment: "Erreur de saisie",
        });
        req.reply({statusCode: 200, body: gradedStudentGradeMock.grade});
      }
    ).as("correctGrade");

    rowOf(GRADED_STUDENT_REF).contains("button", "ÉDITER").click();
    cy.contains("Modifier la note").should("be.visible");
    cy.contains("Requis lorsque une note est attribuée").should("be.visible");

    cy.get('[role="dialog"] input[name="grade.score"]')
      .should("have.value", "14")
      .clear()
      .type("16");
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();
    cy.get('[role="dialog"]')
      .contains("Ce champ est requis")
      .should("be.visible");
    cy.get("@correctGrade.all").should("have.length", 0);

    cy.get('[role="dialog"] textarea[name="comment"]').type("Erreur de saisie");
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();

    cy.wait("@correctGrade").its("response.statusCode").should("eq", 200);
    cy.contains("Note enregistrée avec succès").should("be.visible");
  });

  it("notifie une erreur quand la correction de la note échoue", () => {
    cy.intercept(
      "POST",
      `/exams/${COVERAGE_EXAM_ID}/students/${GRADED_STUDENT_ID}/grade/update`,
      {statusCode: 500, body: {message: "Internal Server Error"}}
    ).as("correctGradeError");

    rowOf(GRADED_STUDENT_REF).contains("button", "ÉDITER").click();
    cy.get('[role="dialog"] input[name="grade.score"]').clear().type("3");
    cy.get('[role="dialog"] textarea[name="comment"]').type("Fraude");
    const displayedTexts = recordDisplayedTexts();
    cy.get('[role="dialog"]').contains("button", "Enregistrer").click();

    cy.wait("@correctGradeError").its("response.statusCode").should("eq", 500);
    expectDisplayed(displayedTexts, "Erreur lors de la mise à jour de la note");
    cy.contains("Modifier la note").should("not.exist");
  });

  it("affiche l'historique trié d'une note, du plus récent au plus ancien", () => {
    cy.intercept(
      "GET",
      `/grades/${GRADED_GRADE_ID}/history*`,
      gradeHistoryMock
    ).as("getHistory");

    openHistoryOf(GRADED_STUDENT_REF);
    cy.wait("@getHistory");

    cy.get('[role="dialog"]').within(() => {
      cy.contains("ACTUEL").should("have.length", 1);
      cy.contains("Note actuelle").should("be.visible");
      cy.contains("Note: 14/20").should("be.visible");
      cy.contains("Note: 8/20").should("be.visible");
      cy.contains("Note: 5/20").should("be.visible");
      cy.get(".MuiChip-label").then((chips) => {
        const labels = chips.toArray().map((chip) => chip.innerText);
        expect(labels).to.deep.eq(["ACTUEL", "HISTORIQUE", "HISTORIQUE"]);
      });
      cy.contains("Commentaire").should("have.length", 1);
      cy.contains("Correction après réclamation").should("be.visible");
      cy.contains("Ancienne note").should("be.visible");
    });
  });

  it("affiche un état vide quand la note n'a pas d'historique", () => {
    cy.intercept("GET", `/grades/${GRADED_GRADE_ID}/history*`, []).as(
      "getEmptyHistory"
    );

    openHistoryOf(GRADED_STUDENT_REF);
    cy.wait("@getEmptyHistory");

    cy.contains("Aucun historique disponible").should("be.visible");
    cy.contains("Cette note n'a pas encore été modifiée.").should("be.visible");
  });

  it("affiche une erreur quand le chargement de l'historique échoue", () => {
    cy.intercept("GET", `/grades/${GRADED_GRADE_ID}/history*`, {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("getHistoryError");

    openHistoryOf(GRADED_STUDENT_REF);
    cy.wait("@getHistoryError");

    cy.get('[role="dialog"] .MuiAlert-standardError')
      .should("be.visible")
      .and("contain.text", "Erreur lors du chargement de l'historique");
  });
});

describe("Historique d'une note sans identifiant (enseignant)", () => {
  it("signale l'absence d'identifiant de note", () => {
    visitExamGrades(WhoamiRoleEnum.TEACHER, [gradedWithoutIdStudentGradeMock]);

    openHistoryOf(NO_ID_STUDENT_REF);
    cy.contains("ID de note manquant pour récupérer l'historique").should(
      "be.visible"
    );
  });
});

describe("Import et modèle des notes (admin)", () => {
  beforeEach(() => {
    visitExamGrades(WhoamiRoleEnum.ADMIN);
  });

  it("importe de nouvelles notes et affiche les lignes invalides", () => {
    cy.intercept(
      "POST",
      `/exams/${COVERAGE_EXAM_ID}/grades/import`,
      importGradeResultWithErrorsMock
    ).as("importGrades");

    openImportDialog();
    cy.get("#mode").click();
    cy.get('[role="option"]').contains("Nouvelles notes").click();
    cy.get('[role="dialog"] textarea[name="comment"]').should("not.exist");

    dropGradeFile();
    cy.get('[role="dialog"]')
      .contains(".MuiTypography-body1", "valid_fees_template.xlsx")
      .should("be.visible");
    cy.contains("button", "Lancer l'import").should("be.enabled").click();
    cy.contains(
      "Êtes-vous certain de vouloir lancer l'import avec le fichier sélectionné ?"
    ).should("be.visible");
    cy.get(".ra-confirm").click();

    cy.wait("@importGrades").its("response.statusCode").should("eq", 200);
    cy.contains("Les import invalides").should("be.visible");
    cy.contains("2 ligne(s) invalide(s) sur").should("be.visible");
    cy.contains("Note hors limite").should("be.visible");
    cy.contains("Étudiant introuvable").should("be.visible");
    cy.get('[data-testid="CloseIcon"]').last().closest("button").click();
    cy.contains("Les import invalides").should("not.exist");
  });

  it("met à jour les notes avec un commentaire obligatoire", () => {
    cy.intercept(
      "POST",
      `/exams/${COVERAGE_EXAM_ID}/grades/import/update*`,
      importGradeResultSuccessMock
    ).as("importUpdatedGrades");

    openImportDialog();
    cy.get("#mode").click();
    cy.get('[role="option"]').contains("Mettre à jours les notes").click();
    cy.get('[role="dialog"] textarea[name="comment"]')
      .should("be.visible")
      .type("Mise à jour après délibération");

    dropGradeFile();
    cy.contains("button", "Lancer l'import").should("be.enabled").click();
    cy.get(".ra-confirm").click();

    cy.wait("@importUpdatedGrades")
      .its("response.statusCode")
      .should("eq", 200);
    cy.contains("Opération effectuée avec succès").should("be.visible");
    cy.contains("Les import invalides").should("not.exist");
  });

  it("télécharge le modèle d'import des notes", () => {
    cy.intercept("GET", `/exams/${COVERAGE_EXAM_ID}/grades/import/template`, {
      statusCode: 200,
      body: "student_ref,score,comment",
      headers: {
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    }).as("getTemplate");

    cy.window().then((win) => {
      cy.spy(win.URL, "createObjectURL").as("createObjectURL");
    });
    const displayedTexts = recordDisplayedTexts();
    openActionsMenu()
      .find('[data-testid="download-button"]')
      .should("contain.text", "Modèle")
      .click();

    cy.wait("@getTemplate").its("response.statusCode").should("eq", 200);
    expectDisplayed(displayedTexts, "Téléchargement en cours...");
    cy.get("@createObjectURL").should("have.been.calledOnce");
  });

  it("notifie une erreur quand le modèle ne peut pas être téléchargé", () => {
    cy.intercept("GET", `/exams/${COVERAGE_EXAM_ID}/grades/import/template`, {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("getTemplateError");

    openActionsMenu().find('[data-testid="download-button"]').click();

    cy.wait("@getTemplateError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors du téléchargement du fichier.").should(
      "be.visible"
    );
  });
});

type GradeRow = {
  student_ref?: string;
  score?: string | number | null;
  comment?: string;
};

type ValidationResult = {isValid: boolean; message: string};

const isCallable = (value: unknown): value is (data: unknown) => unknown =>
  typeof value === "function";

const getWindowFunction = (win: Window, name: string) => {
  const fn: unknown = Reflect.get(win, name);
  if (!isCallable(fn)) {
    throw new Error(`${name} n'est pas exposée sur window`);
  }
  return fn;
};

describe("Utilitaires d'import des notes exposés sur window", () => {
  beforeEach(() => {
    visitExamGrades(WhoamiRoleEnum.MANAGER);
  });

  it("transforme les lignes importées en notes", () => {
    cy.window().then((win) => {
      const transformGradesData = getWindowFunction(win, "transformGradesData");
      const rows: GradeRow[] = [
        {student_ref: "STD1", score: "12.5", comment: "ok"},
        {student_ref: "STD2", score: ""},
        {student_ref: "STD3", score: null, comment: "absent"},
        {student_ref: "STD4"},
      ];

      expect(transformGradesData(undefined)).to.deep.eq([[], []]);
      expect(transformGradesData("pas un tableau")).to.deep.eq([[], []]);
      expect(transformGradesData(rows)).to.deep.eq([
        [],
        [
          {
            student_ref: "STD1",
            grade: {score: 12.5, student_id: null},
            comment: "ok",
          },
          {student_ref: "STD2", comment: ""},
          {student_ref: "STD3", comment: "absent"},
          {student_ref: "STD4", comment: ""},
        ],
      ]);
    });
  });

  it("valide les en-têtes du fichier de notes", () => {
    cy.window().then((win) => {
      const validateGradeData = getWindowFunction(win, "validateGradeData");
      const validRows: GradeRow[] = [
        {student_ref: "STD1", score: "12", comment: "ok"},
      ];
      const missingHeaderRows: GradeRow[] = [{student_ref: "STD1"}];

      const valid = validateGradeData(validRows) as ValidationResult;
      const empty = validateGradeData([]) as ValidationResult;
      const missing = validateGradeData(missingHeaderRows) as ValidationResult;
      const wrongHeader = validateGradeData([
        {student_ref: "STD1", score: "12", unknown: "x"},
      ]) as ValidationResult;

      expect(valid.isValid).to.eq(true);
      expect(empty.message).to.eq("Il n'y a pas d'élément à insérer");
      expect(missing.message).to.eq(
        "Quelques en-têtes obligatoire sont manquantes"
      );
      expect(wrongHeader.message).to.eq(
        "Veuillez re-vérifier les en-têtes de votre fichier"
      );
    });
  });
});
