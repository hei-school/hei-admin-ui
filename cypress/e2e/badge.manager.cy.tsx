import {
  badgeLinkOf,
  badgePublicId,
  unknownBadgePublicId,
  validBadgeMock,
} from "../fixtures/api_mocks/badges-mocks";
import {
  group1Mock,
  group1Students,
  groupsMock,
} from "../fixtures/api_mocks/groups-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";
import {FakeCamera, installFakeCamera} from "../support/fakeCamera";

const PDF = "%PDF-1.4 badge";

const scanLink = (link: string) => {
  cy.contains("label", "Ou lien du badge")
    .parent()
    .find("input")
    .clear()
    .type(link);
  cy.contains("button", "Valider").click();
};

describe("Manager scans a badge with the camera", () => {
  let camera: FakeCamera;

  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.window().then((win) => {
      camera = installFakeCamera(win);
    });
    cy.getByTestid("students-menu").click();
    cy.getByTestid("badge-scan").click();
    cy.contains("Caméra active");
  });

  it("opens the fees of the student of the filmed badge", () => {
    cy.intercept(
      "GET",
      `**/students/badges/${badgePublicId}/student`,
      student1Mock
    ).as("getStudentByPublicId");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    camera.show("badge-qr.png");

    cy.wait("@getStudentByPublicId");
    cy.location("pathname").should("eq", `/students/${student1Mock.id}/show`);
  });

  it("tells that a filmed QR code is not a badge", () => {
    camera.show("not-badge-qr.png");

    cy.contains(
      "QR code lu, mais ce n'est pas un badge HEI : « https://www.hei.school »"
    ).should("exist");
  });

  it("switches to another camera", () => {
    cy.contains("label", "Caméra").parent().click();
    cy.get("[role='option']").contains("Back").click();

    cy.contains("Caméra active");
    cy.contains("Le décodeur de QR code ne fonctionne pas").should("not.exist");
  });

  it("restarts a camera that stopped", () => {
    cy.wrap(null).then(() => camera.stopTrack());
    cy.contains("La caméra s'est arrêtée");

    cy.contains("button", "Relancer la caméra").click();

    cy.contains("Caméra active").should("exist");
  });

  it("tells when the camera cannot be restarted", () => {
    cy.wrap(null).then(() => camera.unplug());

    cy.contains("button", "Relancer la caméra").click();

    cy.contains("Impossible de relancer la caméra").should("exist");
  });
});

describe("Admin scans a badge", () => {
  it("opens the scanner from the students menu", () => {
    cy.mockLogin({role: "ADMIN"});
    cy.getByTestid("students-menu").click();
    cy.getByTestid("badge-scan").click();

    cy.routePathnameEq("/badges/scan");
    cy.contains("Scanner un badge").should("exist");
  });
});

describe("Manager scans a badge", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.getByTestid("badge-scan").click();
    cy.routePathnameEq("/badges/scan");
    cy.contains("Scanner un badge");
  });

  it("opens the fees of the scanned student", () => {
    cy.intercept(
      "GET",
      `**/students/badges/${badgePublicId}/student`,
      student1Mock
    ).as("getStudentByPublicId");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    scanLink(badgeLinkOf(badgePublicId));
    cy.wait("@getStudentByPublicId");

    cy.routePathnameEq(`/students/${student1Mock.id}/show`);
    cy.location("search").should("eq", "?tab=fees");
  });

  it("refuses a link that is not a badge", () => {
    scanLink("https://www.hei.school");

    cy.contains("Lien de badge invalide.").should("exist");
  });

  it("tells that an unknown badge does not exist", () => {
    cy.intercept("GET", `**/students/badges/${unknownBadgePublicId}/student`, {
      statusCode: 404,
    });

    scanLink(badgeLinkOf(unknownBadgePublicId));

    cy.contains("Ce badge n'existe pas.").should("exist");
    cy.routePathnameEq("/badges/scan");
  });

  it("asks to rescan when the badge cannot be read", () => {
    cy.intercept("GET", `**/students/badges/${badgePublicId}/student`, {
      statusCode: 500,
    });

    scanLink(badgePublicId);

    cy.contains("Impossible de lire le badge, réessayez.").should("exist");
  });
});

describe("Manager handles the badge of a student", () => {
  beforeEach(() => {
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept("GET", `/students/${student1Mock.id}/level`, "L1");
    cy.mockLogin({role: "MANAGER"});
  });

  const openBadgeMenu = () => {
    cy.visit(`/students/${student1Mock.id}/show`);
    cy.wait("@getActiveBadge");
    cy.getByTestid("badge-button").click();
  };

  it("prints the badge of a student without active badge", () => {
    let printed = false;
    cy.intercept("GET", `**/students/${student1Mock.id}/badge`, (request) =>
      request.reply(
        printed ? {body: validBadgeMock} : {statusCode: 404, body: {}}
      )
    ).as("getActiveBadge");
    cy.intercept(
      "GET",
      `**/students/badges/raw?student_ids=${student1Mock.id}`,
      (request) => {
        printed = true;
        request.reply({
          body: PDF,
          headers: {"content-type": "application/pdf"},
        });
      }
    ).as("printBadge");

    openBadgeMenu();
    cy.contains("Aucun badge actif");
    cy.getByTestid("badge-remove").should("have.class", "Mui-disabled");
    cy.getByTestid("badge-print").click();

    cy.wait("@printBadge");
    cy.contains("Génération du badge en cours...");
    cy.wait("@getActiveBadge");
    cy.getByTestid("badge-button").click();
    cy.contains(`Badge actif · ${validBadgeMock.academic_year}`);
    cy.getByTestid("badge-print").should("have.class", "Mui-disabled");
    cy.contains("Retirez le badge actuel pour en imprimer un nouveau.");
  });

  it("tells when the badge cannot be printed", () => {
    cy.intercept("GET", `**/students/${student1Mock.id}/badge`, {
      statusCode: 404,
      body: {},
    }).as("getActiveBadge");
    cy.intercept(
      "GET",
      `**/students/badges/raw?student_ids=${student1Mock.id}`,
      {
        statusCode: 400,
      }
    );

    openBadgeMenu();
    cy.getByTestid("badge-print").click();

    cy.contains("Erreur lors de la génération du badge.").should("exist");
  });

  it("removes the active badge of a student", () => {
    cy.intercept(
      "GET",
      `**/students/${student1Mock.id}/badge`,
      validBadgeMock
    ).as("getActiveBadge");
    cy.intercept("PUT", `**/students/${student1Mock.id}/badge/revocation`, {
      ...validBadgeMock,
      is_valid: false,
    }).as("removeBadge");

    openBadgeMenu();
    cy.getByTestid("badge-remove").click();
    cy.contains("Le QR code du badge actuel ne fonctionnera plus");
    cy.contains("button", "Retirer").click();

    cy.wait("@removeBadge");
    cy.contains("Badge retiré : son QR code ne fonctionne plus.");
    cy.getByTestid("badge-button").click();
    cy.contains("Aucun badge actif").should("exist");
  });

  it("tells when the badge cannot be removed", () => {
    cy.intercept(
      "GET",
      `**/students/${student1Mock.id}/badge`,
      validBadgeMock
    ).as("getActiveBadge");
    cy.intercept("PUT", `**/students/${student1Mock.id}/badge/revocation`, {
      statusCode: 500,
    });

    openBadgeMenu();
    cy.getByTestid("badge-remove").click();
    cy.contains("button", "Retirer").click();

    cy.contains("Erreur lors du retrait du badge.").should("exist");
  });
});

describe("Manager prints the badges of a group", () => {
  beforeEach(() => {
    cy.intercept("GET", "/groups?*", groupsMock);
    cy.intercept("GET", `/groups/${group1Mock.id}`, group1Mock);
    cy.intercept("GET", `/groups/${group1Mock.id}/students?*`, group1Students);
    cy.intercept("GET", `/students?*`, studentsMock);
    cy.mockLogin({role: "MANAGER"});
    cy.visit(`/groups/${group1Mock.id}/show`);
  });

  it("downloads the badges of the group", () => {
    cy.intercept("GET", `**/students/badges/raw?group_id=${group1Mock.id}`, {
      body: PDF,
      headers: {"content-type": "application/pdf"},
    }).as("printGroupBadges");

    cy.getByTestid("group-badges-download").click();

    cy.wait("@printGroupBadges");
    cy.contains("Génération des badges en cours...").should("exist");
  });

  it("tells when no badge is printed", () => {
    cy.intercept("GET", `**/students/badges/raw?group_id=${group1Mock.id}`, {
      statusCode: 400,
    });

    cy.getByTestid("group-badges-download").click();

    cy.contains("Aucun badge généré").should("exist");
  });
});
