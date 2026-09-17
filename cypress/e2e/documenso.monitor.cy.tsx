import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  documensoDocumentsMock,
  fileUrlMock,
  pendingDocumentMock,
  signedDocumentMock,
  signingTokenMock,
} from "../fixtures/api_mocks/documenso-mocks";
import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";

const openDocumensoDocuments = () => {
  cy.getByTestid("documenso-documents-menu").click();
  cy.wait("@getMonitorDocuments");
};

const stubNewTab = () => {
  const newTab = {location: {href: ""}, opener: {}, close: cy.stub()};
  cy.window().then((win) => {
    cy.wrap(cy.stub(win, "open").returns(newTab)).as("windowOpen");
  });
  return newTab;
};

describe("Monitor.Documenso", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});

    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/documenso-documents?page=1&page_size=10`,
      documensoDocumentsMock
    ).as("getMonitorDocuments");
    cy.intercept(
      "GET",
      `/documenso-documents/${pendingDocumentMock.id}/signing-token`,
      signingTokenMock
    ).as("getSigningToken");
    cy.intercept(
      "GET",
      `/documenso-documents/${signedDocumentMock.id}/file-url`,
      fileUrlMock
    ).as("getFileUrl");
  });

  it("lists the documents of the monitor's students", () => {
    openDocumensoDocuments();

    cy.get("table tbody tr").should(
      "have.length",
      documensoDocumentsMock.length
    );
    cy.get("table tbody tr")
      .first()
      .should("contain", pendingDocumentMock.subject!.ref)
      .and("contain", pendingDocumentMock.subject!.first_name)
      .and("contain", pendingDocumentMock.subject!.last_name)
      .and("contain", pendingDocumentMock.templateTitle)
      .and("contain", "En attente de signature");
  });

  it("opens the signing page of a pending document in a new tab", () => {
    openDocumensoDocuments();
    const newTab = stubNewTab();

    cy.get("table tbody tr")
      .first()
      .find('[data-testid="sign-documenso-document-button"]')
      .click();

    cy.wait("@getSigningToken");
    cy.get("@windowOpen").should("have.been.calledWith", "", "_blank");
    cy.wrap(newTab)
      .its("location.href")
      .should("contain", `/sign/${signingTokenMock.token}`);
  });

  it("notifies the monitor when the signing page cannot be opened", () => {
    cy.intercept(
      "GET",
      `/documenso-documents/${pendingDocumentMock.id}/signing-token`,
      {statusCode: 500, body: {}}
    ).as("failingSigningToken");

    openDocumensoDocuments();
    stubNewTab();

    cy.get("table tbody tr")
      .first()
      .find('[data-testid="sign-documenso-document-button"]')
      .click();

    cy.wait("@failingSigningToken");
    cy.contains("Impossible d'ouvrir la fiche à signer");
  });

  it("only offers the sign button while the document is pending", () => {
    openDocumensoDocuments();

    cy.get("table tbody tr")
      .first()
      .find('[data-testid="sign-documenso-document-button"]')
      .should("not.be.disabled");
    cy.get("table tbody tr")
      .eq(1)
      .find('[data-testid="sign-documenso-document-button"]')
      .should("be.disabled");
  });

  it("opens the signed document and keeps it closed while pending", () => {
    openDocumensoDocuments();
    const newTab = stubNewTab();

    cy.get("table tbody tr")
      .first()
      .find('[data-testid="open-signed-document-button"]')
      .should("be.disabled");

    cy.get("table tbody tr")
      .eq(1)
      .find('[data-testid="open-signed-document-button"]')
      .click();

    cy.wait("@getFileUrl");
    cy.wrap(newTab).its("location.href").should("eq", fileUrlMock.fileUrl);
  });
});
