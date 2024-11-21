import {
  otherDoc1,
  otherDocsMocks,
  transcript1,
  transcriptsMock,
  workDoc1,
  workDocsMocks,
} from "../fixtures/api_mocks/docs-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Transcript.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `/students?*`, studentsMock);
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files?file_type=TRANSCRIPT*`,
      transcriptsMock
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
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
      `/users/${student1Mock.id}/files?file_type=TRANSCRIPT*`,
      transcriptsMock
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files/${otherDoc1.id}`,
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

  it("can list student worker docs", () => {
    cy.get('[href="#/docs/students/WORK_DOCUMENT"]').click();

    cy.contains(`Liste des validations d'expériences professionnelles`);
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
      `/users/${student1Mock.id}/files?file_type=TRANSCRIPT*`,
      transcriptsMock
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `/users/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can list other student docs", () => {
    cy.getByTestid("other-docs").click();

    cy.contains(`Liste des autres documents étudiant`);
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");
  });
});
