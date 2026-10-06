import {
  SmsContactGroup,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {
  smsCoverageBalanceAlertNoDataMock,
  smsCoverageGroupsForPickerMock,
  smsCoverageLaunchedMock,
  smsCoverageManyRejectedRowsAlertMock,
  smsCoverageSearchContactMock,
  smsCoverageSearchContactWithoutRefMock,
} from "../fixtures/api_mocks/sms-coverage-mocks";
import {
  smsCampaignsMock,
  smsContact1Mock,
  smsContactMonitorMock,
} from "../fixtures/api_mocks/sms-mocks";
import {
  mockSmsCoverageSideEffects,
  navigateInApp,
} from "../support/sms-coverage-helpers";

const PHONE_INPUT = "sms-phone-number-input-manualPhoneNumbers";
const PHONE_HINT = "10 chiffres commençant par 032, 033, 034, 035, 037 ou 038";
const PHONE_CHIPS = '[data-testid^="sms-phone-chip-"]';
const SEARCH_CONTACTS_URL = /\/sms-contacts\?.*search=/;

const [pickerGroup1, pickerGroup2] = smsCoverageGroupsForPickerMock;

const visitCampaignCreate = (groups: SmsContactGroup[] = []) => {
  cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", groups).as(
    "getGroupsForPicker"
  );
  navigateInApp("/sms-campaigns/create");
  cy.wait("@getGroupsForPicker");
  cy.contains("h5", "Nouvelle campagne SMS").should("be.visible");
};

const pasteInto = (testId: string, text: string) =>
  cy.get<HTMLInputElement>(`[data-testid='${testId}']`).then(($input) => {
    const input = $input[0];
    const view = input.ownerDocument.defaultView;
    expect(view, "fenêtre de l'application").to.not.be.null;
    if (!view) return;
    const valueSetter = Object.getOwnPropertyDescriptor(
      view.HTMLInputElement.prototype,
      "value"
    )?.set;
    expect(valueSetter, "setter natif de value").to.be.a("function");
    valueSetter?.call(input, text);
    input.dispatchEvent(new view.Event("input", {bubbles: true}));
  });

const expectPhoneChips = (numbers: string[]) => {
  cy.get(PHONE_CHIPS).should("have.length", numbers.length);
  numbers.forEach((phoneNumber, index) => {
    cy.getByTestid(`sms-phone-chip-${index}`).should("contain", phoneNumber);
  });
};

const pressKeypad = (digits: string) => {
  digits.split("").forEach((digit) => {
    cy.getByTestid(`sms-phone-keypad-digit-manualPhoneNumbers-${digit}`)
      .should("be.visible")
      .click();
  });
};

describe("Coverage.SmsCampaignCreate", () => {
  beforeEach(() => {
    mockSmsCoverageSideEffects();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept(
      "GET",
      "/sms-campaigns?page=1&page_size=10",
      smsCampaignsMock
    ).as("getCampaigns");
  });

  describe("source selection and form layout", () => {
    it("keeps the current source when the selected toggle is clicked again and counts message characters", () => {
      visitCampaignCreate(smsCoverageGroupsForPickerMock);
      cy.getByTestid("sms-source-groups")
        .should("have.attr", "aria-pressed", "true")
        .click();
      cy.getByTestid("sms-source-groups").should(
        "have.attr",
        "aria-pressed",
        "true"
      );
      cy.getByTestid("sms-contact-group-filter-input").should("be.visible");

      cy.contains("0 caractère(s)").should("be.visible");
      cy.get("#message").type("Bonjour");
      cy.contains("7 caractère(s)").should("be.visible");
      cy.get("label[for='message']").should("contain", "Message");
    });

    it("switches between every recipient source and resets the form each time", () => {
      visitCampaignCreate();
      cy.get("#message").type("Texte temporaire");

      cy.getByTestid("sms-source-contacts").click();
      cy.getByTestid("sms-source-contacts").should(
        "have.attr",
        "aria-pressed",
        "true"
      );
      cy.get("#message").should("have.value", "");
      cy.getByTestid("sms-contact-search-contacts").should("be.visible");

      cy.getByTestid("sms-source-manual").click();
      cy.getByTestid(PHONE_INPUT).should("be.visible");
      cy.getByTestid("sms-contact-search-contacts").should("not.exist");

      cy.getByTestid("sms-source-file").click();
      cy.get("label[for='message']").should(
        "contain",
        "Message (optionnel si le fichier est déjà personnalisé)"
      );
      cy.get(".RaFileInput-dropZone").should("exist");
      cy.getByTestid(PHONE_INPUT).should("not.exist");
    });

    it("goes back to the campaign list with the back button", () => {
      visitCampaignCreate();
      cy.contains("button", "Retour aux campagnes").click();
      cy.wait("@getCampaigns");
      cy.routePathnameEq("/sms-campaigns");
      cy.get("table tbody tr").should("have.length", smsCampaignsMock.length);
    });

    it("keeps the send button disabled on a pristine form", () => {
      visitCampaignCreate(smsCoverageGroupsForPickerMock);
      cy.getByTestid("send-sms-campaign").should("be.disabled");
      cy.get("#message").type("x");
      cy.getByTestid("send-sms-campaign").should("be.enabled");
    });

    it("blocks a group campaign without a message, then without a group", () => {
      cy.intercept("POST", "/sms-campaigns/by-groups", {
        statusCode: 500,
        body: {},
      }).as("createCampaign");
      visitCampaignCreate(smsCoverageGroupsForPickerMock);
      cy.getByTestid("sms-contact-group-filter-input").type("promo");
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup1.id}`).click();
      cy.getByTestid("send-sms-campaign").click();
      cy.get("#message").should("have.attr", "aria-invalid", "true");
      cy.getByTestid("sms-contact-group-filter-input").should(
        "have.attr",
        "aria-invalid",
        "false"
      );

      cy.contains(".MuiChip-root", pickerGroup1.name!)
        .find(".MuiChip-deleteIcon")
        .click();
      cy.get("#message").type("Message sans groupe");
      cy.getByTestid("send-sms-campaign").click();
      cy.getByTestid("sms-contact-group-filter-input").should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get("@createCampaign.all").should("have.length", 0);
      cy.routePathnameEq("/sms-campaigns/create");
    });
  });

  describe("manual phone numbers", () => {
    beforeEach(() => {
      visitCampaignCreate();
      cy.getByTestid("sms-source-manual").click();
      cy.getByTestid(PHONE_INPUT).should("be.visible");
    });

    it("accepts every valid operator prefix typed one after the other", () => {
      cy.getByTestid(PHONE_INPUT).type(
        "0321234567 0331234567 0341234567 0351234567 0371234567 0381234567 "
      );
      expectPhoneChips([
        "0321234567",
        "0331234567",
        "0341234567",
        "0351234567",
        "0371234567",
        "0381234567",
      ]);
      cy.getByTestid(PHONE_INPUT).should("have.value", "");
    });

    it("rejects the unknown prefixes and the numbers with a wrong length", () => {
      ["0361234567", "0391234567", "0311234567", "03412345678"].forEach(
        (invalidNumber) => {
          cy.getByTestid(PHONE_INPUT).clear().type(`${invalidNumber}{enter}`);
          cy.getByTestid(PHONE_INPUT)
            .should("have.value", invalidNumber)
            .and("have.attr", "aria-invalid", "true");
          cy.contains(".MuiFormHelperText-root", PHONE_HINT).should(
            "be.visible"
          );
          cy.get(PHONE_CHIPS).should("not.exist");
        }
      );
    });

    it("keeps duplicated numbers as separate chips", () => {
      cy.getByTestid(PHONE_INPUT).type("0341234567 0341234567 ");
      expectPhoneChips(["0341234567", "0341234567"]);
    });

    it("commits every number of a pasted list and keeps the trailing partial number as draft", () => {
      pasteInto(PHONE_INPUT, "0321234567 0331234567  0381234567 03412");
      expectPhoneChips(["0321234567", "0331234567", "0381234567"]);
      cy.getByTestid(PHONE_INPUT).should("have.value", "03412");
    });

    it("rejects the whole pasted list when one of the numbers is invalid", () => {
      pasteInto(PHONE_INPUT, "0321234567 0211234567 0331234567 ");
      cy.get(PHONE_CHIPS).should("not.exist");
      cy.getByTestid(PHONE_INPUT)
        .should("have.value", "0211234567")
        .and("have.attr", "aria-invalid", "true");
      cy.contains(".MuiFormHelperText-root", PHONE_HINT).should("be.visible");
    });

    it("strips letters and symbols from a pasted value", () => {
      pasteInto(PHONE_INPUT, "+261-abc");
      cy.getByTestid(PHONE_INPUT).should("have.value", "261");
      cy.get(PHONE_CHIPS).should("not.exist");
      cy.contains(
        ".MuiFormHelperText-root",
        "Tapez un numéro puis Espace ou Entrée pour le valider"
      ).should("be.visible");
    });

    it("clears the draft error once the field is emptied and Enter is pressed", () => {
      cy.getByTestid(PHONE_INPUT).type("0211234567{enter}");
      cy.getByTestid(PHONE_INPUT).should("have.attr", "aria-invalid", "true");
      cy.getByTestid(PHONE_INPUT).clear().type("{enter}");
      cy.getByTestid(PHONE_INPUT)
        .should("have.value", "")
        .and("have.attr", "aria-invalid", "false");
      cy.contains(
        ".MuiFormHelperText-root",
        "Tapez un numéro puis Espace ou Entrée pour le valider"
      ).should("be.visible");
      cy.get(PHONE_CHIPS).should("not.exist");
    });

    it("commits the draft when the field loses focus", () => {
      cy.getByTestid(PHONE_INPUT).type("0381234567").blur();
      expectPhoneChips(["0381234567"]);
      cy.getByTestid(PHONE_INPUT).should("have.value", "");
    });

    it("removes a chip with its delete icon", () => {
      cy.getByTestid(PHONE_INPUT).type("0341234567 0351234567 ");
      expectPhoneChips(["0341234567", "0351234567"]);
      cy.getByTestid("sms-phone-chip-0").find(".MuiChip-deleteIcon").click();
      expectPhoneChips(["0351234567"]);
    });

    it("commits the edited number on blur when another chip is deleted", () => {
      cy.getByTestid(PHONE_INPUT).type("0341234567 0351234567 ");
      cy.getByTestid("sms-phone-chip-0").click();
      cy.getByTestid(PHONE_INPUT).should("have.value", "0341234567");
      cy.get(PHONE_CHIPS).should("have.length", 1);
      cy.getByTestid("sms-phone-chip-1").should("contain", "0351234567");
      cy.getByTestid("sms-phone-chip-1").find(".MuiChip-deleteIcon").click();
      expectPhoneChips(["0341234567"]);
      cy.getByTestid(PHONE_INPUT).should("have.value", "");
    });

    it("refuses an invalid replacement and then replaces the edited chip with the first pasted number", () => {
      cy.getByTestid(PHONE_INPUT).type("0341234567 0351234567 ");
      cy.getByTestid("sms-phone-chip-0").click();
      cy.getByTestid(PHONE_INPUT).should("have.value", "0341234567");

      cy.getByTestid(PHONE_INPUT).clear().type("0201234567{enter}");
      cy.getByTestid(PHONE_INPUT).should("have.attr", "aria-invalid", "true");
      cy.get(PHONE_CHIPS).should("have.length", 1);

      pasteInto(PHONE_INPUT, "0321111111 0331111111 ");
      expectPhoneChips(["0321111111", "0351234567", "0331111111"]);
      cy.getByTestid(PHONE_INPUT)
        .should("have.value", "")
        .and("have.attr", "aria-invalid", "false");
    });

    it("drives the numeric keypad: correction, validation, empty validation and hiding", () => {
      cy.getByTestid("sms-phone-keypad-toggle-manualPhoneNumbers").click();
      cy.getByTestid("sms-phone-keypad-manualPhoneNumbers").should(
        "be.visible"
      );

      cy.getByTestid("sms-phone-keypad-backspace-manualPhoneNumbers").click();
      cy.getByTestid(PHONE_INPUT).should("have.value", "");

      pressKeypad("03812345678");
      cy.getByTestid(PHONE_INPUT).should("have.value", "03812345678");
      cy.getByTestid("sms-phone-keypad-validate-manualPhoneNumbers").click();
      cy.getByTestid(PHONE_INPUT).should("have.attr", "aria-invalid", "true");
      cy.get(PHONE_CHIPS).should("not.exist");

      cy.getByTestid("sms-phone-keypad-backspace-manualPhoneNumbers").click();
      cy.getByTestid(PHONE_INPUT).should("have.value", "0381234567");
      cy.getByTestid("sms-phone-keypad-validate-manualPhoneNumbers").click();
      expectPhoneChips(["0381234567"]);

      cy.getByTestid("sms-phone-keypad-validate-manualPhoneNumbers").click();
      expectPhoneChips(["0381234567"]);
      cy.getByTestid(PHONE_INPUT).should("have.attr", "aria-invalid", "false");

      cy.getByTestid("sms-phone-keypad-toggle-manualPhoneNumbers").click();
      cy.getByTestid("sms-phone-keypad-manualPhoneNumbers").should("not.exist");
    });

    it("removes the edited chip when the keypad erases it completely before validating", () => {
      cy.getByTestid(PHONE_INPUT).type("0371234567 0381234567 ");
      cy.getByTestid("sms-phone-keypad-toggle-manualPhoneNumbers").click();
      cy.getByTestid("sms-phone-chip-1").click();
      cy.getByTestid(PHONE_INPUT).should("have.value", "0381234567");
      for (let index = 0; index < 10; index += 1) {
        cy.getByTestid("sms-phone-keypad-backspace-manualPhoneNumbers").click();
      }
      cy.getByTestid(PHONE_INPUT).should("have.value", "");
      cy.getByTestid("sms-phone-keypad-validate-manualPhoneNumbers").click();
      expectPhoneChips(["0371234567"]);
    });

    it("shows the required error when sending without any number", () => {
      cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
        statusCode: 500,
        body: {},
      }).as("createCampaign");
      cy.get("#message").type("Message sans destinataire");
      cy.getByTestid("send-sms-campaign").click();
      cy.getByTestid(PHONE_INPUT).should("have.attr", "aria-invalid", "true");
      cy.getByTestid(PHONE_INPUT)
        .parents(".MuiFormControl-root")
        .first()
        .find(".MuiFormHelperText-root")
        .should("have.class", "Mui-error")
        .and("contain", "ra.validation.required")
        .and("not.contain", "Tapez un numéro");
      cy.get("@createCampaign.all").should("have.length", 0);
    });
  });

  describe("sending and API answers", () => {
    const fillManualCampaign = () => {
      cy.getByTestid("sms-source-manual").click();
      cy.get("#message").type("Campagne de test");
      cy.getByTestid(PHONE_INPUT).type("0341234567 0321234567 ");
      expectPhoneChips(["0341234567", "0321234567"]);
    };

    it("disables the send button while the campaign is being sent and reports partial balance rejection", () => {
      cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
        delay: 1500,
        body: smsCoverageLaunchedMock(1, 1),
      }).as("createCampaign");
      visitCampaignCreate();
      fillManualCampaign();
      cy.getByTestid("send-sms-campaign").click();
      cy.getByTestid("send-sms-campaign").should("be.disabled");
      cy.wait("@createCampaign")
        .its("request.body")
        .should("deep.equal", {
          message: "Campagne de test",
          manualPhoneNumbers: ["0341234567", "0321234567"],
        });
      cy.contains(
        "Campagne envoyée à 1 destinataire(s) (1 non envoyés, solde insuffisant)"
      ).should("be.visible");
      cy.wait("@getCampaigns");
      cy.routePathnameEq("/sms-campaigns");
    });

    it("falls back to a zero balance message when the alert carries no data", () => {
      cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
        statusCode: 400,
        body: smsCoverageBalanceAlertNoDataMock,
      }).as("createCampaign");
      visitCampaignCreate();
      fillManualCampaign();
      cy.getByTestid("send-sms-campaign").click();
      cy.wait("@createCampaign");
      cy.contains("Solde SMS insuffisant (0 disponible(s))").should(
        "be.visible"
      );
      cy.routePathnameEq("/sms-campaigns/create");
      cy.getByTestid("send-sms-campaign").should("be.enabled");
    });

    it("shows the generic error for a server error that is not a 400", () => {
      cy.intercept("POST", "/sms-campaigns/by-manual-numbers", {
        statusCode: 500,
        body: {message: "Erreur interne"},
      }).as("createCampaign");
      visitCampaignCreate();
      fillManualCampaign();
      cy.getByTestid("send-sms-campaign").click();
      cy.wait("@createCampaign");
      cy.contains("Erreur lors de l'envoi de la campagne SMS").should(
        "be.visible"
      );
      cy.contains("Erreur interne").should("not.exist");
    });

    it("creates a group campaign with two groups, after deselecting one from the list", () => {
      cy.intercept("POST", "/sms-campaigns/by-groups", {
        body: smsCoverageLaunchedMock(6),
      }).as("createCampaign");
      visitCampaignCreate(smsCoverageGroupsForPickerMock);
      cy.get("#message").type("Rappel promo");

      cy.getByTestid("sms-contact-group-filter-input").type("promo");
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup1.id}`)
        .should("contain", pickerGroup1.name)
        .click();
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup2.id}`).click();
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup2.id}`)
        .find("input[type='checkbox']")
        .should("be.checked");
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup2.id}`).click();
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup2.id}`)
        .find("input[type='checkbox']")
        .should("not.be.checked");
      cy.contains(".MuiChip-root", pickerGroup2.name!).should("not.exist");
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup2.id}`).click();
      cy.contains(".MuiChip-root", pickerGroup1.name!).should("be.visible");
      cy.contains(".MuiChip-root", pickerGroup2.name!).should("be.visible");

      cy.getByTestid("send-sms-campaign").click();
      cy.wait("@createCampaign")
        .its("request.body")
        .should("deep.equal", {
          message: "Rappel promo",
          contactGroupIds: [pickerGroup1.id, pickerGroup2.id],
        });
      cy.contains("Campagne envoyée à 6 destinataire(s)").should("be.visible");
    });

    it("shows a loading message while the group list is still being fetched", () => {
      cy.intercept("GET", "/sms-contact-groups?page=1&page_size=500", {
        delay: 2500,
        body: smsCoverageGroupsForPickerMock,
      }).as("getSlowGroups");
      navigateInApp("/sms-campaigns/create");
      cy.getByTestid("sms-contact-group-filter-input").type("pr");
      cy.contains("Chargement…").should("be.visible");
      cy.wait("@getSlowGroups");
      cy.getByTestid(`toggle-sms-contact-group-${pickerGroup1.id}`).should(
        "be.visible"
      );
      cy.contains("Chargement…").should("not.exist");
    });

    it("creates a contact campaign after removing a selected contact chip and reports a contact source error", () => {
      cy.intercept("GET", SEARCH_CONTACTS_URL, [
        smsCoverageSearchContactMock,
        smsCoverageSearchContactWithoutRefMock,
      ]).as("searchContacts");
      cy.intercept("POST", "/sms-campaigns/by-contacts", {
        statusCode: 400,
        body: {
          type: "SmsInsufficientBalanceAlert",
          message: "Solde insuffisant pour ces contacts",
          availableBalance: 0,
        },
      }).as("createCampaign");
      visitCampaignCreate();
      cy.getByTestid("sms-source-contacts").click();
      cy.get("#message").type("Message contacts");

      cy.getByTestid("sms-contact-search-contacts").type("C");
      cy.contains("Tapez au moins 2 caractères").should("be.visible");

      cy.getByTestid("sms-contact-search-contacts").type("ontact");
      cy.wait("@searchContacts");
      cy.contains("Enseignant (1)").should("be.visible");
      cy.contains("Staff (1)").should("be.visible");
      cy.getByTestid(
        `toggle-sms-contact-${smsCoverageSearchContactMock.id}`
      ).click();
      cy.getByTestid(
        `toggle-sms-contact-${smsCoverageSearchContactWithoutRefMock.id}`
      ).click();

      cy.contains(
        ".MuiChip-root",
        `${smsCoverageSearchContactMock.name} — ${smsCoverageSearchContactMock.ownerRef}`
      ).should("be.visible");
      cy.contains(".MuiChip-root", smsCoverageSearchContactWithoutRefMock.name!)
        .should("be.visible")
        .and("not.contain", " — ")
        .find(".MuiChip-deleteIcon")
        .click();
      cy.contains(
        ".MuiChip-root",
        smsCoverageSearchContactWithoutRefMock.name!
      ).should("not.exist");
      cy.getByTestid(
        `toggle-sms-contact-${smsCoverageSearchContactWithoutRefMock.id}`
      ).should("be.visible");

      cy.getByTestid("send-sms-campaign").click();
      cy.wait("@createCampaign")
        .its("request.body")
        .should("deep.equal", {
          message: "Message contacts",
          contactIds: [smsCoverageSearchContactMock.id],
        });
      cy.contains("Solde insuffisant pour ces contacts").should("be.visible");
    });

    it("shows the searching state then the linked student column for a monitor reference", () => {
      cy.intercept("GET", SEARCH_CONTACTS_URL, {
        delay: 1500,
        body: [smsContactMonitorMock, smsContact1Mock],
      }).as("searchContacts");
      visitCampaignCreate();
      cy.getByTestid("sms-source-contacts").click();
      cy.getByTestid("sms-contact-search-contacts").type("MTR21001");
      cy.contains("Recherche…").should("be.visible");
      cy.wait("@searchContacts");
      cy.contains("Moniteur (1)").should("be.visible");
      cy.contains("Étudiant lié (1)").should("be.visible");
      cy.contains("Recherche…").should("not.exist");
    });

    it("blocks a contact campaign without any selected contact", () => {
      cy.intercept("POST", "/sms-campaigns/by-contacts", {
        statusCode: 500,
        body: {},
      }).as("createCampaign");
      visitCampaignCreate();
      cy.getByTestid("sms-source-contacts").click();
      cy.get("#message").type("Message contacts");
      cy.getByTestid("send-sms-campaign").click();
      cy.getByTestid("sms-contact-search-contacts").should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get("@createCampaign.all").should("have.length", 0);
    });

    it("sends the optional message with the file and lists only the first three rejected rows", () => {
      cy.intercept("POST", "/sms-campaigns/by-file*", {
        statusCode: 400,
        body: smsCoverageManyRejectedRowsAlertMock,
      }).as("createCampaignByFile");
      visitCampaignCreate();
      cy.getByTestid("sms-source-file").click();
      cy.get("#message").type("Message commun");
      cy.get(".RaFileInput-dropZone").attachFileToDropZone(
        "sms_import/contacts.csv"
      );
      cy.contains("contacts.csv").should("exist");
      cy.getByTestid("send-sms-campaign").click();
      cy.wait("@createCampaignByFile").then((interception) => {
        expect(decodeURIComponent(interception.request.url)).to.contain(
          "message=Message"
        );
      });
      cy.contains("Fichier rejeté, aucune SMS envoyé — 4 ligne(s) invalide(s)")
        .should("be.visible")
        .and("contain", "ligne 2 (abc) : Numéro invalide")
        .and("contain", "ligne 4 () : Numéro manquant")
        .and("not.contain", "ligne 5");
    });

    it("blocks a file campaign without any file", () => {
      cy.intercept("POST", "/sms-campaigns/by-file*", {
        statusCode: 500,
        body: {},
      }).as("createCampaignByFile");
      visitCampaignCreate();
      cy.getByTestid("sms-source-file").click();
      cy.get("#message").type("Message sans fichier");
      cy.getByTestid("send-sms-campaign").click();
      cy.contains(".Mui-error", "Ce champ est requis").should("be.visible");
      cy.get("@createCampaignByFile.all").should("have.length", 0);
      cy.routePathnameEq("/sms-campaigns/create");
    });
  });
});
