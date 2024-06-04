import {
  heiDoc1,
  heiDocsMocks,
  newDoc,
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

describe("Manager.Hei.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", "/school/files?*", heiDocsMocks);
    cy.intercept("GET", `/school/files/${heiDoc1.id}`, heiDoc1);
    cy.intercept(
      "POST",
      `/school/files/raw?file_type=DOCUMENT&filename=${newDoc.name}`,
      newDoc
    );

    cy.login({role: "MANAGER"});

    cy.get('[data-testid="docs"]').click();
    cy.getByTestid("hei-docs").click();
  });

  it("can list hei docs", () => {
    cy.contains("Liste des documents chez HEI");
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");

    cy.contains("Taille : " + heiDocsMocks.length);
  });

  it("can detail and download a hei doc", () => {
    cy.contains("Afficher").click();

    cy.contains("Document : " + heiDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });

  it("can create a new hei doc", () => {
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").click();
    cy.get("#name").click().type(newDoc?.name!);
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.contains("Document créé");
  });
});

describe("Manager.Transcript.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `/students?*`, studentsMock);
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files?file_type=TRANSCRIPT*`,
      transcriptsMock
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/files/raw?file_type=TRANSCRIPT&filename=${newTranscript.name}`,
      newTranscript
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-last_name").type(student1Mock.last_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.last_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can create a student transcript", () => {
    cy.get('[href="#/students/student1_id/docs/students/TRANSCRIPT"]').click();
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
    cy.get('[href="#/students/student1_id/docs/students/TRANSCRIPT"]').click();

    cy.contains(`Liste des bulletins de ${student1Mock.ref}`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});

describe("Manager.Work.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `/students?*`, studentsMock);
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/work_files/raw?filename=new_document&work_study_status=WORKING*`,
      newWorkerDoc
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-last_name").type(student1Mock.last_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.last_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can detail and download a student worker doc", () => {
    cy.get(
      '[href="#/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + workDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });

  it("can list student worker docs", () => {
    cy.get(
      '[href="#/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();

    cy.contains(`Liste des autorisations d'alternance de ${student1Mock.ref}`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });

  it("can create a student worker doc", () => {
    cy.get(
      '[href="#/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").click();
    cy.get("#name").click().type(newTranscript?.name!);
    cy.get("#commitment_begin_date").click().type("2024-05-03");
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.contains("Document créé");
  });
});

describe("Manager.Other.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `/students?*`, studentsMock);
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/files/raw?file_type=OTHER&filename=${newOtherrDoc.name}`,
      newOtherrDoc
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-last_name").type(student1Mock.last_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.last_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can list other student docs", () => {
    cy.get('[href="#/students/student1_id/docs/students/OTHER"]').click();

    cy.contains(`Liste des autres documents étudiant de ${student1Mock.ref}`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});