import {formatDate} from "@/utils/date";
import {Letter} from "@haapi-b0fc7615/typescript-client";
import {
  absenceLettersMock,
  blockUnmockedApi,
  navigateInApp,
  pendingLetterMock,
  receivedLetterMock,
  rejectedLetterMock,
  staffAbsencesMock,
  staffJustifiedAbsence,
  staffLateAbsence,
  staffMissingAbsence,
  staffNoIdAbsence,
  staffPresentAbsence,
  staffUncheckedAbsence,
} from "../fixtures/api_mocks/coverage-absences-mocks";

const NO_PARTICIPANT_ROW_INDEX = staffAbsencesMock.length - 1;
const LETTERS_PATHNAME = /^\/users\/[^/]+\/letters$/;

const absenceDialog = () =>
  cy.contains('[role="dialog"]', "Détails de l'absence");

const closeDialogTitled = (title: string) => {
  cy.contains("h6", title)
    .parents(".MuiDialogTitle-root")
    .find("button")
    .click();
  cy.contains("h6", title).should("not.exist");
};

const confirmDialog = (title: string) =>
  cy.contains(".MuiDialog-root", title).find('[role="dialog"]');

const rowOf = (participantRef: string) =>
  cy.contains(".event-missing-list tbody tr", participantRef);

const mockLetters = (
  requestedPaths: string[],
  lettersOf: (pathname: string) => Letter[]
) => {
  cy.intercept({method: "GET", pathname: LETTERS_PATHNAME}, (req) => {
    const {pathname} = new URL(req.url);
    requestedPaths.push(pathname);
    req.reply(lettersOf(pathname));
  }).as("getLetters");
};

const lettersOfLateParticipant = (pathname: string): Letter[] =>
  pathname === `/users/${staffLateAbsence.event_participant?.id}/letters`
    ? absenceLettersMock
    : [];

const visitMissingList = () => {
  navigateInApp("/event_participants");
  cy.wait("@getMissingEvents");
  rowOf(staffLateAbsence.event_participant!.ref!).should("be.visible");
};

const openLateAbsence = () => {
  rowOf(staffLateAbsence.event_participant!.ref!).click();
  absenceDialog()
    .contains(`Réf: ${pendingLetterMock.ref}`)
    .should("be.visible");
};

describe("Détail d'une absence vu par le staff", () => {
  let requestedLetterPaths: string[];

  beforeEach(() => {
    requestedLetterPaths = [];
    blockUnmockedApi();
    cy.mockLogin({role: "MANAGER"});
    cy.intercept(
      {method: "GET", pathname: "/events/stats"},
      {
        missed_stats: {total: 7, justified: 1, unjustified: 6},
        present: 3,
        late: 1,
        total: 11,
      }
    );
    cy.intercept({method: "GET", pathname: "/event_participants"}, (req) => {
      req.reply(String(req.query.page) === "1" ? staffAbsencesMock : []);
    }).as("getMissingEvents");
    mockLetters(requestedLetterPaths, lettersOfLateParticipant);
    visitMissingList();
  });

  it("affiche l'étudiant, l'événement et ses justificatifs", () => {
    const participant = staffLateAbsence.event_participant!;
    rowOf(participant.ref!).click();

    absenceDialog().within(() => {
      cy.contains(`${participant.first_name} ${participant.last_name}`)
        .scrollIntoView()
        .should("be.visible");
      cy.contains(`Référence: ${participant.ref}`)
        .scrollIntoView()
        .should("be.visible");
      cy.contains(`Email: ${participant.email}`)
        .scrollIntoView()
        .should("be.visible");
      cy.get('img[alt="profile"]').should(
        "have.attr",
        "src",
        participant.profile_picture
      );
      cy.contains(".MuiChip-root", "En retard")
        .scrollIntoView()
        .should("be.visible");
      cy.contains(staffLateAbsence.event.course!.name!)
        .scrollIntoView()
        .should("be.visible");
      cy.contains("Code: PROG2 • 6 crédits")
        .scrollIntoView()
        .should("be.visible");
      cy.contains(
        `- Début: ${formatDate(staffLateAbsence.event.begin_datetime)}`
      )
        .scrollIntoView()
        .should("be.visible");
      cy.contains("Salle: SIGMA").scrollIntoView().should("be.visible");
      cy.contains("Place: IVANDRY").scrollIntoView().should("be.visible");
      cy.contains(".MuiChip-root", "G1").scrollIntoView().should("be.visible");
      cy.contains(".MuiChip-root", "G2").scrollIntoView().should("be.visible");
      cy.contains(`Réf: ${pendingLetterMock.ref}`)
        .scrollIntoView()
        .should("be.visible");
      cy.contains(
        `- Approuvé le: ${formatDate(receivedLetterMock.approval_datetime, false)}`
      )
        .scrollIntoView()
        .should("be.visible");
      cy.contains(rejectedLetterMock.reason_for_refusal!)
        .scrollIntoView()
        .should("be.visible");
    });
    cy.wrap(requestedLetterPaths).should((paths: string[]) => {
      expect(paths).to.include(`/users/${participant.id}/letters`);
    });

    absenceDialog().contains("button", "Voir le fichier").click();
    cy.contains("h6", `Justificatif - ${pendingLetterMock.ref}`).should(
      "be.visible"
    );
    cy.contains(`Document : ${pendingLetterMock.description}`).should(
      "be.visible"
    );
    closeDialogTitled(`Justificatif - ${pendingLetterMock.ref}`);

    absenceDialog()
      .find("button")
      .filter(':contains("Voir le fichier")')
      .last()
      .click();
    cy.contains("h6", `Justificatif - ${rejectedLetterMock.ref}`).should(
      "be.visible"
    );
    cy.contains("Document : Justificatif").should("be.visible");
    closeDialogTitled(`Justificatif - ${rejectedLetterMock.ref}`);

    closeDialogTitled("Détails de l'absence");
  });

  it("affiche chaque statut de présence et les informations optionnelles", () => {
    rowOf(staffMissingAbsence.event_participant!.ref!).click();
    absenceDialog().within(() => {
      cy.contains(".MuiChip-root", "Absent").should("be.visible");
      cy.contains("Email:").should("not.exist");
      cy.contains("Cours").should("not.exist");
      cy.contains("Lieu").should("not.exist");
      cy.contains("Groupes").should("not.exist");
      cy.contains(
        "Aucun justificatif n'a été soumis pour cette absence."
      ).should("be.visible");
    });
    closeDialogTitled("Détails de l'absence");

    rowOf(staffPresentAbsence.event_participant!.ref!).click();
    absenceDialog().within(() => {
      cy.contains(".MuiChip-root", "Présent").should("be.visible");
      cy.contains("Place: ANDRAHARO").should("be.visible");
      cy.contains("Salle:").should("not.exist");
    });
    closeDialogTitled("Détails de l'absence");

    rowOf(staffUncheckedAbsence.event_participant!.ref!).click();
    absenceDialog().within(() => {
      cy.contains(".MuiChip-root", "Non vérifié").should("be.visible");
      cy.contains("Salle: PI").should("be.visible");
      cy.contains("Place:").should("not.exist");
    });
    closeDialogTitled("Détails de l'absence");

    rowOf(staffJustifiedAbsence.event_participant!.ref!).click();
    absenceDialog().contains(".MuiChip-root", "Absent").should("be.visible");
    closeDialogTitled("Détails de l'absence");
  });

  it("ne charge pas les justificatifs d'un participant sans identifiant", () => {
    rowOf(staffNoIdAbsence.event_participant!.ref!).click();

    absenceDialog()
      .contains("Aucun justificatif n'a été soumis pour cette absence.")
      .should("be.visible");
    cy.wrap(requestedLetterPaths).should("have.length", 0);
  });

  it("n'ouvre aucun détail pour une absence sans participant", () => {
    cy.get(".event-missing-list tbody tr")
      .eq(NO_PARTICIPANT_ROW_INDEX)
      .should("contain", "Sans participant")
      .click();
    cy.contains("Détails de l'absence").should("not.exist");

    rowOf(staffMissingAbsence.event_participant!.ref!).click();
    absenceDialog().should("be.visible");
  });

  it("accepte un justificatif après avoir annulé une première fois", () => {
    cy.intercept({method: "PUT", pathname: "/letters"}, (req) => {
      req.reply([{...pendingLetterMock, status: "RECEIVED"}]);
    }).as("acceptLetter");
    openLateAbsence();

    absenceDialog().contains("button", "Accepter").click();
    confirmDialog("Acceptation du justificatif")
      .contains("button", "Annuler")
      .click();
    cy.contains("Acceptation du justificatif").should("not.exist");

    absenceDialog().contains("button", "Accepter").click();
    confirmDialog("Acceptation du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@acceptLetter")
      .its("request.body")
      .should("deep.equal", [
        {
          id: pendingLetterMock.id,
          status: "RECEIVED",
          reason_for_refusal: null,
        },
      ]);
    cy.contains("Justificatif accepté avec succès").should("be.visible");
    cy.wrap(requestedLetterPaths).should((paths: string[]) => {
      expect(paths.length).to.be.greaterThan(1);
    });
  });

  it("signale l'échec de l'acceptation", () => {
    cy.intercept(
      {method: "PUT", pathname: "/letters"},
      {statusCode: 500, body: {message: "boom"}}
    ).as("acceptLetterError");
    openLateAbsence();

    absenceDialog().contains("button", "Accepter").click();
    confirmDialog("Acceptation du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@acceptLetterError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors de l'acceptation du justificatif").should(
      "be.visible"
    );
  });

  it("exige une raison puis refuse le justificatif", () => {
    cy.intercept({method: "PUT", pathname: "/letters"}, (req) => {
      req.reply([{...pendingLetterMock, status: "REJECTED"}]);
    }).as("refuseLetter");
    openLateAbsence();

    absenceDialog().contains("button", "Refuser").click();
    confirmDialog("Refus du justificatif")
      .contains("button", "Confirmer")
      .click();
    cy.contains("Veuillez fournir une raison pour le refus.").should(
      "be.visible"
    );

    confirmDialog("Refus du justificatif")
      .find("textarea")
      .first()
      .type("Justificatif hors délai");
    confirmDialog("Refus du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@refuseLetter")
      .its("request.body")
      .should("deep.equal", [
        {
          id: pendingLetterMock.id,
          status: "REJECTED",
          reason_for_refusal: "Justificatif hors délai",
        },
      ]);
    cy.contains("Justificatif refusé avec succès").should("be.visible");
  });

  it("annule puis signale l'échec du refus", () => {
    cy.intercept(
      {method: "PUT", pathname: "/letters"},
      {statusCode: 500, body: {message: "boom"}}
    ).as("refuseLetterError");
    openLateAbsence();

    absenceDialog().contains("button", "Refuser").click();
    confirmDialog("Refus du justificatif").find("textarea").first().type("x");
    confirmDialog("Refus du justificatif")
      .contains("button", "Annuler")
      .click();
    cy.contains("Refus du justificatif").should("not.exist");

    absenceDialog().contains("button", "Refuser").click();
    confirmDialog("Refus du justificatif")
      .find("textarea")
      .first()
      .should("have.value", "")
      .type("Signature manquante");
    confirmDialog("Refus du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@refuseLetterError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors du refus du justificatif").should("be.visible");
  });
});
