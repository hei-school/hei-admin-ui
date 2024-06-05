import {
  heiDoc1,
  heiDocsMocks,
  otherDoc1,
  otherDocsMocks,
  transcript1,
  transcriptsMock,
  workDoc1,
  workDocsMocks,
} from "../fixtures/api_mocks/docs-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Hei.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", "/school/files?*", heiDocsMocks);
    cy.intercept("GET", `/school/files/${heiDoc1.id}`, heiDoc1);

    cy.login({role: "STUDENT"});

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
});

describe("Transcript.Docs", () => {
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
      `/students/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
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

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can detail and download a transcript", () => {
    cy.getByTestid("transcript-docs").click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + transcript1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });

  it("can list a student transcripts", () => {
    cy.getByTestid("transcript-docs").click();

    cy.contains(`Liste des bulletins`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});

describe("Work.Docs", () => {
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
      `/students/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
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

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can detail and download a student worker doc", () => {
    cy.get('[href="#/docs/students/WORK_DOCUMENT"]').click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + workDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });

  it("can list student worker docs", () => {
    cy.get('[href="#/docs/students/WORK_DOCUMENT"]').click();

    cy.contains(`Liste des autorisations d'alternance`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});

describe("Other.Docs", () => {
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
      `/students/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
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

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can detail and download an other student doc", () => {
    cy.getByTestid("other-docs").click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + otherDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });

  it("can list other student docs", () => {
    cy.getByTestid("other-docs").click();

    cy.contains(`Liste des autres documents étudiant`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});
