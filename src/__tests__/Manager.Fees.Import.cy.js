import { mount, unmount } from "@cypress/react";
import App from "../App";
import { manager1 } from "./credentials";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import {
  feesMock,
  student1Mock,
  studentsMock,
  whoamiManagerMock,
} from "./mocks/responses";

const importFile = (file, message, middleware) => {
  const _path = "cypress/fixtures/fees_import";
  const _mockFile = `${_path}/${file}`;

  cy.get('[data-testid="menu-list-action"]').click();
  cy.get("#import-button").click();
  cy.get("[data-testid='inputFile']").selectFile(_mockFile, { force: true });
  cy.get('[data-testid="inputFile"]').selectFile(_mockFile, { force: true });

  cy.contains("Confirmer").click();
  middleware && middleware();
  cy.contains(message);
};

describe(specTitle("Manager import fees for one students"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();

    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager1.id}`, manager1).as("getManager1");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1",
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock],
    ).as("getStudentsByFirstName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1",
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock,
    ).as("getStudent1Fees");

    cy.wait("@getWhoami", { timeout: 10000 });
    cy.intercept("GET", `/manager/${manager1.id}`, manager1).as("getManager1");
    cy.get('[data-testid="students-menu"]').click();
    cy.get('[href="#/students"]').click();
    cy.get('[data-testid="main-search-filter"]').type(student1Mock.first_name);
    cy.wait("@getStudentsByFirstName");
    cy.contains(student1Mock.first_name).click();
    cy.wait("@getStudent1");
    cy.get('[data-testid="AttachMoneyIcon"]').click();
    cy.wait("@getStudent1Fees");
  });

  it("cannot create fees if the file is empty", () => {
    importFile("0_fees_template.xlsx", "Il n'y a pas d'élément à insérer");
  });

  it("cannot create fees if there is too much students to create", () => {
    importFile(
      "13_fees_template.xlsx",
      "Vous ne pouvez importer que 10 éléments à la fois.",
    );
  });

  it("cannot create fees if the headers are not corrects", () => {
    importFile(
      "nv_heads_fees_template.xlsx",
      "Veuillez re-vérifier les en-têtes de votre fichier",
    );
  });

  it("cannot create fees if the minimal headers are missing", () => {
    importFile(
      "missing_header_fees_template.xlsx",
      "Quelques en-têtes obligatoire sont manquantes",
    );
  });

  it("cannot create fees if some data are not correct", () => {
    importFile(
      "nv_fees_template.xlsx",
      "Tous les montants totaux doivent être des nombres",
    );
  });

  it("notifies if the multiple students creation failed", () => {
    cy.intercept("POST", `/students/${student1Mock.id}/fees`, [feesMock]).as(
      "createFees",
    );
    importFile(
      "v_fees_template.xlsx",
      "Importation effectuée avec succès",
      () => {
        cy.wait("@createFees").then((requestIntersection) => {
          const DATA_LENGTH = 7; //data inside the correct xlsx file fixtures
          //One type of data inside the xlsx
          const feesExpected = {
            type: "TUITION",
            comment: "comment1",
            total_amount: 10,
            due_datetime: new Date("2023-01-01").toISOString(),
            student_id: student1Mock.id,
          };
          const feesRequest = requestIntersection.request.body[0];
          delete feesRequest.creation_datetime;
          expect(feesRequest).to.deep.equal(feesExpected);
          expect(requestIntersection.request.body.length).to.equal(DATA_LENGTH);
        });
      },
    );
  });

  afterEach(() => {
    unmount();
  });
});
