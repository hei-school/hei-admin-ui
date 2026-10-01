import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  smsCampaignDeliveredMock,
  smsCampaignFailedMock,
  smsCampaignsMock,
  smsContact1Mock,
  smsContact2Mock,
  smsContactGroup1Mock,
  smsContactGroup2Mock,
  smsContactGroupsMock,
  smsContactMonitorMock,
  smsLogDeliveredMock,
  smsLogFailedMock,
} from "../fixtures/api_mocks/sms-mocks";

describe("Manager.SmsCampaigns", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept(
      "GET",
      "/sms-campaigns?page=1&page_size=10",
      smsCampaignsMock
    ).as("getCampaigns");
    cy.visit("/sms-campaigns");
    cy.wait("@getCampaigns");
  });

  it("lists the campaigns", () => {
    cy.get("table tbody tr").should("have.length", 2);
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", smsCampaignDeliveredMock.message)
      .and("contain", "Envoyée")
      .and("contain", "Admin");
    cy.get("table tbody tr").eq(1).should("contain", "Échec");
  });

  it("filters the list by status", () => {
    cy.intercept("GET", "/sms-campaigns?status=DELIVERED&page=1&page_size=10", [
      smsCampaignDeliveredMock,
    ]).as("getDeliveredCampaigns");
    cy.contains("button", "Envoyée").click();
    cy.wait("@getDeliveredCampaigns");
    cy.get("table tbody tr").should("have.length", 1);
  });

  it("opens the details dialog and shows the delivery log without the failure column when everything succeeded", () => {
    cy.intercept(
      "GET",
      `/sms-campaigns/${smsCampaignDeliveredMock.id}/logs?page=1&page_size=10`,
      [smsLogDeliveredMock]
    ).as("getLogs");
    cy.get("table tbody tr").eq(0).click();
    cy.wait("@getLogs");
    cy.contains("Détails de la campagne SMS");
    cy.contains(smsCampaignDeliveredMock.message!);
    cy.contains("Journal d'envoi");
    cy.contains("th", "Motif d'échec").should("not.exist");
    cy.contains(smsLogDeliveredMock.phoneNumber!);
    cy.contains("Numéro manuel");
  });

  it("shows the failure reason column and value for a failed campaign", () => {
    cy.intercept(
      "GET",
      `/sms-campaigns/${smsCampaignFailedMock.id}/logs?page=1&page_size=10`,
      [smsLogFailedMock]
    ).as("getLogs");
    cy.get("table tbody tr").eq(1).click();
    cy.wait("@getLogs");
    cy.contains("th", "Motif d'échec").should("be.visible");
    cy.contains(smsLogFailedMock.failureReason!);
    cy.contains("Fichier importé");
  });

  it("creates a campaign from manually typed numbers", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
      campaignId: "new_campaign_id",
      recipientCount: 2,
      recipientsRejectedForBalance: 0,
      smsSegmentsEach: 1,
      creditsDebited: 2,
      status: "CREATED",
    }).as("createCampaign");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.url().should("include", "/sms-campaigns/create");

    cy.getByTestid("sms-source-manual").click();
    cy.get("#message").type("Rappel de réunion");
    cy.getByTestid("sms-phone-number-input-manualPhoneNumbers").type(
      "0341234567 0341234568 "
    );
    cy.getByTestid("sms-phone-chip-0").should("contain", "0341234567");
    cy.getByTestid("sms-phone-chip-1").should("contain", "0341234568");
    cy.getByTestid("send-sms-campaign").click();

    cy.wait("@createCampaign")
      .its("request.body")
      .should("deep.equal", {
        message: "Rappel de réunion",
        manualPhoneNumbers: ["0341234567", "0341234568"],
      });
    cy.contains("Campagne envoyée à 2 destinataire(s)");
    cy.wait("@getCampaigns");
    cy.url().should("include", "/sms-campaigns");
    cy.url().should("not.include", "/create");
  });

  it("edits a manually typed number by clicking its chip", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
      campaignId: "new_campaign_id",
      recipientCount: 1,
      recipientsRejectedForBalance: 0,
      smsSegmentsEach: 1,
      creditsDebited: 1,
      status: "CREATED",
    }).as("createCampaign");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("sms-source-manual").click();
    cy.get("#message").type("Rappel de réunion");
    cy.getByTestid("sms-phone-number-input-manualPhoneNumbers").type(
      "0341234567 "
    );
    cy.getByTestid("sms-phone-chip-0").should("contain", "0341234567").click();
    cy.getByTestid("sms-phone-number-input-manualPhoneNumbers").should(
      "have.value",
      "0341234567"
    );
    cy.getByTestid("sms-phone-number-input-manualPhoneNumbers")
      .clear()
      .type("0341234999{enter}");
    cy.getByTestid("sms-phone-chip-0").should("contain", "0341234999");
    cy.getByTestid("send-sms-campaign").click();

    cy.wait("@createCampaign")
      .its("request.body")
      .should("deep.equal", {
        message: "Rappel de réunion",
        manualPhoneNumbers: ["0341234999"],
      });
  });

  it("downloads an xlsx template for the file recipient source", () => {
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("sms-source-file").click();
    cy.getByTestid("download-sms-file-template").click();
  });

  it("groups contact search results by role and lists linked contacts when searching a student ref", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("GET", "/sms-contacts?search=*", [
      smsContact1Mock,
      smsContactMonitorMock,
    ]).as("searchContacts");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("sms-source-contacts").click();
    cy.get("#message").type("Rappel de réunion");
    cy.getByTestid("sms-contact-search-contacts").type("STD23097");
    cy.wait("@searchContacts");

    cy.contains("Étudiant (1)");
    cy.contains("Moniteur lié (1)");
    cy.getByTestid(`toggle-sms-contact-${smsContact1Mock.id}`).should(
      "be.visible"
    );
    cy.get('[data-testid^="toggle-sms-contact-"]')
      .eq(0)
      .should(
        "have.attr",
        "data-testid",
        `toggle-sms-contact-${smsContact1Mock.id}`
      );
    cy.get('[data-testid^="toggle-sms-contact-"]')
      .eq(1)
      .should(
        "have.attr",
        "data-testid",
        `toggle-sms-contact-${smsContactMonitorMock.id}`
      );
    cy.getByTestid(`toggle-sms-contact-${smsContactMonitorMock.id}`).click();
    cy.contains(smsContactMonitorMock.name!);
  });

  it("creates a campaign by searching and selecting a contact", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("GET", "/sms-contacts?search=*", [smsContact2Mock]).as(
      "searchContacts"
    );
    cy.intercept("POST", "/sms-campaigns/by-contacts", {
      campaignId: "new_campaign_id",
      recipientCount: 1,
      recipientsRejectedForBalance: 0,
      smsSegmentsEach: 1,
      creditsDebited: 1,
      status: "CREATED",
    }).as("createCampaign");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();

    cy.getByTestid("sms-source-contacts").click();
    cy.get("#message").type("Rappel de réunion");
    cy.getByTestid("sms-contact-search-contacts").type(smsContact2Mock.name!);
    cy.wait("@searchContacts");
    cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`)
      .should("be.visible")
      .click();
    cy.getByTestid("send-sms-campaign").click();

    cy.wait("@createCampaign")
      .its("request.body")
      .should("deep.equal", {
        message: "Rappel de réunion",
        contactIds: [smsContact2Mock.id],
      });
    cy.contains("Campagne envoyée à 1 destinataire(s)");
  });

  it("creates a campaign by checking a contact group in the local filter list", () => {
    cy.intercept(
      "GET",
      "/sms-contact-groups?page=1&page_size=500",
      smsContactGroupsMock
    ).as("getGroupsForPicker");
    cy.intercept("POST", "/sms-campaigns/by-groups", {
      campaignId: "new_campaign_id",
      recipientCount: 1,
      recipientsRejectedForBalance: 0,
      smsSegmentsEach: 1,
      creditsDebited: 1,
      status: "CREATED",
    }).as("createCampaign");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.wait("@getGroupsForPicker");

    cy.get("#message").type("Rappel de réunion");
    cy.getByTestid("sms-contact-group-filter-input").type(
      smsContactGroup1Mock.name!
    );
    cy.getByTestid(`toggle-sms-contact-group-${smsContactGroup1Mock.id}`)
      .should("be.visible")
      .and("contain", smsContactGroup1Mock.name)
      .click();
    cy.contains(smsContactGroup2Mock.name!).should("not.exist");
    cy.getByTestid("send-sms-campaign").click();

    cy.wait("@createCampaign")
      .its("request.body")
      .should("deep.equal", {
        message: "Rappel de réunion",
        contactGroupIds: [smsContactGroup1Mock.id],
      });
    cy.contains("Campagne envoyée à 1 destinataire(s)");
  });

  it("shows an insufficient balance error when sending manually typed numbers", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
      statusCode: 400,
      body: {
        type: "SmsInsufficientBalanceAlert",
        message: "Solde SMS insuffisant pour couvrir ces destinataires",
        availableBalance: 0,
        maxSendableRecipients: 0,
      },
    }).as("createCampaign");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("sms-source-manual").click();
    cy.get("#message").type("Rappel de réunion");
    cy.getByTestid("sms-phone-number-input-manualPhoneNumbers").type(
      "0341234567 "
    );
    cy.getByTestid("send-sms-campaign").click();
    cy.wait("@createCampaign");
    cy.contains("Solde SMS insuffisant pour couvrir ces destinataires");
  });

  it("creates a campaign from an uploaded file, sending only the file in the multipart body", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("POST", "/sms-campaigns/by-file", {
      campaignId: "new_campaign_id",
      recipientCount: 2,
      recipientsRejected: 0,
      rejectedRows: [],
      recipientsRejectedForBalance: 0,
      smsSegmentsEach: 1,
      creditsDebited: null,
      status: "CREATED",
    }).as("createCampaignByFile");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("sms-source-file").click();
    cy.get(".RaFileInput-dropZone").attachFileToDropZone(
      "sms_import/contacts.csv"
    );
    cy.getByTestid("send-sms-campaign").click();
    cy.wait("@createCampaignByFile").then((interception) => {
      expect(interception.request.url).to.not.contain("message=");
      expect(interception.request.headers["content-type"]).to.contain(
        "multipart/form-data"
      );
    });
    cy.contains("Campagne envoyée à 2 destinataire(s)");
  });

  it("shows the rejected rows when the file is refused", () => {
    cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", []);
    cy.intercept("POST", "/sms-campaigns/by-file", {
      statusCode: 400,
      body: {
        type: "SmsFileRowsRejectedAlert",
        message: "Certaines lignes du fichier sont invalides",
        rejectedRows: [{row: 2, value: "abc", reason: "Numéro invalide"}],
      },
    }).as("createCampaignByFile");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("sms-source-file").click();
    cy.get(".RaFileInput-dropZone").attachFileToDropZone(
      "sms_import/contacts.csv"
    );
    cy.getByTestid("send-sms-campaign").click();
    cy.wait("@createCampaignByFile");
    cy.contains("Fichier rejeté");
    cy.contains("ligne 2 (abc) : Numéro invalide");
  });
});
