import {
  newOtherrDoc,
  newTranscript,
  newWorkerDoc,
  otherDoc1,
  otherDocsMocks,
  transcript1,
  transcriptsMock,
  workDoc1,
  workDocsMocks,
} from "../fixtures/api_mocks/docs-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.Transcript.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `*/students?*`, studentsMock);
    cy.intercept("GET", `*/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files?file_type=TRANSCRIPT*`,
      transcriptsMock
    );
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "POST",
      `*/users/${student1Mock.id}/files/raw?file_type=TRANSCRIPT&filename=${newTranscript.name}`,
      newTranscript
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can create a student transcript", () => {
    cy.get('[href="/students/student1_id/docs/students/TRANSCRIPT"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").click();
    cy.get("#name").click().type(newTranscript?.name!);
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.contains("Document créé");
  });

  it("can list a student transcripts", () => {
    cy.get('[href="/students/student1_id/docs/students/TRANSCRIPT"]').click();

    cy.contains(`Liste des bulletins de ${student1Mock.ref}`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});

describe("Manager.Work.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `*/students?*`, studentsMock);
    cy.intercept("GET", `*/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );
    cy.intercept(
      "POST",
      `*/students/${student1Mock.id}/work_files/raw?*`,
      newWorkerDoc
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can list student worker docs", () => {
    cy.get(
      '[href="/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();

    cy.contains(
      `Liste des validations d'expériences professionnelles de ${student1Mock.ref}`
    );
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });

  it("can create a student worker doc", () => {
    cy.get(
      '[href="/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").click();
    cy.get("#name").click().type(newTranscript?.name!);
    cy.get("#commitment_begin_date").click().type("2024-05-03");
    cy.get("#commitment_end_date").click().type("2024-06-03");
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.contains("Document créé");
  });
});

describe("Manager.Other.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `*/students?*`, studentsMock);
    cy.intercept("GET", `*/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
    cy.intercept(
      "POST",
      `*/users/${student1Mock.id}/files/raw?file_type=OTHER&filename=${newOtherrDoc.name}`,
      newOtherrDoc
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can list other student docs", () => {
    cy.get('[href="/students/student1_id/docs/students/OTHER"]').click();

    cy.contains(`Liste des autres documents étudiant de ${student1Mock.ref}`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});
