import {Student, WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import type {PublicStudent} from "../../src/operations/badges/badgeApi";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {
  mockUnhandledRequests,
  navigateInApp,
  pushPathInApp,
} from "../support/coverage-navigation";

const PUBLIC_ID = "7c1e4a2b-9d3f-4e5a-8b6c-0d1e2f3a4b5c";
const DAY_MS = 24 * 60 * 60 * 1000;
const PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

const publicBadgeUrl = `**/students/badges/${PUBLIC_ID}`;
const badgeStudentUrl = `**/students/badges/${PUBLIC_ID}/student`;
// lien court du QR code : servi par la route "*" de l'application
const shortLinkPage = `/${PUBLIC_ID}`;
const publicPage = `/students/badges/${PUBLIC_ID}`;

const minimalBadge: PublicStudent = {
  id: PUBLIC_ID,
  is_valid: true,
  ref: "STD26001",
};

const mockOtherRequests = mockUnhandledRequests;

const visitPublicPage = (badge: PublicStudent) => {
  cy.intercept("GET", publicBadgeUrl, badge).as("getPublicStudent");
  cy.visit(shortLinkPage);
  cy.wait("@getPublicStudent");
};

const openPublicPageInApp = (badge: PublicStudent) => {
  cy.intercept("GET", publicBadgeUrl, badge).as("getPublicStudent");
  navigateInApp(publicPage);
  cy.wait("@getPublicStudent");
};

const studentContact = (
  contact: Pick<Student, "phone" | "email">
): Student => ({
  ...student1Mock,
  phone: contact.phone,
  email: contact.email,
});

describe("Coverage - page publique du badge (visiteur)", () => {
  beforeEach(() => {
    mockOtherRequests();
  });

  it("affiche un badge sans statut, niveau, spécialité ni photo", () => {
    visitPublicPage(minimalBadge);

    cy.get(".public-student__ref").should("have.text", minimalBadge.ref);
    cy.get(".public-student__pill").should("not.exist");
    cy.get("img.public-student__photo").should("not.exist");
    cy.get("div.public-student__photo").should("exist");
    cy.get(".public-student__message--warning").should("not.exist");
    cy.get(".public-student__button").should("have.text", "Se connecter");
    cy.get(".public-student__contact--student").should("not.exist");
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

  it("parle de l'année précédente quand un badge expiré n'a pas d'année", () => {
    visitPublicPage({
      ...minimalBadge,
      is_valid: false,
      expiration_datetime: new Date(Date.now() - DAY_MS).toISOString(),
    });

    cy.get(".public-student__message--warning").should(
      "have.text",
      "Ce badge a expiré : il était valable pour l'année précédente."
    );
  });

  it("indique qu'un badge invalide qui n'a pas encore expiré a été annulé", () => {
    visitPublicPage({
      ...minimalBadge,
      is_valid: false,
      expiration_datetime: new Date(Date.now() + DAY_MS).toISOString(),
    });

    cy.get(".public-student__message--warning").should(
      "have.text",
      "Ce badge a été annulé."
    );
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

  it("affiche seulement le téléphone de l'étudiant quand il n'a pas d'email", () => {
    const phone = "034 11 222 33";
    cy.intercept(
      "GET",
      badgeStudentUrl,
      studentContact({phone, email: undefined})
    ).as("getContact");
    openPublicPageInApp(minimalBadge);
    cy.wait("@getContact");

    cy.get(".public-student__contact--student")
      .should("contain.text", "Contact de l'étudiant")
      .and("contain.text", phone);
    cy.get('a[href="tel:0341122233"]').should("exist");
    cy.get('.public-student__contact--student a[href^="mailto:"]').should(
      "not.exist"
    );
  });

  it("affiche seulement l'email de l'étudiant quand il n'a pas de téléphone", () => {
    const email = "etudiant@hei.school";
    cy.intercept(
      "GET",
      badgeStudentUrl,
      studentContact({phone: undefined, email})
    ).as("getContact");
    openPublicPageInApp(minimalBadge);
    cy.wait("@getContact");

    cy.get(`.public-student__contact--student a[href="mailto:${email}"]`)
      .should("exist")
      .and("contain.text", email);
    cy.get('.public-student__contact--student a[href^="tel:"]').should(
      "not.exist"
    );
  });

  it("n'affiche pas de bloc contact quand l'étudiant n'a ni téléphone ni email", () => {
    cy.intercept(
      "GET",
      badgeStudentUrl,
      studentContact({phone: undefined, email: undefined})
    ).as("getContact");
    openPublicPageInApp(minimalBadge);
    cy.wait("@getContact");

    cy.get(".public-student__message--info").should(
      "contain.text",
      "Pour pointer la présence"
    );
    cy.get(".public-student__contact--student").should("not.exist");
  });
});

describe("Coverage - page publique du badge (étudiant connecté)", () => {
  beforeEach(() => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.STUDENT});
  });

  it("n'affiche ni connexion ni actions d'enseignant", () => {
    cy.intercept("GET", badgeStudentUrl, cy.spy().as("getContact"));
    openPublicPageInApp(minimalBadge);

    cy.get(".public-student__ref").should("have.text", minimalBadge.ref);
    cy.get(".public-student__button").should("not.exist");
    cy.get(".public-student__message--info").should("not.exist");
    cy.get("@getContact").should("not.have.been.called");
  });
});

describe("Coverage - page publique du badge (personnel connecté)", () => {
  it("redirige un administrateur vers les frais de l'étudiant", () => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept("GET", badgeStudentUrl, student1Mock).as(
      "getStudentByPublicId"
    );
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    pushPathInApp(publicPage);
    cy.wait("@getStudentByPublicId");

    cy.routePathnameEq(`/students/${student1Mock.id}/show`);
    cy.location("search").should("eq", "?tab=fees");
  });

  it("affiche la page publique quand le gestionnaire n'est pas autorisé", () => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", badgeStudentUrl, {statusCode: 401}).as(
      "getStudentByPublicId"
    );
    cy.intercept("GET", publicBadgeUrl, minimalBadge).as("getPublicStudent");

    navigateInApp(publicPage);
    cy.wait("@getStudentByPublicId");
    cy.wait("@getPublicStudent");

    cy.get(".public-student__ref").should("have.text", minimalBadge.ref);
    cy.get(".public-student__button").should("not.exist");
  });

  it("affiche une erreur quand la recherche de l'étudiant échoue", () => {
    mockOtherRequests();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", badgeStudentUrl, {statusCode: 500}).as(
      "getStudentByPublicId"
    );
    cy.intercept("GET", publicBadgeUrl, cy.spy().as("getPublicStudent"));

    navigateInApp(publicPage);
    cy.wait("@getStudentByPublicId");

    cy.get(".public-student__message--error").should(
      "have.text",
      "Impossible de charger le badge, réessayez."
    );
    cy.get("@getPublicStudent").should("not.have.been.called");
  });
});
