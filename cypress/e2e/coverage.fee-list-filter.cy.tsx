import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {advancedStats} from "../fixtures/api_mocks/fees-stats";
import {
  mockUnhandledRequests,
  navigateInApp,
} from "../support/coverage-navigation";

type Query = Record<string, string>;

const FEES_STATISTICS = {
  total_fees: 20,
  paid_fees: 5,
  unpaid_fees: 6,
  late_fees: 7,
  pending_transaction: 3,
};

const mockFees = (requests: Query[]) => {
  cy.intercept({method: "GET", pathname: "/fees"}, (req) => {
    requests.push(req.query as Query);
    req.reply({data: [], statistics: FEES_STATISTICS});
  }).as("getFees");
};

const openByStatusFeeList = (requests: Query[]) => {
  mockUnhandledRequests();
  cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
  cy.intercept("GET", "/fees/advanced-stats?*", advancedStats).as(
    "getFeesStats"
  );
  mockFees(requests);
  navigateInApp("/fees");
  cy.wait("@getFeesStats");
  cy.wait("@getFees");
  cy.contains("Liste des frais par statut").should("be.visible");
};

const popover = () => cy.get(".MuiPopover-paper");
const fieldOf = (label: string) => popover().contains("label", label).parent();
const filterButton = () => cy.contains("button", "Filtre");
const applyButton = () => popover().contains("button", "Appliquer");

const openFilterPopover = () => {
  filterButton().click();
  return popover().should("contain.text", "Filtrer la liste");
};

describe("Coverage - filtre de la liste des frais par statut", () => {
  let requests: Query[];

  beforeEach(() => {
    requests = [];
    openByStatusFeeList(requests);
  });

  it("affiche le total des frais correspondant au statut par défaut (en retard)", () => {
    cy.contains("Total : 7").should("be.visible");
  });

  it("préremplit le filtre avec le statut, le type et la période en cours", () => {
    openFilterPopover();

    fieldOf("Statut").should("contain.text", "En retard");
    fieldOf("Type").should("contain.text", "Tous les types");
    fieldOf("Du").find("input").invoke("val").should("not.be.empty");
    fieldOf("Au").find("input").invoke("val").should("not.be.empty");
  });

  it("désactive le bouton appliquer tant que les deux dates ne sont pas renseignées", () => {
    openFilterPopover();

    fieldOf("Au").find("input").clear();
    applyButton().should("be.disabled");
  });

  it("désactive aussi le bouton appliquer quand c'est la date de début qui manque", () => {
    openFilterPopover();

    fieldOf("Du").find("input").clear();
    applyButton().should("be.disabled");
  });

  it("empêche d'appliquer une date de fin antérieure à la date de début", () => {
    openFilterPopover();

    fieldOf("Du").find("input").clear().type("2026-03-15");
    fieldOf("Au").find("input").clear().type("2026-03-01");

    cy.contains("La date de fin doit suivre la date de début.").should(
      "be.visible"
    );
    applyButton().should("be.disabled");
  });

  it("ignore un clic forcé sur appliquer tant que la période est invalide", () => {
    openFilterPopover();

    fieldOf("Du").find("input").clear().type("2026-03-15");
    fieldOf("Au").find("input").clear().type("2026-03-01");

    applyButton().click({force: true});

    popover().should("be.visible");
  });

  it("filtre la liste par statut et par période puis met à jour le total affiché", () => {
    openFilterPopover();

    fieldOf("Du").find("input").clear().type("2026-01-01");
    fieldOf("Au").find("input").clear().type("2026-01-31");
    fieldOf("Statut").find(".MuiSelect-select").click();
    cy.get('li[data-value="PAID"]').click();
    applyButton().click();

    cy.contains("Total : 5").should("be.visible");
    popover().should("not.exist");

    cy.then(() => {
      const listRequest = requests.find((query) => query.status === "PAID");
      expect(listRequest, "requête de la liste filtrée par statut").to.exist;
      expect(listRequest?.month_from).to.eq("2026-01-01T00:00:00.000Z");
      expect(listRequest?.month_to).to.eq("2026-01-31T23:59:59.999Z");
    });
  });

  it("filtre la liste par type de frais", () => {
    openFilterPopover();

    fieldOf("Type").find(".MuiSelect-select").click();
    cy.get('li[data-value="TUITION"]').click();
    applyButton().click();

    cy.wrap(null, {timeout: 10_000}).should(() => {
      expect(
        requests.some((query) => query.type === "TUITION"),
        "requête de la liste filtrée par type"
      ).to.eq(true);
    });

    openFilterPopover();
    fieldOf("Type").should("contain.text", "Écolage");
  });

  it("réaffiche les dates appliquées en rouvrant le filtre juste après", () => {
    openFilterPopover();

    fieldOf("Du").find("input").clear().type("2026-02-05");
    fieldOf("Au").find("input").clear().type("2026-02-20");
    applyButton().click();

    popover().should("not.exist");

    openFilterPopover();
    fieldOf("Du").find("input").should("have.value", "2026-02-05");
    fieldOf("Au").find("input").should("have.value", "2026-02-20");
  });

  it("affiche le total des frais en cours lorsque ce statut est sélectionné", () => {
    openFilterPopover();

    fieldOf("Statut").find(".MuiSelect-select").click();
    cy.get('li[data-value="PENDING"]').click();
    applyButton().click();

    cy.contains("Total : 3").should("be.visible");
  });

  it("masque le total quand la statistique du statut sélectionné n'est pas disponible", () => {
    cy.intercept({method: "GET", pathname: "/fees"}, (req) => {
      requests.push(req.query as Query);
      req.reply({
        data: [],
        statistics: {
          total_fees: FEES_STATISTICS.total_fees,
          paid_fees: FEES_STATISTICS.paid_fees,
          late_fees: FEES_STATISTICS.late_fees,
          pending_transaction: FEES_STATISTICS.pending_transaction,
        },
      });
    }).as("getFees");

    openFilterPopover();
    // Une nouvelle période force une vraie requête (le cache garde sinon la
    // statistique déjà chargée au montage de la page).
    fieldOf("Du").find("input").clear().type("2026-04-01");
    fieldOf("Au").find("input").clear().type("2026-04-30");
    fieldOf("Statut").find(".MuiSelect-select").click();
    cy.get('li[data-value="UNPAID"]').click();
    applyButton().click();

    popover().should("not.exist");
    cy.contains("Total :").should("not.exist");
  });
});
