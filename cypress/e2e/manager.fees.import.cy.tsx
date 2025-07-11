import {feesMock} from "../fixtures/api_mocks/fees-mocks";
import {statsMocks} from "../fixtures/api_mocks/letters-mocks";
import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

type ImportArgs = {
  file: string;
  message: string;
  middleware?: () => void;
};

const importFile = ({file, message, middleware}: ImportArgs) => {
  const _path = "cypress/fixtures/fees_import";
  const _mockFile = `${_path}/${file}`;

  cy.getByTestid("menu-list-action").click();
  cy.get("#import-button").click();
  cy.getByTestid("inputFile").selectFile(_mockFile, {force: true});
  cy.getByTestid("inputFile").selectFile(_mockFile, {force: true});

  cy.contains("Confirmer").click();
  middleware && middleware();
  cy.contains(message);
};

describe("Manager import fees for one students", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept(
      "GET",
      `/students?page=2&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName2");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.intercept("GET", `students/letters/stats`, statsMocks).as("getStats");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getStudent1Fees");

    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getStudent1Fees2");

    cy.wait("@getWhoami");
    cy.intercept("GET", `/manager/${manager1Mock.id}`, manager1Mock).as(
      "getManager1"
    );
    cy.getByTestid("students-menu").click();
    cy.get('[href="/students"]').click();
    cy.getByTestid("main-search-filter").type(student1Mock.first_name);
    cy.wait("@getStudentsByFirstName");
    cy.contains(student1Mock.first_name).click();
    cy.wait("@getStudent1");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getStudent1Fees");
  });

  it("cannot create fees if the file is empty", () => {
    importFile({
      file: "0_fees_template.xlsx",
      message: "Il n'y a pas d'élément à insérer",
    });
  });

  it("cannot create fees if there is too much fees to create", () => {
    importFile({
      file: "13_fees_template.xlsx",
      message: "Vous ne pouvez importer que 20 éléments à la fois.",
    });
  });

  it("cannot create fees if the headers are not corrects", () => {
    importFile({
      file: "not_valid_heads_fees_template.xlsx",
      message: "Veuillez re-vérifier les en-têtes de votre fichier",
    });
  });

  it("cannot create fees if the minimal headers are missing", () => {
    importFile({
      file: "missing_header_fees_template.xlsx",
      message: "Quelques en-têtes obligatoire sont manquantes",
    });
  });

  it("cannot create fees if some data are not correct", () => {
    importFile({
      file: "not_valid_fees_template.xlsx",
      message: "Tous les montants totaux doivent être des nombres",
    });
  });

  it("notifies if the multiple students creation failed", () => {
    cy.intercept("PUT", `/fees`, [feesMock]).as("createFees");
    importFile({
      file: "valid_fees_template.xlsx",
      message: "Importation effectuée avec succès",
      middleware: () => {
        cy.wait("@createFees").then((requestIntersection) => {
          const DATA_LENGTH = 7; //data inside the correct xlsx file fixtures

          //One type of data inside the xlsx
          const feesExpected = {
            type: "TUITION",
            comment: "comment1",
            category: "L3",
            frequency: "YEARLY",
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
    });
  });
});
