import {getUserConnected} from "../fixtures/api_mocks/authentification-mocks";
import {
  badgeApiRoute,
  badgeOwnerRoute,
  badgePageOf,
  badgePublicId,
  badgeSelfAttendanceRoute,
  checkedAttendanceMock,
  expiredBadgeMock,
  graduateBadgeMock,
  lateFeesBadgeMock,
  otherSuspensionBadgeMock,
  revokedBadgeMock,
  unknownBadgePublicId,
  validBadgeMock,
} from "../fixtures/api_mocks/badges-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {encryptedBadge} from "../support/badgeCipher";

// its query holds the redirect uri, whose slashes a glob does not match
const loginUrlRoute = {method: "GET", pathname: "/authentication/login-url"};

const expectNotFoundPage = () => {
  cy.contains("404");
  cy.contains("Page introuvable");
  cy.contains(validBadgeMock.ref!).should("not.exist");
};

describe("Public badge page", () => {
  it("shows the badge, its fees, and hides its link", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    ).as("getPublicStudent");

    cy.visit(badgePageOf(badgePublicId));
    cy.wait("@getPublicStudent")
      .its("response.body")
      .should((body) => {
        expect(JSON.stringify(body)).not.to.contain(validBadgeMock.ref);
        expect(JSON.stringify(body)).not.to.contain(validBadgeMock.last_name);
      });

    cy.location("pathname").should("eq", "/badges");
    cy.contains(validBadgeMock.last_name!);
    cy.contains(validBadgeMock.first_name!);
    cy.contains(validBadgeMock.ref!);
    cy.contains(validBadgeMock.level!);
    cy.contains("Actif");
    cy.contains("Écosystème Logiciel");
    cy.contains("Année universitaire 2026 - 2027");
    cy.contains("Valable jusqu'au");
    cy.contains("Aucun frais en retard");
    cy.get(".public-student__photo").should("have.attr", "src");
    cy.contains("Se connecter");
    cy.contains("Vous avez trouvé ce badge ?");
    cy.contains("contact@mail.hei.school").should("exist");
  });

  it("shows the late fees of a suspended student, without amounts", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, lateFeesBadgeMock)
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Frais en retard (2)");
    cy.contains("Frais de scolarité octobre");
    cy.contains("Échu le 15 octobre 2026");
    cy.contains("Assurance");
    cy.contains("Échu le 30 septembre 2026");
    cy.get(".public-student__fees-late").should("have.length", 2);
    cy.contains("Suspendu pour frais en retard : passage au bureau requis.");
    cy.contains(/\d[\d\s]*Ar\b/).should("not.exist");
  });

  it("shows a suspension decided by the administration", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, otherSuspensionBadgeMock)
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Suspendu par l'administration.");
  });

  it("keeps the badge when the page is refreshed", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    ).as("getPublicStudent");

    cy.visit(badgePageOf(badgePublicId));
    cy.wait("@getPublicStudent");
    cy.reload();
    cy.wait("@getPublicStudent");

    cy.contains(validBadgeMock.ref!).should("exist");
  });

  it("shows a student who went out after its Licence as graduated", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, graduateBadgeMock)
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Licencié(e)");
    cy.contains("Valable jusqu'au").should("not.exist");
    cy.contains("Année universitaire").should("not.exist");
    cy.get("img.public-student__photo").should("not.exist");
  });

  it("gives nothing on the student of an expired badge", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, expiredBadgeMock)
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Ce badge a expiré.");
    cy.get(".public-student__photo").should("not.exist");
    cy.get(".public-student__fees").should("not.exist");
    cy.contains("Se connecter").should("not.exist");
  });

  it("gives nothing on the student of a revoked badge", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, revokedBadgeMock)
    );

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

  // In dev, React runs the effects twice: the page asks for the badge twice.
  const LOADS_IN_DEV = 2;

  it("tries once more when the API is waking up, without refreshing", () => {
    const answerBadge = encryptedBadge(badgePublicId, validBadgeMock);
    let calls = 0;
    cy.intercept(badgeApiRoute(badgePublicId), (request) => {
      calls++;
      // the first call of every load fails: only the second try answers
      return calls <= LOADS_IN_DEV
        ? request.reply({statusCode: 503, body: {}})
        : answerBadge(request);
    });

    cy.visit(badgePageOf(badgePublicId));

    cy.contains(validBadgeMock.ref!);
    cy.contains("Impossible de charger le badge").should("not.exist");
  });

  it("does not try again an answer of the API", () => {
    let calls = 0;
    cy.intercept(badgeApiRoute(unknownBadgePublicId), (request) => {
      calls++;
      request.reply({statusCode: 404, body: {}});
    });

    cy.visit(badgePageOf(unknownBadgePublicId));

    // the 404 page is shown once every call is done: no second try
    expectNotFoundPage();
    cy.wrap(null).should(() => expect(calls).to.be.within(1, LOADS_IN_DEV));
  });

  it("opens another badge in the same tab", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    );
    cy.intercept(
      badgeApiRoute(unknownBadgePublicId),
      encryptedBadge(unknownBadgePublicId, graduateBadgeMock)
    ).as("getOtherBadge");

    cy.visit(badgePageOf(badgePublicId));
    cy.contains("Valable jusqu'au");
    cy.window().then((win) => {
      win.history.pushState({}, "", badgePageOf(unknownBadgePublicId));
      win.dispatchEvent(new win.PopStateEvent("popstate", {state: {}}));
    });

    cy.wait("@getOtherBadge");
    cy.contains("Licencié(e)");
    cy.location("pathname").should("eq", "/badges");
  });

  it("asks to retry when the badge cannot be loaded", () => {
    cy.intercept(badgeApiRoute(badgePublicId), {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Impossible de charger le badge, réessayez.").should("exist");
  });

  it("asks to retry when the badge cannot be decrypted", () => {
    cy.intercept(badgeApiRoute(badgePublicId), {
      payload: "bm90LWVuY3J5cHRlZA==",
    });

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Impossible de charger le badge, réessayez.").should("exist");
  });

  it("tells when the login page cannot be opened", () => {
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    );
    cy.intercept(loginUrlRoute, {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));
    cy.contains("Se connecter").click();

    cy.contains("Impossible d'ouvrir la page de connexion.").should("exist");
  });

  it("comes back to the badge after the login of a teacher, who marks it present", () => {
    const {user, whoami} = getUserConnected("TEACHER");
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    );
    cy.intercept(
      badgeSelfAttendanceRoute(badgePublicId),
      checkedAttendanceMock
    ).as("checkAttendance");
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
    cy.wait("@checkAttendance");
    cy.contains(validBadgeMock.ref!);
    cy.contains("Présent(e) enregistré(e) · PROG1 - Prog 3").should("exist");
  });
});

describe("Badge page of a logged in teacher", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
    // the role is cached once the app is loaded
    cy.getByTestid("main-content").should("exist");
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    );
  });

  it("marks the student present to the course in progress, without button", () => {
    cy.intercept(
      badgeSelfAttendanceRoute(badgePublicId),
      checkedAttendanceMock
    ).as("checkAttendance");

    cy.visit(badgePageOf(badgePublicId));

    cy.wait("@checkAttendance");
    cy.contains("Présent(e) enregistré(e) · PROG1 - Prog 3");
    cy.contains("Pointer la présence").should("not.exist");
    cy.contains("Se connecter").should("not.exist");
  });

  it("tells when the teacher has no course now", () => {
    cy.intercept(badgeSelfAttendanceRoute(badgePublicId), {
      result: "NO_COURSE_IN_PROGRESS",
    });

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("Vous n'avez pas de cours en ce moment.");
  });

  it("tells when the student does not take part in the course", () => {
    cy.intercept(badgeSelfAttendanceRoute(badgePublicId), {
      result: "NOT_PARTICIPANT",
      course_code: "PROG1",
    });

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("N'est pas inscrit(e) à votre cours PROG1");
  });

  it("tells when the attendance cannot be saved, still showing the badge", () => {
    cy.intercept(badgeSelfAttendanceRoute(badgePublicId), {statusCode: 500});

    cy.visit(badgePageOf(badgePublicId));

    cy.contains("La présence n'a pas pu être enregistrée, rouvrez le badge.");
    cy.contains(validBadgeMock.ref!).should("exist");
  });

  it("marks nothing for a revoked badge", () => {
    cy.intercept(
      badgeApiRoute(unknownBadgePublicId),
      encryptedBadge(unknownBadgePublicId, revokedBadgeMock)
    );
    cy.intercept(
      badgeSelfAttendanceRoute(unknownBadgePublicId),
      cy.spy().as("checkAttendance")
    );

    cy.visit(badgePageOf(unknownBadgePublicId));

    cy.contains("Ce badge a été révoqué.");
    cy.get("@checkAttendance").should("not.have.been.called");
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
    cy.intercept(
      badgeApiRoute(badgePublicId),
      encryptedBadge(badgePublicId, validBadgeMock)
    );
    cy.intercept(
      badgeSelfAttendanceRoute(badgePublicId),
      cy.spy().as("checkAttendance")
    );

    cy.visit(badgePageOf(badgePublicId));

    cy.contains(validBadgeMock.ref!);
    cy.contains("Se connecter").should("not.exist");
    cy.get("@checkAttendance").should("not.have.been.called");
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
