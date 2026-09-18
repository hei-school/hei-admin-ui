import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  emptyGlobalSearchResultsMock,
  globalSearchResultsMock,
} from "../fixtures/api_mocks/global-search-mocks";

const {students, teachers, organizer, monitor, staff} = globalSearchResultsMock;
const TOTAL_RESULTS =
  students.length +
  teachers.length +
  organizer.length +
  monitor.length +
  staff.length;

const openSearch = () => {
  cy.contains("Rechercher…").click();
  cy.get('input[placeholder="Rechercher un utilisateur..."]').should(
    "be.focused"
  );
};

const search = (word: string) => {
  openSearch();
  cy.get('input[placeholder="Rechercher un utilisateur..."]').type(word);
};

describe("Global search", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", "/global_search/user?search=", {
      statusCode: 200,
      body: emptyGlobalSearchResultsMock,
    }).as("getEmptySearch");
    cy.intercept("GET", "/global_search/user?search=*", {
      statusCode: 200,
      body: globalSearchResultsMock,
    }).as("getSearchResults");
    cy.intercept("GET", "/students?*", []).as("getStudents");
    cy.intercept("GET", "/groups?*", []).as("getGroups");
    cy.visit("/students");
    cy.wait("@getStudents");
  });

  it("should list every kind of user the search returns", () => {
    search("do");
    cy.wait("@getSearchResults");

    cy.contains(`${TOTAL_RESULTS} résultats`).should("be.visible");

    cy.contains("John Doe").should("be.visible");
    cy.contains(students[0].ref).should("be.visible");
    cy.contains("Marc Dupont").should("be.visible");
    cy.contains("Olga Nizer").should("exist");
    cy.contains("Mona Tor").should("exist");
    cy.contains("Stan Ffmember").should("exist");
  });

  it("should show the status of each user", () => {
    search("do");
    cy.wait("@getSearchResults");

    cy.contains("Actif").should("exist");
    cy.contains("Suspendu").should("exist");
    cy.contains("Quitté").should("exist");
    cy.contains("Ancien").should("exist");
  });

  it("should narrow the results down to one role, then widen them again", () => {
    search("do");
    cy.wait("@getSearchResults");

    cy.contains(`STUDENT (${students.length})`).click();
    cy.contains(`${students.length} résultats`).should("be.visible");
    cy.contains("John Doe").should("be.visible");
    cy.contains("Marc Dupont").should("not.exist");

    cy.contains(`STUDENT (${students.length})`).click();
    cy.contains(`${TOTAL_RESULTS} résultats`).should("be.visible");
    cy.contains("Marc Dupont").should("be.visible");
  });

  it("should open the profile of a user picked with the mouse", () => {
    search("do");
    cy.wait("@getSearchResults");

    cy.contains("Marc Dupont").click();

    cy.routePathnameEq(`/teachers/${teachers[0].id}/show`);
  });

  it("should tell when nothing matches", () => {
    cy.intercept("GET", "/global_search/user?search=*", {
      statusCode: 200,
      body: emptyGlobalSearchResultsMock,
    }).as("getNoResult");

    search("zzz");
    cy.wait("@getNoResult");

    cy.contains("Aucun résultat").should("be.visible");
  });
});
