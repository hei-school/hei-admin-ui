import {getUserConnected} from "../fixtures/api_mocks/authentification-mocks";
import {
  badgePublicId,
  expiredBadgeMock,
  revokedBadgeMock,
  unknownBadgePublicId,
  validBadgeMock,
} from "../fixtures/api_mocks/badges-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const publicBadgeUrl = (publicId: string) => `**/students/badges/${publicId}`;
const badgeStudentUrl = (publicId: string) =>
  `**/students/badges/${publicId}/student`;
// its query holds the redirect uri, whose slashes a glob does not match
const loginUrlRoute = {method: "GET", pathname: "/authentication/login-url"};

describe("Public badge page", () => {
  it("shows the public information of a valid badge to a visitor", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock).as(
      "getPublicStudent"
    );

    cy.visit(`/public/students/${badgePublicId}`);
    cy.wait("@getPublicStudent");

    cy.contains(validBadgeMock.last_name!);
    cy.contains(validBadgeMock.first_name!);
    cy.contains(validBadgeMock.ref!);
    cy.contains(validBadgeMock.level!);
    cy.contains("Actif");
    cy.contains("Écosystème Logiciel");
    cy.get(".public-student__photo").should("have.attr", "src");
    cy.contains("Se connecter");
    cy.contains("Vous avez trouvé ce badge ?");
    cy.contains("contact@mail.hei.school");
    cy.contains("Contact de l'étudiant").should("not.exist");
  });

  it("opens the badge from the short link of the QR code", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock).as(
      "getPublicStudent"
    );

    cy.visit(`/${badgePublicId}`);
    cy.wait("@getPublicStudent");

    cy.contains(validBadgeMock.ref!);
    cy.contains("Se connecter");
  });

  it("tells that a badge has expired", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), expiredBadgeMock);

    cy.visit(`/public/students/${badgePublicId}`);

    cy.contains(
      `Ce badge a expiré : il était valable pour l'année ${expiredBadgeMock.academic_year}.`
    );
    cy.get("img.public-student__photo").should("not.exist");
  });

  it("tells that a badge has been removed", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), revokedBadgeMock);

    cy.visit(`/public/students/${badgePublicId}`);

    cy.contains("Ce badge a été annulé.");
    cy.contains("Suspendu");
  });

  it("tells that an unknown badge does not exist", () => {
    cy.intercept("GET", publicBadgeUrl(unknownBadgePublicId), {
      statusCode: 404,
    });

    cy.visit(`/public/students/${unknownBadgePublicId}`);

    cy.contains("Ce badge n'existe pas.");
  });

  it("asks to retry when the badge cannot be loaded", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), {statusCode: 500});

    cy.visit(`/public/students/${badgePublicId}`);

    cy.contains("Impossible de charger le badge, réessayez.");
  });

  it("tells when the login page cannot be opened", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock);
    cy.intercept(loginUrlRoute, {statusCode: 500});

    cy.visit(`/public/students/${badgePublicId}`);
    cy.contains("Se connecter").click();

    cy.contains("Impossible d'ouvrir la page de connexion.");
  });

  it("comes back to the badge after the login of a teacher", () => {
    const {user, whoami} = getUserConnected("TEACHER");
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock);
    cy.intercept("GET", badgeStudentUrl(badgePublicId), student1Mock).as(
      "getStudentByPublicId"
    );
    cy.intercept(loginUrlRoute, {
      body: `${Cypress.config().baseUrl}auth/callback?code=TEACHER&state=HEI Admin`,
    });
    cy.intercept("POST", "**/authentication/signin**", {
      body: "dummy",
    });
    cy.intercept("GET", "**/whoami", whoami);
    cy.intercept("GET", `**/teachers/${user.id}`, user);
    cy.intercept("**/health/db", "OK");

    cy.visit(`/public/students/${badgePublicId}`);
    cy.contains("Se connecter").click();

    cy.routePathnameEq(`/public/students/${badgePublicId}`);
    cy.wait("@getStudentByPublicId");
    cy.contains("Mes événements");
    cy.contains("Contact de l'étudiant");
    cy.contains(student1Mock.phone);
    cy.contains(student1Mock.email);
  });
});

describe("Badge page of a logged in teacher", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
  });

  it("shows the contact of the student and goes to the events", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock);
    cy.intercept("GET", badgeStudentUrl(badgePublicId), student1Mock);
    cy.intercept("GET", "/events?*", []);

    cy.visit(`/public/students/${badgePublicId}`);

    cy.contains("Pour pointer la présence");
    cy.contains("Contact de l'étudiant");
    cy.get(`a[href="tel:${student1Mock.phone}"]`);
    cy.get(`a[href="mailto:${student1Mock.email}"]`);
    cy.contains("Se connecter").should("not.exist");

    cy.contains("Mes événements").click();
    cy.routePathnameEq("/events");
  });

  it("still shows the badge without the contact of the student", () => {
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock);
    cy.intercept("GET", badgeStudentUrl(badgePublicId), {statusCode: 403});

    cy.visit(`/public/students/${badgePublicId}`);

    cy.contains(validBadgeMock.ref!);
    cy.contains("Mes événements");
    cy.contains("Contact de l'étudiant").should("not.exist");
  });
});

describe("Badge page of a logged in manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
  });

  it("opens the fees of the student", () => {
    cy.intercept("GET", badgeStudentUrl(badgePublicId), student1Mock).as(
      "getStudentByPublicId"
    );
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    cy.visit(`/public/students/${badgePublicId}`);
    cy.wait("@getStudentByPublicId");

    cy.routePathnameEq(`/students/${student1Mock.id}/show`);
    cy.location("search").should("eq", "?tab=fees");
  });

  it("shows the public page when the student cannot be read", () => {
    cy.intercept("GET", badgeStudentUrl(badgePublicId), {statusCode: 403});
    cy.intercept("GET", publicBadgeUrl(badgePublicId), validBadgeMock);

    cy.visit(`/public/students/${badgePublicId}`);

    cy.contains(validBadgeMock.ref!);
    cy.contains("Se connecter").should("not.exist");
  });

  it("tells that an unknown badge does not exist", () => {
    cy.intercept("GET", badgeStudentUrl(unknownBadgePublicId), {
      statusCode: 404,
    });

    cy.visit(`/public/students/${unknownBadgePublicId}`);

    cy.contains("Ce badge n'existe pas.");
  });
});
