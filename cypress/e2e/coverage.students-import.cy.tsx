import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import * as XLSX from "xlsx";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";
import {
  mockUnhandledRequests,
  navigateInApp,
} from "../support/coverage-navigation";

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const EXPECTED_HEADERS = [
  "ref",
  "first_name",
  "last_name",
  "email",
  "sex",
  "birth_date",
  "address",
  "phone",
  "entrance_datetime",
  "payment_frequency",
];

const studentRow = (index: number) => [
  `STD26${String(index).padStart(3, "0")}`,
  `Prénom ${index}`,
  `Nom ${index}`,
  `etudiant${index}@hei.school`,
  "F",
  "2005-01-01",
  "Antananarivo",
  "0340000000",
  "2026-09-01",
  "MONTHLY",
];

const importRoute = {method: "POST", pathname: "/students/import"};
const SUBMIT_HINT =
  "Veuillez sélectionner un fichier valide pour activer l'enregistrement";

const workbookFile = (
  rows: (string | number)[][],
  fileName = "etudiants.xlsx"
): Cypress.FileReferenceObject => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(rows),
    "Etudiants"
  );
  const contents: ArrayBuffer = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });
  return {
    contents: Cypress.Buffer.from(contents),
    fileName,
    mimeType: XLSX_MIME,
  };
};

const validWorkbook = () =>
  workbookFile([EXPECTED_HEADERS, studentRow(1), studentRow(2)]);

const importDialog = () =>
  cy.contains('[role="dialog"]', "Importer les étudiants");

const dropFile = (file: Cypress.FileReferenceObject) =>
  importDialog()
    .find(".RaFileInput-dropZone")
    .selectFile(file, {action: "drag-drop"});

const saveButton = () => importDialog().contains("button", "Lancer l'import");

const openImportDialog = () => {
  cy.getByTestid("menu-list-action").click();
  cy.getByTestid("import-students-button").click();
  importDialog().should("be.visible");
};

describe("Coverage - import des étudiants", () => {
  beforeEach(() => {
    mockUnhandledRequests();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", "/students?page=*&page_size=*", studentsMock).as(
      "getStudents"
    );
    navigateInApp("/students");
    cy.wait("@getStudents");
    openImportDialog();
  });

  it("désactive l'import tant qu'aucun fichier n'est choisi", () => {
    importDialog().should("contain.text", SUBMIT_HINT);
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("refuse un fichier dont les en-têtes sont incomplets", () => {
    dropFile(
      workbookFile([
        ["ref", "first_name"],
        ["STD1", "Hery"],
      ])
    );

    importDialog()
      .should("contain.text", "En-têtes manquants : last_name, email")
      .and("contain.text", "Veuillez utiliser le modèle dans template")
      .and("contain.text", SUBMIT_HINT);
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("refuse un fichier vide", () => {
    dropFile({
      contents: Cypress.Buffer.alloc(0),
      fileName: "vide.xlsx",
      mimeType: XLSX_MIME,
    });

    importDialog().should(
      "contain.text",
      `En-têtes manquants : ${EXPECTED_HEADERS.join(", ")}.`
    );
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("refuse un fichier de plus de 50 étudiants", () => {
    const rows = Array.from({length: 51}, (_, index) => studentRow(index));
    dropFile(workbookFile([EXPECTED_HEADERS, ...rows]));

    importDialog().should(
      "contain.text",
      "Le fichier contient plus de 50 entrées. Réduisez à 50 maximum."
    );
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("signale un fichier illisible", () => {
    dropFile({
      contents: Cypress.Buffer.concat([
        Cypress.Buffer.from([0x50, 0x4b, 0x03, 0x04]),
        Cypress.Buffer.alloc(100, 7),
      ]),
      fileName: "corrompu.xlsx",
      mimeType: XLSX_MIME,
    });

    importDialog().should(
      "contain.text",
      "Erreur lors de la lecture du fichier"
    );
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("refuse un fichier d'un format non accepté", () => {
    dropFile({
      contents: Cypress.Buffer.from("pas un tableur"),
      fileName: "notes.txt",
      mimeType: "text/plain",
    });

    importDialog().should(
      "contain.text",
      "La taille maximale autorisée pour le fichier est de 4.77 Mo."
    );
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("décrit un fichier valide puis le retire", () => {
    dropFile(validWorkbook());

    importDialog()
      .should("contain.text", "etudiants.xlsx")
      .and("contain.text", "Ko - 2 lignes")
      .and("not.contain.text", SUBMIT_HINT);
    importDialog().find('img[alt="Excel"]').should("be.visible");
    saveButton().should("be.enabled");

    importDialog().find(".RaFileInput-removeButton button").click();

    importDialog()
      .should("contain.text", SUBMIT_HINT)
      .and("not.contain.text", "etudiants.xlsx");
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.disabled");
  });

  it("accepte un modèle sans étudiant", () => {
    dropFile(workbookFile([EXPECTED_HEADERS], "modele.xlsx"));

    importDialog()
      .should("contain.text", "modele.xlsx")
      .and("not.contain.text", "lignes");
    cy.contains('[role="dialog"]', "Importer les étudiants")
      .contains("button", "Lancer l'import")
      .should("be.enabled");
  });

  it("demande de remplir le formulaire quand la date limite manque", () => {
    cy.intercept(importRoute, cy.spy().as("importStudents"));
    dropFile(validWorkbook());

    saveButton().click();
    cy.contains('[role="dialog"]', "Confirmation").find(".ra-confirm").click();

    cy.contains("Veuillez remplir le formulaire avant de valider").should(
      "be.visible"
    );
    cy.get("@importStudents").should("not.have.been.called");
  });

  it("n'envoie rien quand la confirmation est annulée", () => {
    cy.intercept(importRoute, cy.spy().as("importStudents"));
    dropFile(validWorkbook());
    importDialog().find("input#due_datetime").type("2026-12-31");

    saveButton().click();
    cy.contains('[role="dialog"]', "Confirmation")
      .contains("button", "Annuler")
      .click();

    cy.contains('[role="dialog"]', "Confirmation").should("not.exist");
    importDialog().should("be.visible");
    cy.get("@importStudents").should("not.have.been.called");
  });

  it("importe les étudiants du fichier", () => {
    cy.intercept(importRoute, {statusCode: 200, body: {}}).as("importStudents");
    dropFile(validWorkbook());
    importDialog().find("input#due_datetime").type("2026-12-31");

    saveButton().click();
    cy.contains('[role="dialog"]', "Confirmation")
      .should(
        "contain.text",
        "Êtes-vous certain de vouloir lancer l'import avec le fichier sélectionné ?"
      )
      .find(".ra-confirm")
      .click();

    cy.wait("@importStudents").then(({request}) => {
      expect(request.url).to.contain("due_datetime=2026-12-31");
      expect(request.headers["content-type"]).to.contain("multipart/form-data");
    });
    cy.contains("Opération effectuée avec succès").should("be.visible");
    importDialog().should("not.exist");
  });

  it("signale l'échec de l'import", () => {
    cy.intercept(importRoute, {statusCode: 500, body: {}}).as("importStudents");
    dropFile(validWorkbook());
    importDialog().find("input#due_datetime").type("2026-12-31");

    saveButton().click();
    cy.contains('[role="dialog"]', "Confirmation").find(".ra-confirm").click();

    cy.wait("@importStudents").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors de l'opération").should("be.visible");
    importDialog().should("be.visible");
  });
});
