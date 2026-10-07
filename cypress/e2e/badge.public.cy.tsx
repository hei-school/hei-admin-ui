import {getUserConnected} from "../fixtures/api_mocks/authentification-mocks";
import {
  badgeApiRoute,
  badgeOwnerRoute,
  badgePageOf,
  badgePublicId,
  badgeSituationRoute,
  enabledSituationMock,
  expiredBadgeMock,
  lateFeesSituationMock,
  otherSuspensionSituationMock,
  permanentBadgeMock,
  revokedBadgeMock,
  unknownBadgePublicId,
  validBadgeMock,
} from "../fixtures/api_mocks/badges-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const loginUrlRoute = {method: "GET", pathname: "/authentication/login-url"};

const expectNotFoundPage = () => {
  cy.contains("404");
  cy.contains("Page introuvable");
  cy.contains(validBadgeMock.ref!).should("not.exist");
};

describe("Public badge page", () => {
  it("shows the public information of a valid badge and hides its link", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock).as(
      "getPublicStudent"
    );

    cy.visit(badgePageOf(badgePublicId));
    cy.wait("@getPublicStudent");

    cy.location("pathname").should("eq", "/badges");
    cy.contains(validBadgeMock.last_name!);
    cy.contains(validBadgeMock.first_name!);
    cy.contains(validBadgeMock.ref!);
    cy.contains(validBadgeMock.level!);
    cy.contains("Actif");
    cy.contains("Écosystème Logiciel");
    cy.contains("Année universitaire 2026 - 2027");
    cy.contains("Valable jusqu'au");
    cy.get(".public-student__photo").should("have.attr", "src");
    cy.contains("Se connecter");
    cy.contains("Vous avez trouvé ce badge ?");
    cy.contains("contact@mail.hei.school").should("exist");
  });

  it("keeps the badge when the page is refreshed", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock).as(
      "getPublicStudent"
    );

    cy.visit(badgePageOf(badgePublicId));
    cy.wait("@getPublicStudent");
    cy.reload();
    cy.wait("@getPublicStudent");

    cy.contains(validBadgeMock.ref!).should("exist");
  });

  it("shows a badge without expiration from the third year of licence", () => {
    cy.intercept(badgeApiRoute(badgePublicId), permanentBadgeMock);

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("L3");
    cy.contains("Sans expiration");
    cy.get("img.public-student__photo").should("not.exist");
  });

  it("gives nothing on the student of an expired badge", () => {
    cy.intercept(badgeApiRoute(badgePublicId), expiredBadgeMock);

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Ce badge a expiré.");
    cy.get(".public-student__photo").should("not.exist");
    cy.contains("Se connecter").should("not.exist");
  });

  it("gives nothing on the student of a revoked badge", () => {
    cy.intercept(badgeApiRoute(badgePublicId), revokedBadgeMock);

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Ce badge a été révoqué.");
    cy.get(".public-student__photo").should("not.exist");
    cy.contains("Vous avez trouvé ce badge ?").should("exist");
  });

  it("shows the 404 page for an unknown badge", () => {
    cy.intercept(badgeApiRoute(unknownBadgePublicId), {statusCode: 404});

    cy.visit(badgePageOf(unknownBadgePublicId));

    expectNotFoundPage();
  });

  it("shows the 404 page right away for a guessed badge", () => {
    // api calls only: the dev server also serves the modules of src/operations/badges
    cy.intercept(
      {resourceType: /xhr|fetch/, url: "**/badges/**"},
      cy.spy().as("anyBadgeCall")
    );

    cy.visit("/badges/student1_id");

    expectNotFoundPage();
    cy.location("pathname").should("eq", "/badges");
    cy.get("@anyBadgeCall").should("not.have.been.called");
    cy.contains("Retour à l'accueil").should("have.attr", "href", "/");
  });

  it("shows the 404 page without badge", () => {
    cy.visit("/badges");

    expectNotFoundPage();
  });

  it("opens another badge in the same tab", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);
    cy.intercept(badgeApiRoute(unknownBadgePublicId), permanentBadgeMock).as(
      "getOtherBadge"
    );

    cy.visit(badgePageOf(badgePublicId));
    cy.contains("Valable jusqu'au");
    cy.window().then((win) => {
      win.history.pushState({}, "", badgePageOf(unknownBadgePublicId));
      win.dispatchEvent(new win.PopStateEvent("popstate", {state: {}}));
    });

    cy.wait("@getOtherBadge");
    cy.contains("Sans expiration");
    cy.location("pathname").should("eq", "/badges");
  });

  it("asks to retry when the badge cannot be loaded", () => {
    cy.intercept(badgeApiRoute(badgePublicId), {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Impossible de charger le badge, réessayez.").should("exist");
  });

  it("tells when the login page cannot be opened", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);
    cy.intercept(loginUrlRoute, {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));
    cy.contains("Se connecter").click();

    cy.contains("Impossible d'ouvrir la page de connexion.").should("exist");
  });

  it("comes back to the badge after the login of a teacher", () => {
    const {user, whoami} = getUserConnected("TEACHER");
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);
    cy.intercept(badgeSituationRoute(badgePublicId), enabledSituationMock).as(
      "getSituation"
    );
    cy.intercept(loginUrlRoute, {
      body: `${Cypress.config().baseUrl}auth/callback?code=TEACHER&state=HEI Admin`,
    });
    cy.intercept("POST", "**/authentication/signin**", {body: "dummy"});
    cy.intercept("GET", "**/whoami", whoami);
    cy.intercept("GET", `**/teachers/${user.id}`, user);
    cy.intercept("**/health/db", "OK");

    cy.visit(badgePageOf(badgePublicId));
    cy.contains("Se connecter").click();

    cy.routePathnameEq("/badges");
    cy.wait("@getSituation");
    cy.contains(validBadgeMock.ref!);
    cy.contains("Pointer la présence").should("exist");
  });
});

describe("Badge page of a logged in teacher", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
    cy.getByTestid("main-content").should("exist");
  });

  it("shows why the student is suspended, without amounts nor contact", () => {
    cy.intercept(badgeApiRoute(badgePublicId), {
      ...validBadgeMock,
      status: "SUSPENDED",
    });
    cy.intercept(badgeSituationRoute(badgePublicId), lateFeesSituationMock);

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Suspendu : frais en retard");
    cy.contains("Frais de scolarité octobre · échu le 15 octobre 2026");
    cy.contains("Assurance · échu le 30 septembre 2026");
    cy.contains(/\d[\d\s]*Ar\b/).should("not.exist");
    cy.contains("Contact de l'étudiant").should("not.exist");
    cy.contains("Se connecter").should("not.exist");
  });

  it("shows a suspension decided by the administration", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);
    cy.intercept(
      badgeSituationRoute(badgePublicId),
      otherSuspensionSituationMock
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Suspendu par l'administration");
  });

  it("goes to the attendance by badge", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);
    cy.intercept(badgeSituationRoute(badgePublicId), enabledSituationMock);
    cy.intercept("GET", "/events?*", []);

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Suspendu").should("not.exist");
    cy.contains("Pointer la présence").click();
    cy.routePathnameEq("/badges/attendance");
  });

  it("still shows the badge when the situation cannot be loaded", () => {
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);
    cy.intercept(badgeSituationRoute(badgePublicId), {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));

    cy.contains(validBadgeMock.ref!);
    cy.contains("Pointer la présence").should("exist");
  });

  it("does not ask the situation of a revoked badge", () => {
    cy.intercept(badgeApiRoute(badgePublicId), revokedBadgeMock);
    cy.intercept(
      badgeSituationRoute(badgePublicId),
      cy.spy().as("getSituation")
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Ce badge a été révoqué.");
    cy.get("@getSituation").should("not.have.been.called");
  });
});

describe("Badge page of a logged in manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    // the role is cached once the app is loaded
    cy.getByTestid("main-content").should("exist");
  });

  it("opens the fees of the student", () => {
    cy.intercept(badgeOwnerRoute(badgePublicId), {id: student1Mock.id}).as(
      "getBadgeOwner"
    );
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    cy.visit(badgePageOf(badgePublicId));
    cy.wait("@getBadgeOwner");

    cy.routePathnameEq(`/students/${student1Mock.id}/show`);
    cy.location("search").should("eq", "?tab=fees");
  });

  it("shows the public page when the student cannot be opened", () => {
    cy.intercept(badgeOwnerRoute(badgePublicId), {statusCode: 403});
    cy.intercept(badgeApiRoute(badgePublicId), validBadgeMock);

    cy.visit(badgePageOf(badgePublicId));

    cy.contains(validBadgeMock.ref!);
    cy.contains("Se connecter").should("not.exist");
  });

  it("shows the 404 page for an unknown badge", () => {
    cy.intercept(badgeOwnerRoute(unknownBadgePublicId), {statusCode: 404});

    cy.visit(badgePageOf(unknownBadgePublicId));

    expectNotFoundPage();
  });

  it("asks to retry when the badge cannot be opened", () => {
    cy.intercept(badgeOwnerRoute(badgePublicId), {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Impossible de charger le badge, réessayez.").should("exist");
  });
});
