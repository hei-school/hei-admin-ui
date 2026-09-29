import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  documensoDocumentsMock,
  documensoPromotionsMock,
  documensoTemplatesMock,
  fileUrlMock,
  generationResultMock,
  otherTemplateDocumentMock,
  pendingDocumentMock,
  promotionL1Mock,
  promotionM1Mock,
  rejectedDocumentMock,
  signedDocumentMock,
  templateL1Mock,
  templateM1Mock,
} from "../fixtures/api_mocks/documenso-mocks";

const PROMOTION_DOCUMENTS_URL = `/promotions/${promotionL1Mock.id}/documenso-documents`;

const openDocumensoPage = () => {
  cy.getByTestid("docs").click();
  cy.getByTestid("documenso-documents-menu").click();
};

const openL1Template = () => {
  cy.wait("@getTemplates");
  cy.contains("td", templateL1Mock.title!).click();
  cy.wait("@getPromotions");
};

const openL1PromotionDocuments = () => {
  openL1Template();
  cy.getByTestid("see-documenso-documents-button").click();
  cy.wait("@getPromotionDocuments");
};

describe("Admin.Documenso", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});

    cy.intercept(
      "POST",
      "/documenso-templates/sync",
      documensoTemplatesMock
    ).as("syncTemplates");
    cy.intercept(
      "GET",
      "/documenso-templates?page=1&page_size=10",
      documensoTemplatesMock
    ).as("getTemplates");
    cy.intercept(
      "GET",
      "/promotions?page=1&page_size=10",
      documensoPromotionsMock
    ).as("getPromotions");
    cy.intercept("GET", `${PROMOTION_DOCUMENTS_URL}?page=1&page_size=10`, [
      ...documensoDocumentsMock,
      otherTemplateDocumentMock,
    ]).as("getPromotionDocuments");
    cy.intercept(
      "GET",
      `${PROMOTION_DOCUMENTS_URL}?status=PENDING&page=1&page_size=10`,
      [pendingDocumentMock]
    ).as("getPendingDocuments");
    cy.intercept("POST", PROMOTION_DOCUMENTS_URL, generationResultMock).as(
      "generateDocuments"
    );
    cy.intercept(
      "GET",
      `/documenso-documents/${signedDocumentMock.id}/file-url`,
      fileUrlMock
    ).as("getFileUrl");
  });

  it("synchronises the templates on arrival and lists them", () => {
    cy.intercept("POST", "/documenso-templates/sync", {
      body: documensoTemplatesMock,
      delay: 300,
    }).as("slowSyncTemplates");

    openDocumensoPage();

    cy.getByTestid("documenso-sync-loader").should("exist");
    cy.wait("@slowSyncTemplates");
    cy.contains(
      `${documensoTemplatesMock.length} modèle(s) synchronisé(s) depuis Documenso`
    );
    cy.wait("@getTemplates");
    cy.get("table tbody tr")
      .should("have.length", documensoTemplatesMock.length)
      .first()
      .should("contain", templateL1Mock.title)
      .and("contain", templateL1Mock.type);
  });

  it("notifies the admin when the synchronisation fails", () => {
    cy.intercept("POST", "/documenso-templates/sync", {
      statusCode: 500,
      body: {},
    }).as("failingSync");

    openDocumensoPage();

    cy.wait("@failingSync");
    cy.contains("Erreur lors de la synchronisation des modèles");
    cy.wait("@getTemplates");
    cy.contains("td", templateL1Mock.title!).should("exist");
  });

  it("only lists the promotions matching the template level", () => {
    openDocumensoPage();
    openL1Template();

    cy.contains(`Promotions L1 — ${templateL1Mock.title}`).should("exist");
    cy.get("table tbody tr")
      .should("have.length", 1)
      .first()
      .should("contain", promotionL1Mock.ref)
      .and("contain", promotionL1Mock.name);
    cy.contains("td", promotionM1Mock.name!).should("not.exist");
  });

  it("generates the documents of a promotion", () => {
    openDocumensoPage();
    openL1Template();

    cy.getByTestid("generate-documenso-documents-button").click();
    cy.contains("Génération des fiches à signer").should("exist");
    cy.getByTestid("launch-generation-button").click();

    cy.wait("@generateDocuments")
      .its("request.body")
      .should("deep.equal", {templateName: templateL1Mock.title});
    cy.contains(
      `Génération lancée pour ${generationResultMock.studentCount} étudiant(s) mensualisé(s).`
    );
  });

  it("notifies the admin when the generation fails", () => {
    cy.intercept("POST", PROMOTION_DOCUMENTS_URL, {
      statusCode: 500,
      body: {},
    }).as("failingGeneration");

    openDocumensoPage();
    openL1Template();

    cy.getByTestid("generate-documenso-documents-button").click();
    cy.getByTestid("launch-generation-button").click();

    cy.wait("@failingGeneration");
    cy.contains("Erreur lors du lancement de la génération");
  });

  it("lists the documents of the promotion for the selected template only", () => {
    openDocumensoPage();
    openL1PromotionDocuments();

    cy.get("table tbody tr").should(
      "have.length",
      documensoDocumentsMock.length
    );
    cy.get("table tbody tr")
      .first()
      .should("contain", pendingDocumentMock.subject!.ref)
      .and("contain", pendingDocumentMock.subject!.first_name)
      .and("contain", pendingDocumentMock.subject!.last_name)
      .and("contain", pendingDocumentMock.level)
      .and("contain", "En attente de signature");
    cy.contains("td", "Signée").should("exist");
    cy.contains("td", "Refusée").should("exist");
    cy.contains("td", otherTemplateDocumentMock.subject!.ref!).should(
      "not.exist"
    );
  });

  it("filters the documents by status", () => {
    openDocumensoPage();
    openL1PromotionDocuments();

    cy.contains("button", "En attente").click();
    cy.wait("@getPendingDocuments");

    cy.get("table tbody tr")
      .should("have.length", 1)
      .first()
      .should("contain", pendingDocumentMock.subject!.ref);
    cy.contains("td", rejectedDocumentMock.subject!.ref!).should("not.exist");
  });

  it("walks back to the templates through the breadcrumbs", () => {
    openDocumensoPage();
    openL1PromotionDocuments();

    cy.contains("Modèles de fiches").click();

    cy.contains("td", templateL1Mock.title!).should("exist");
    cy.contains("td", templateM1Mock.title!).should("exist");
  });

  it("opens the signed document in a new tab", () => {
    openDocumensoPage();
    openL1PromotionDocuments();

    const newTab = {location: {href: ""}, opener: {}, close: cy.stub()};
    cy.window().then((win) => {
      cy.wrap(cy.stub(win, "open").returns(newTab)).as("windowOpen");
    });

    cy.get("table tbody tr")
      .eq(1)
      .find('[data-testid="open-signed-document-button"]')
      .click();

    cy.wait("@getFileUrl");
    cy.get("@windowOpen").should("have.been.calledWith", "", "_blank");
    cy.wrap(newTab).its("location.href").should("eq", fileUrlMock.fileUrl);
  });

  it("keeps the open button disabled while the document is not signed", () => {
    openDocumensoPage();
    openL1PromotionDocuments();

    cy.get("table tbody tr")
      .first()
      .find('[data-testid="open-signed-document-button"]')
      .should("be.disabled");
  });
});
