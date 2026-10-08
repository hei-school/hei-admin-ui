import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import type {PublicStudent} from "../../src/operations/badges/badgeApi";
import {
  badgeApiRoute,
  badgeOwnerRoute,
  badgeSelfAttendanceRoute,
} from "../fixtures/api_mocks/badges-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {encryptedBadge} from "../support/badgeCipher";
import {
  mockUnhandledRequests,
  pushPathInApp,
} from "../support/coverage-navigation";

const PUBLIC_ID = "7c1e4a2b-9d3f-4e5a-8b6c-0d1e2f3a4b5c";
const PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

const publicBadgeUrl = badgeApiRoute(PUBLIC_ID);
const badgeOwnerUrl = badgeOwnerRoute(PUBLIC_ID);
const publicPage = `/badges/${PUBLIC_ID}`;

const minimalBadge: PublicStudent = {
  id: PUBLIC_ID,
  is_valid: true,
  ref: "STD26001",
  expiration_datetime: "2027-10-31T21:00:00Z",
};

const mockOtherRequests = mockUnhandledRequests;

const visitPublicPage = (badge: PublicStudent) => {
  cy.intercept(publicBadgeUrl, encryptedBadge(PUBLIC_ID, badge)).as(
    "getPublicStudent"
  );
  cy.visit(publicPage);
  cy.wait("@getPublicStudent");
};

const openPublicPageInApp = (badge: PublicStudent) => {
  cy.intercept(publicBadgeUrl, encryptedBadge(PUBLIC_ID, badge)).as(
    "getPublicStudent"
  );
  pushPathInApp(publicPage);
  cy.routePathnameEq("/badges");
  cy.wait("@getPublicStudent");
};

describe("Coverage - page publique du badge (visiteur)", () => {
  beforeEach(() => {
    mockOtherRequests();
  });

  it("affiche un badge sans statut, niveau, spécialité, année, photo ni frais", () => {
    visitPublicPage(minimalBadge);

    cy.get(".public-student__ref").should("have.text", minimalBadge.ref);
    cy.get(".public-student__pill").should("not.exist");
    cy.get("img.public-student__photo").should("not.exist");
    cy.get("div.public-student__photo").should("exist");
    cy.get(".public-student__academic-year").should("not.exist");
    cy.get(".public-student__validity").should(
      "contain.text",
      "Valable jusqu'au"
    );
    cy.get(".public-student__fees-ok").should(
      "have.text",
      "Aucun frais en retard"
    );
    cy.get(".public-student__fees-suspension").should("not.exist");
    cy.get(".public-student__message--warning").should("not.exist");
    cy.get(".public-student__button").should("have.text", "Se connecter");
  });

  it("affiche un frais en retard sans libellé ni échéance", () => {
    visitPublicPage({...minimalBadge, late_fees: [{}]});

    cy.get(".public-student__fees-title").should(
      "have.text",
      "Frais en retard (1)"
    );
    cy.get(".public-student__fees-list li").should("contain.text", "Frais");
    cy.get(".public-student__fees-due").should("not.exist");
  });

  it("ignore un statut inconnu et garde une spécialité inconnue telle quelle", () => {
    visitPublicPage({
      ...minimalBadge,
      status: "UNKNOWN_STATUS",
      specialization_field: "DATA_SCIENCE",
      level: "M1",
    });

    cy.get(".public-student__pill").should("have.length", 1);
    cy.get(".public-student__pill").first().should("have.text", "M1");
    cy.get(".public-student__card-body").should("contain.text", "DATA_SCIENCE");
  });

  it("affiche le statut désactivé et la spécialité transformation numérique", () => {
    visitPublicPage({
      ...minimalBadge,
      status: "DISABLED",
      specialization_field: "TN",
      profile_picture: PIXEL,
    });

    cy.get(".public-student__pill--error").should("have.text", "Désactivé");
    cy.get(".public-student__card-body").should(
      "contain.text",
      "Transformation Numérique"
    );
    cy.get("img.public-student__photo")
      .should("have.attr", "src", PIXEL)
      .and("have.attr", "alt", " ");
  });

  it("affiche un ancien étudiant en tronc commun avec son nom complet", () => {
    visitPublicPage({
      ...minimalBadge,
      first_name: "Hery",
      last_name: "Rakoto",
      status: "ALUMNI",
      specialization_field: "COMMON_CORE",
      profile_picture: PIXEL,
    });

    cy.get(".public-student__pill--default").should(
      "have.text",
      "Ancien étudiant"
    );
    cy.get(".public-student__card-body").should("contain.text", "Tronc commun");
    cy.get(".public-student__last-name").should("have.text", "Rakoto");
    cy.get("img.public-student__photo").should(
      "have.attr",
      "alt",
      "Hery Rakoto"
    );
  });

  it("dit qu'un badge invalide sans raison connue a été révoqué", () => {
    visitPublicPage({is_valid: false});

    cy.get(".public-student__message--warning").should(
      "have.text",
      "Ce badge a été révoqué."
    );
    cy.get(".public-student__ref").should("not.exist");
  });

  it("affiche les coordonnées de l'école", () => {
    visitPublicPage(minimalBadge);

    cy.get(".public-student__contact")
      .should("contain.text", "Vous avez trouvé ce badge ?")
      .and("contain.text", "Lot II 161R Ivandry, Antananarivo");
    cy.get('a[href="tel:+261349404116"]').should("exist");
    cy.get('a[href="mailto:contact@mail.hei.school"]').should("exist");
  });
});

describe("Coverage - page publique du badge (enseignant connecté)", () => {
  beforeEach(() => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
  });

  it("pointe la présence sans demander l'étudiant réel", () => {
    cy.intercept(badgeOwnerUrl, cy.spy().as("getOwner"));
    cy.intercept(badgeSelfAttendanceRoute(PUBLIC_ID), {
      result: "CHECKED",
    }).as("checkAttendance");
    openPublicPageInApp(minimalBadge);
    cy.wait("@checkAttendance");

    cy.get(".public-student__attendance").should(
      "have.text",
      "Présent(e) enregistré(e) · "
    );
    cy.get("@getOwner").should("not.have.been.called");
  });
});

describe("Coverage - page publique du badge (étudiant connecté)", () => {
  beforeEach(() => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.STUDENT});
  });

  it("n'affiche ni connexion ni présence", () => {
    cy.intercept(
      badgeSelfAttendanceRoute(PUBLIC_ID),
      cy.spy().as("checkAttendance")
    );
    openPublicPageInApp(minimalBadge);

    cy.get(".public-student__ref").should("have.text", minimalBadge.ref);
    cy.get(".public-student__button").should("not.exist");
    cy.get(".public-student__attendance").should("not.exist");
    cy.get("@checkAttendance").should("not.have.been.called");
  });
});

describe("Coverage - page publique du badge (personnel connecté)", () => {
  it("redirige un administrateur vers les frais de l'étudiant", () => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept(badgeOwnerUrl, {id: student1Mock.id}).as("getBadgeOwner");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    pushPathInApp(publicPage);
    cy.wait("@getBadgeOwner");

    cy.routePathnameEq(`/students/${student1Mock.id}/show`);
    cy.location("search").should("eq", "?tab=fees");
  });

  it("affiche la page publique quand le gestionnaire n'est pas autorisé", () => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept(badgeOwnerUrl, {statusCode: 401}).as("getBadgeOwner");

    openPublicPageInApp(minimalBadge);
    cy.wait("@getBadgeOwner");

    cy.get(".public-student__ref").should("have.text", minimalBadge.ref);
    cy.get(".public-student__button").should("not.exist");
  });

  it("affiche une erreur quand la recherche de l'étudiant échoue", () => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept(badgeOwnerUrl, {statusCode: 500}).as("getBadgeOwner");
    cy.intercept(publicBadgeUrl, cy.spy().as("getPublicStudent"));

    pushPathInApp(publicPage);
    cy.wait("@getBadgeOwner");

    cy.get(".public-student__message--error").should(
      "have.text",
      "Impossible de charger le badge, réessayez."
    );
    cy.get("@getPublicStudent").should("not.have.been.called");
  });
});
