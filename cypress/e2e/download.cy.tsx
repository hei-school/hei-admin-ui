import {
  newWorkerDoc,
  otherDoc1,
  otherDocsMocks,
  transcript1,
  transcriptsMock,
  workDoc1,
  workDocsMocks,
} from "../fixtures/api_mocks/docs-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.Work.Docs.Download", () => {
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
      `*/users/${student1Mock.id}/work_files/raw?filename=new_document&work_study_status=WORKING*`,
      newWorkerDoc
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can download a student worker doc", () => {
    cy.get(
      '[href="#/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + workDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });
});

describe("Student.Transcript.Docs.Download", () => {
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
      `*/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can download a transcript", () => {
    cy.getByTestid("transcript-docs").click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + transcript1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });
});

describe("Student.Work.Docs.Download", () => {
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
      `*/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
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

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can download a student worker doc", () => {
    cy.get('[href="#/docs/students/WORK_DOCUMENT"]').click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + workDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });
});

describe("Student.Other.Docs.Download", () => {
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
      `*/users/${student1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${transcript1.id}`,
      transcript1
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/files/${otherDoc1.id}`,
      otherDoc1
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `*/users/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );

    cy.login({role: "STUDENT"});
    cy.getByTestid("docs").click();
  });

  it("can download an other student doc", () => {
    cy.getByTestid("other-docs").click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + otherDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });
});
