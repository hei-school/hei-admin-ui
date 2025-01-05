import {monitor1Mock, monitorsMock} from "../fixtures/api_mocks/monitors-mock";
import {updatedInfo} from "./utils";

describe("Manager.Monitors", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});

    cy.intercept(
      "GET",
      /^.*\/monitors\?page=1&page_size=10&(first_name|ref|last_name)=/,
      [monitor1Mock]
    ).as("getFilters");

    cy.intercept("GET", `*/monitors/${monitor1Mock.id}`, monitor1Mock).as(
      "getMonitor1"
    );

    cy.intercept("GET", "*/monitors?page=1&page_size=10", monitorsMock).as(
      "getMonitors"
    );

    cy.intercept("PUT", `*/monitors/${monitor1Mock.id}`, updatedInfo).as(
      "putUpdate"
    );

    cy.getByTestid("monitors-menu").click();
    cy.wait("@getMonitors");
    cy.get(":nth-child(1) > .column-undefined > .MuiButtonBase-root").as(
      "editButton"
    );
  });

  it("can see the list of all monitors in manager", () => {
    cy.getByTestid("monitors-menu").click();
    cy.get("tbody tr").should("have.length", monitorsMock.length);
    cy.getByTestid("menu-list-action").click();
    cy.get("body").click();
    cy.get('a[aria-label="Éditer"]').should("exist");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").should("exist");
  });

  it("can filter monitors by first_name", () => {
    cy.getByTestid("main-search-filter").type(monitor1Mock.first_name);
    cy.wait("@getFilters");
    cy.get("tbody tr")
      .should("have.length", 1)
      .should("not.contain", monitorsMock[1].first_name);
    cy.get("tbody tr:first-child").should("contain", monitor1Mock.first_name);
  });

  it("can edit a monitor", () => {
    cy.get("@editButton").click();
    cy.wait("@getMonitor1");
    cy.get('input[name="last_name"]').should("exist");

    cy.get("#last_name").clear().type(updatedInfo.last_name);
    cy.getByTestid("SaveIcon").click();
    cy.wait("@putUpdate");
    cy.get("@editButton").click();
  });
});
