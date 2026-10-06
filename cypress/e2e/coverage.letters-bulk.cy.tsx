import {LetterStatus, WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {pendingLettersMock} from "../fixtures/api_mocks/coverage-grades-mocks";
import {statsMocks} from "../fixtures/api_mocks/letters-mocks";

const [firstLetter, secondLetter, receivedLetter] = pendingLettersMock;

const visitLettersAs = (role: WhoamiRoleEnum) => {
  cy.mockLogin({role});
  cy.intercept("GET", "/students/letters/stats", statsMocks).as("getStats");
  cy.intercept("GET", "/students/letters?*", pendingLettersMock).as(
    "getAllLetters"
  );
  cy.visit("/profile");
  cy.wait("@getStats");
  cy.getByTestid("letters-tab").click();
  cy.wait("@getAllLetters");
};

const selectBothPendingLetters = () => {
  cy.getByTestid(`letter-checkbox-${firstLetter.id}`).find("input").check();
  cy.getByTestid("bulk-actions").should("be.visible");
  cy.contains("1 item sélectionné").should("be.visible");
  cy.getByTestid(`letter-checkbox-${secondLetter.id}`).find("input").check();
  cy.contains("2 items sélectionnés").should("be.visible");
};

const confirmDialog = () => cy.get('[role="dialog"]');

describe("Actions groupées sur les lettres (manager)", () => {
  beforeEach(() => {
    visitLettersAs(WhoamiRoleEnum.MANAGER);
  });

  it("n'affiche une case à cocher que pour les lettres en attente", () => {
    cy.getByTestid(`letter-checkbox-${firstLetter.id}`).should("exist");
    cy.getByTestid(`letter-checkbox-${receivedLetter.id}`).should("not.exist");
    cy.getByTestid("bulk-actions").should("not.exist");

    selectBothPendingLetters();
    cy.getByTestid(`letter-checkbox-${secondLetter.id}`)
      .find("input")
      .uncheck();
    cy.contains("1 item sélectionné").should("be.visible");
    cy.getByTestid(`letter-checkbox-${firstLetter.id}`).find("input").uncheck();
    cy.getByTestid("bulk-actions").should("not.exist");
  });

  it("accepte plusieurs lettres en une fois", () => {
    cy.intercept("PUT", "/letters", (req) => {
      expect(req.body).to.deep.eq([
        {id: firstLetter.id, status: "RECEIVED", reason_for_refusal: null},
        {id: secondLetter.id, status: "RECEIVED", reason_for_refusal: null},
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {...firstLetter, status: LetterStatus.RECEIVED},
          {...secondLetter, status: LetterStatus.RECEIVED},
        ],
      });
    }).as("acceptLetters");

    selectBothPendingLetters();
    cy.getByTestid("bulk-accept-button").should("be.enabled").click();
    confirmDialog()
      .should("contain.text", "Acceptation des lettres")
      .and("contain.text", "Voulez-vous vraiment accepter ces 2 lettres ?");
    cy.get(".ra-confirm").click();

    cy.wait("@acceptLetters").its("response.statusCode").should("eq", 200);
    cy.contains("2 lettres acceptées avec succès").should("be.visible");
    cy.getByTestid("bulk-actions").should("not.exist");
  });

  it("notifie une erreur quand l'acceptation échoue", () => {
    cy.intercept("PUT", "/letters", {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("acceptLettersError");

    selectBothPendingLetters();
    cy.getByTestid("bulk-accept-button").click();
    cy.get(".ra-confirm").click();

    cy.wait("@acceptLettersError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors de l'acceptation des lettres").should(
      "be.visible"
    );
    confirmDialog().should("contain.text", "Acceptation des lettres");
    cy.getByTestid("bulk-actions").should("exist");
  });

  it("ferme les confirmations sans rien envoyer", () => {
    cy.intercept("PUT", "/letters").as("updateSpy");

    selectBothPendingLetters();
    cy.getByTestid("bulk-accept-button").click();
    confirmDialog().contains("button", "Annuler").click();
    cy.contains("Acceptation des lettres").should("not.exist");

    cy.getByTestid("bulk-refuse-button").click();
    cy.contains("Refus des lettres").should("be.visible");
    confirmDialog().contains("button", "Annuler").click();
    cy.contains("Refus des lettres").should("not.exist");

    cy.get("@updateSpy.all").should("have.length", 0);
    cy.getByTestid("bulk-actions").should("be.visible");
  });

  it("exige une raison puis refuse plusieurs lettres", () => {
    const reason = "Bordereaux illisibles";
    cy.intercept("PUT", "/letters", (req) => {
      expect(req.body).to.deep.eq([
        {id: firstLetter.id, status: "REJECTED", reason_for_refusal: reason},
        {id: secondLetter.id, status: "REJECTED", reason_for_refusal: reason},
      ]);
      req.reply({
        statusCode: 200,
        body: [
          {...firstLetter, status: LetterStatus.REJECTED},
          {...secondLetter, status: LetterStatus.REJECTED},
        ],
      });
    }).as("refuseLetters");

    selectBothPendingLetters();
    cy.getByTestid("bulk-refuse-button").click();
    cy.get(".ra-confirm").click();
    cy.contains("Veuillez fournir une raison pour le refus.").should(
      "be.visible"
    );
    cy.get("@refuseLetters.all").should("have.length", 0);

    cy.getByTestid("bulk-refuse-reason-input").find("input").type(reason);
    cy.get(".ra-confirm").click();

    cy.wait("@refuseLetters").its("response.statusCode").should("eq", 200);
    cy.contains("2 lettres refusées avec succès").should("be.visible");
    cy.getByTestid("bulk-actions").should("not.exist");
  });

  it("notifie une erreur quand le refus échoue", () => {
    cy.intercept("PUT", "/letters", {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("refuseLettersError");

    selectBothPendingLetters();
    cy.getByTestid("bulk-refuse-button").click();
    cy.getByTestid("bulk-refuse-reason-input")
      .find("input")
      .type("Document non conforme");
    cy.get(".ra-confirm").click();

    cy.wait("@refuseLettersError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors du refus des lettres").should("be.visible");
  });
});
