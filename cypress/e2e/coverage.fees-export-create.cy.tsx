import {Fee, WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {advancedStats} from "../fixtures/api_mocks/fees-stats";
import {feesTemplatesMocks} from "../fixtures/api_mocks/fees-templates-mocks";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";
import {
  mockUnhandledRequests,
  navigateInApp,
} from "../support/coverage-navigation";

const EXPORT_ERROR =
  "Une erreur est survenue lors de l'exportation du fichier.";
const PRESIGNED_URL = "https://exports.hei.test/frais.xlsx";
const rawFeesRoute = {method: "GET", pathname: "/fees/raw"};
const allFeesExportRoute = {method: "GET", pathname: "/fees/export"};

const mockOtherRequests = mockUnhandledRequests;

const exportDialog = () =>
  cy.contains('[role="dialog"]', "Exporter les frais au format XLSX");

const queryOf = (url: string) => new URL(url).searchParams;

const openFeesExport = () => {
  mockOtherRequests();
  cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
  cy.intercept("GET", "/fees/advanced-stats?*", advancedStats).as(
    "getFeesStats"
  );
  cy.intercept("GET", "/fees?*", {data: []}).as("getFees");
  navigateInApp("/fees");
  cy.wait("@getFeesStats");
  cy.contains(".MuiChip-root", "Exporter").click();
  exportDialog().should("be.visible");
};

const clickExport = () =>
  exportDialog().find('[data-testid="download-button"]').click();

describe("Coverage - export des frais", () => {
  beforeEach(() => {
    openFeesExport();
  });

  it("exporte les frais en retard de toutes les périodes", () => {
    cy.intercept(rawFeesRoute, {body: "contenu xlsx"}).as("exportLateFees");

    exportDialog().find('input[name="status"]').should("have.value", "LATE");
    exportDialog().should("not.contain.text", "Type de statistiques");
    clickExport();

    cy.wait("@exportLateFees").then(({request}) => {
      const query = queryOf(request.url);
      expect(query.get("status")).to.eq("LATE");
      expect(query.has("from_due_datetime")).to.eq(false);
      expect(query.has("to_due_datetime")).to.eq(false);
    });
    exportDialog().should("not.exist");
  });

  it("exporte les frais d'un mois puis d'une date de fin choisie", () => {
    cy.intercept(rawFeesRoute, {body: "contenu xlsx"}).as("exportMonthFees");

    exportDialog().find('input[type="month"]').type("2026-03");
    exportDialog()
      .contains("label", "Date de début")
      .parent()
      .find("input")
      .should("have.value", "01/03/2026");
    exportDialog().find('input[type="date"]').type("2026-03-15");
    clickExport();

    cy.wait("@exportMonthFees").then(({request}) => {
      const query = queryOf(request.url);
      expect(query.get("from_due_datetime")).to.eq("2026-03-01T00:00:00.000Z");
      expect(query.get("to_due_datetime")).to.eq("2026-03-15T00:00:00.000Z");
    });
    exportDialog().should("not.exist");
  });

  it("exporte sans date de fin quand elle est effacée", () => {
    cy.intercept(rawFeesRoute, {body: "contenu xlsx"}).as("exportFees");

    exportDialog().find('input[type="month"]').type("2026-04");
    exportDialog().find('input[type="date"]').clear();
    exportDialog().find('input[type="date"]').should("have.value", "");
    clickExport();

    cy.wait("@exportFees").then(({request}) => {
      const query = queryOf(request.url);
      expect(query.get("from_due_datetime")).to.eq("2026-04-01T00:00:00.000Z");
      expect(query.has("to_due_datetime")).to.eq(false);
    });
  });

  it("efface la période quand le mois est retiré", () => {
    cy.intercept(rawFeesRoute, {body: "contenu xlsx"}).as("exportFees");

    exportDialog().find('input[type="month"]').type("2026-05");
    exportDialog().find('input[type="month"]').clear();
    exportDialog()
      .contains("label", "Date de début")
      .parent()
      .find("input")
      .should("have.value", "");
    exportDialog().find('input[type="date"]').should("have.value", "");
    clickExport();

    cy.wait("@exportFees").then(({request}) => {
      const query = queryOf(request.url);
      expect(query.has("from_due_datetime")).to.eq(false);
      expect(query.has("to_due_datetime")).to.eq(false);
    });
  });

  it("exporte tous les frais avec le type de statistiques comptable", () => {
    cy.intercept(allFeesExportRoute, {body: PRESIGNED_URL}).as("exportAllFees");
    cy.intercept("GET", PRESIGNED_URL, {body: "contenu xlsx"}).as(
      "downloadExport"
    );

    exportDialog().find("#status").click();
    cy.get('li[data-value="ALL"]').click();
    exportDialog()
      .should("contain.text", "Type de statistiques")
      .find('input[name="type"]')
      .should("have.value", "ACCOUNTING");
    clickExport();

    cy.wait("@exportAllFees").then(({request}) => {
      expect(queryOf(request.url).get("type")).to.eq("ACCOUNTING");
    });
    cy.wait("@downloadExport");
    exportDialog().should("not.exist");
  });

  it("signale l'échec du téléchargement du fichier exporté", () => {
    cy.intercept(allFeesExportRoute, {body: PRESIGNED_URL}).as("exportAllFees");
    cy.intercept("GET", PRESIGNED_URL, {statusCode: 500, body: ""}).as(
      "downloadExport"
    );

    exportDialog().find("#status").click();
    cy.get('li[data-value="ALL"]').click();
    clickExport();

    cy.wait("@downloadExport");
    cy.contains(EXPORT_ERROR).should("be.visible");
    exportDialog().should("be.visible");
  });

  it("signale l'échec de l'export et garde la fenêtre ouverte", () => {
    cy.intercept(rawFeesRoute, {statusCode: 500, body: {}}).as("exportFees");

    clickExport();

    cy.wait("@exportFees");
    cy.contains(EXPORT_ERROR).should("be.visible");
    exportDialog().should("be.visible");
  });

  it("ferme la fenêtre d'export", () => {
    exportDialog().find(".MuiDialogTitle-root button").click();

    cy.contains('[role="dialog"]', "Exporter les frais au format XLSX").should(
      "not.exist"
    );
  });
});

const selectStudent = (index: number) =>
  cy
    .get(".MuiTableBody-root .MuiTableCell-paddingCheckbox input")
    .eq(index)
    .click();

const floatingButton = () => cy.contains("button", "Créer les frais");

const openMultipleFeesCreate = () => {
  mockOtherRequests();
  cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
  cy.intercept(
    "GET",
    "/fees/templates?page=*&page_size=*",
    feesTemplatesMocks
  ).as("getFeesTemplates");
  cy.intercept("GET", "/students?page=*&page_size=*", studentsMock).as(
    "getStudents"
  );
  navigateInApp("/fees/create");
  cy.wait("@getFeesTemplates");
  cy.wait("@getStudents");
  cy.getByTestid("predefinedType").click();
  cy.get(`[data-value="${feesTemplatesMocks[0].id}"]`).click();
};

describe("Coverage - création de frais pour plusieurs étudiants", () => {
  beforeEach(() => {
    openMultipleFeesCreate();
  });

  it("compte les étudiants sélectionnés", () => {
    floatingButton().should("not.exist");

    selectStudent(0);
    cy.contains("1 étudiant sélectionné").should("be.visible");
    floatingButton().should("be.enabled");

    selectStudent(1);
    cy.contains("2 étudiants sélectionnés").should("be.visible");
  });

  it("crée les frais de chaque étudiant sélectionné", () => {
    cy.intercept("PUT", "/fees*", (request) => {
      const createdFees: Fee[] = request.body;
      request.reply(
        createdFees.map((fee, index) => ({...fee, id: `created_fee_${index}`}))
      );
    }).as("createFees");
    const template = feesTemplatesMocks[0];

    selectStudent(0);
    selectStudent(1);
    floatingButton().click();

    cy.wait("@createFees").then(({request}) => {
      const fees: Fee[] = request.body;
      expect(fees).to.have.length(2 * template.number_of_payments!);
      expect(fees.map((fee) => fee.student_id)).to.include.members([
        studentsMock[0].id,
        studentsMock[1].id,
      ]);
      fees.forEach((fee) => {
        expect(fee.total_amount).to.eq(template.amount);
        expect(fee.type).to.eq(template.type);
      });
    });
    cy.routePathnameEq("/students");
  });

  it("signale l'échec de la création des frais", () => {
    cy.intercept("PUT", "/fees*", {statusCode: 500, body: {}}).as("createFees");

    selectStudent(0);
    floatingButton().click();

    cy.wait("@createFees");
    cy.contains("Une erreur s'est produite").should("be.visible");
    cy.routePathnameEq("/fees/create");
  });

  it("signale une erreur quand les dates d'échéance sont impossibles", () => {
    cy.intercept("PUT", "/fees*", cy.spy().as("createFees"));
    cy.on("uncaught:exception", (error) => {
      expect(error.message).to.contain("Invalid time value");
      return false;
    });

    cy.getByTestid("predefinedYear").clear().type("300000");
    selectStudent(0);
    floatingButton().click();

    cy.contains("Une erreur s'est produite").should("be.visible");
    cy.get("@createFees").should("not.have.been.called");
    cy.routePathnameEq("/fees/create");
  });
});
