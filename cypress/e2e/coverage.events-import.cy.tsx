import {UpdateEventParticipant} from "@haapi-b0fc7615/typescript-client";
import * as XLSX from "xlsx";
import {
  blockUnmockedApi,
  importEventId,
  importParticipantsMock,
  navigateInApp,
} from "../fixtures/api_mocks/coverage-absences-mocks";
import {event1mock, eventsMock} from "../fixtures/api_mocks/event-mocks";
import {groupsMock} from "../fixtures/api_mocks/groups-mocks";

type Query = Record<string, string | number>;
type FileContents = ReturnType<typeof Cypress.Buffer.from>;

const CSV_MIME = "text/csv";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const PARTICIPANTS_PATHNAME = `/events/${importEventId}/participants`;
const [participant1, participant2, participant3, participant4] =
  importParticipantsMock;

const padTo = (content: string, size: number) =>
  content.concat("\n".repeat(size - content.length));

const importDialog = () =>
  cy.contains('[role="dialog"]', "Importer des présences");

const importButton = () => importDialog().contains("button", "Importer");

const dropFile = (
  contents: FileContents,
  fileName: string,
  mimeType: string
) => {
  importDialog()
    .find(".RaFileInput-dropZone")
    .selectFile(
      {contents, fileName, mimeType, lastModified: Date.now()},
      {action: "drag-drop"}
    );
};

const dropCsv = (content: string, fileName = "presences.csv") =>
  dropFile(Cypress.Buffer.from(content), fileName, CSV_MIME);

const xlsxOf = (rows: string[][]): FileContents => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(rows),
    "Presences"
  );
  const content: ArrayBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  return Cypress.Buffer.from(new Uint8Array(content));
};

const openImportDialog = () => {
  cy.getByTestid("menu-list-action").click();
  cy.contains("Importer").click();
  importDialog().should("be.visible");
};

const importAndExpect = (message: string) => {
  importButton().should("be.enabled").click();
  cy.contains(message).should("be.visible");
};

describe("Import des présences d'un événement", () => {
  beforeEach(() => {
    blockUnmockedApi();
    cy.mockLogin({role: "MANAGER"});
    cy.intercept(
      {method: "GET", pathname: `/events/${importEventId}`},
      event1mock
    );
    cy.intercept({method: "GET", pathname: PARTICIPANTS_PATHNAME}, (req) => {
      req.reply(String(req.query.page) === "1" ? importParticipantsMock : []);
    }).as("getParticipants");
    navigateInApp(`/events/${importEventId}/participants`);
    cy.wait("@getParticipants");
    cy.contains(participant1.ref!).should("be.visible");
  });

  it("ouvre le dialogue puis le ferme sans fichier", () => {
    openImportDialog();

    importButton().should("be.disabled");
    cy.contains("Sélectionner un fichier (CSV ou Excel)").should("be.visible");
    importDialog().contains("button", "Annuler").click();

    cy.contains("Importer des présences").should("not.exist");
  });

  it("met à jour les statuts d'un CSV identifié par email", () => {
    cy.intercept({method: "PUT", pathname: PARTICIPANTS_PATHNAME}, (req) => {
      req.reply(req.body);
    }).as("updateStatuses");
    openImportDialog();

    dropCsv(
      padTo(
        `participant.email,status\n${participant1.email},present\n${participant2.email!.toUpperCase()},MISSING\n`,
        3 * 1024
      )
    );
    importDialog().should("contain", "presences.csv").and("contain", "3 Ko");
    importButton().click();

    cy.wait("@updateStatuses")
      .its("request.body")
      .should("deep.equal", [
        {id: participant1.id, event_status: "PRESENT"},
        {id: participant2.id, event_status: "MISSING"},
      ] satisfies UpdateEventParticipant[]);
    cy.contains("Mise à jour des statuts réussie.").should("be.visible");
    cy.contains("Importer des présences").should("not.exist");
  });

  it("retrouve les participants par prénom et nom", () => {
    cy.intercept({method: "PUT", pathname: PARTICIPANTS_PATHNAME}, (req) => {
      req.reply(req.body);
    }).as("updateStatuses");
    openImportDialog();

    dropCsv(
      [
        "participant.email,participant.firstName,participant.lastName,status",
        `inconnu@hei.school,${participant3.first_name},${participant3.last_name},late`,
        `,${participant4.first_name!.toUpperCase()},${participant4.last_name},EXCUSED`,
      ].join("\n"),
      "par-nom.csv"
    );
    importDialog().should("contain", "par-nom.csv").and("contain", "0 Ko");
    importButton().click();

    cy.wait("@updateStatuses")
      .its("request.body")
      .should("deep.equal", [
        {id: participant3.id, event_status: "LATE"},
        {id: participant4.id, event_status: "EXCUSED"},
      ]);
    cy.contains("Mise à jour des statuts réussie.").should("be.visible");
  });

  it("met à jour les statuts depuis un fichier Excel", () => {
    cy.intercept({method: "PUT", pathname: PARTICIPANTS_PATHNAME}, (req) => {
      req.reply(req.body);
    }).as("updateStatuses");
    openImportDialog();

    dropFile(
      xlsxOf([
        ["participant.email", "status"],
        [participant1.email!, "LATE"],
        [participant2.email!, "present"],
      ]),
      "presences.xlsx",
      XLSX_MIME
    );
    importDialog().should("contain", "presences.xlsx").and("contain", "Ko");
    importButton().click();

    cy.wait("@updateStatuses")
      .its("request.body")
      .should("deep.equal", [
        {id: participant1.id, event_status: "LATE"},
        {id: participant2.id, event_status: "PRESENT"},
      ]);
    cy.contains("Mise à jour des statuts réussie.").should("be.visible");
  });

  it("signale l'échec de la mise à jour des statuts", () => {
    cy.intercept(
      {method: "PUT", pathname: PARTICIPANTS_PATHNAME},
      {statusCode: 500, body: {message: "boom"}}
    ).as("updateStatusesError");
    openImportDialog();

    dropCsv(`email,status\n${participant1.email},PRESENT\n`);
    importButton().click();

    cy.wait("@updateStatusesError")
      .its("response.statusCode")
      .should("eq", 500);
    cy.contains("Erreur lors de la mise à jour des statuts.").should(
      "be.visible"
    );
    importDialog().should("be.visible");
  });

  it("refuse les fichiers dont le contenu est invalide", () => {
    cy.intercept({method: "PUT", pathname: PARTICIPANTS_PATHNAME}, []).as(
      "updateStatuses"
    );
    openImportDialog();

    dropCsv("status,email\n", "vide.csv");
    importAndExpect("Le fichier est vide.");

    dropCsv(`email,etat\n${participant1.email},PRESENT\n`, "sans-statut.csv");
    importAndExpect("Les colonnes suivantes sont obligatoires : status");

    dropCsv(`email,status\n${participant1.email},ABSENT\n`, "statut.csv");
    importAndExpect(
      `Le statut "ABSENT" à la ligne 1 n'est pas valide. Les statuts valides sont : PRESENT, MISSING, LATE, EXCUSED`
    );

    dropCsv("status,firstname\nPRESENT,Prenom1\n", "sans-identite.csv");
    importAndExpect(
      "Aucune information d'identification (email, ou firstName/lastName) trouvée à la ligne 1"
    );

    cy.get("@updateStatuses.all").should("have.length", 0);
  });

  it("signale un participant introuvable", () => {
    openImportDialog();

    dropCsv("email,status\ninconnu@hei.school,PRESENT\n", "inconnu.csv");
    importAndExpect("Erreur lors de l'importation du fichier.");
    importDialog().should("be.visible");
  });

  it("signale un fichier vide illisible", () => {
    openImportDialog();

    dropCsv("", "zero.csv");
    importDialog().should("contain", "zero.csv").and("contain", "0 Ko");
    importAndExpect("Erreur lors de l'importation du fichier.");
  });

  it("affiche la taille en Mo puis retire un fichier refusé", () => {
    openImportDialog();

    dropCsv(
      padTo(`email,status\n${participant1.email},PRESENT\n`, 1.5 * 1024 * 1024),
      "gros.csv"
    );
    importDialog().should("contain", "gros.csv").and("contain", "1.50 Mo");
    importButton().should("be.enabled");

    dropFile(Cypress.Buffer.from("notes"), "notes.txt", "text/plain");

    importDialog().should("not.contain", "gros.csv");
    importDialog().should("not.contain", "notes.txt");
    cy.contains('[role="dialog"]', "Importer des présences")
      .contains("button", "Importer")
      .should("be.disabled");
  });
});

describe("Filtre multi-groupes des événements", () => {
  let eventRequests: Query[];

  const groupSelect = () =>
    cy
      .contains("label", "Groupe ref ex: J1")
      .parent()
      .find(".MuiSelect-select");

  const openFilterDialog = () => {
    cy.getByTestid("menu-list-action").click();
    cy.contains("Filtres").click();
    groupSelect().should("be.visible");
  };

  const openGroupFilter = () => {
    cy.contains('[role="tab"]', "Listes").click();
    cy.getByTestid("event-list-content").should("be.visible");
    openFilterDialog();
  };

  beforeEach(() => {
    eventRequests = [];
    blockUnmockedApi();
    cy.mockLogin({role: "MANAGER"});
    cy.intercept({method: "GET", pathname: "/events"}, (req) => {
      eventRequests.push(req.query);
      req.reply(String(req.query.page) === "1" ? eventsMock : []);
    }).as("getEvents");
    cy.intercept({method: "GET", pathname: "/groups"}, (req) => {
      req.reply(String(req.query.page) === "1" ? groupsMock : []);
    }).as("getGroups");
  });

  it("coche et décoche des groupes puis applique le filtre", () => {
    navigateInApp("/events");
    openGroupFilter();

    groupSelect().click();
    cy.get('[role="listbox"]').should("be.visible").type("{esc}");
    cy.get('[role="listbox"]').should("not.exist");
    cy.contains("Ajouter des filtres").should("not.exist");

    openFilterDialog();
    groupSelect().should("not.contain", "group_ref");
    groupSelect().click();
    cy.getByTestid("option-group_ref1")
      .find(".MuiSvgIcon-fontSizeMedium")
      .should("exist");
    cy.getByTestid("option-group_ref1").click();
    cy.get('[role="listbox"]').should("not.exist");
    groupSelect().should("have.text", "group_ref1");

    groupSelect().click();
    cy.getByTestid("option-group_ref2").click();
    groupSelect().should("have.text", "group_ref1, group_ref2");

    groupSelect().click();
    cy.getByTestid("option-group_ref1").find("input").should("be.checked");
    cy.getByTestid("option-group_ref3").find("input").should("not.be.checked");
    cy.getByTestid("option-group_ref1").click();
    groupSelect().should("have.text", "group_ref2");

    cy.getByTestid("apply-filter").click();
    cy.wrap(eventRequests).should((requests: Query[]) => {
      const filtered = requests.find((query) => "group_ref" in query);
      expect(String(filtered?.group_ref)).to.eq("group_ref2");
    });
  });

  it("adapte l'affichage des options sur petit écran", () => {
    navigateInApp("/events");
    openGroupFilter();
    cy.viewport(800, 1000);

    groupSelect().click();
    cy.getByTestid("option-group_ref1")
      .find(".MuiSvgIcon-fontSizeSmall")
      .should("exist");
    cy.getByTestid("option-group_ref1")
      .find(".MuiListItemText-primary")
      .should("have.css", "font-size", "12px");
  });
});
