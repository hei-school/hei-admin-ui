import {
  createdMonitor,
  monitor1Mock,
  monitorsMock,
} from "../fixtures/api_mocks/monitors-mock";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";
import {updatedInfo} from "./utils";

describe("Manager.Monitors", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});

    cy.intercept(
      "GET",
      /^.*\/monitors\?page=1&page_size=10&(first_name|ref|last_name)=/,
      [monitor1Mock]
    ).as("getFilters");
    cy.intercept(
      "GET",
      /^.*\/monitors\?page=2&page_size=10&(first_name|ref|last_name)=/,
      [monitor1Mock]
    ).as("getFilters2");

    cy.intercept("GET", `/monitors/${monitor1Mock.id}`, monitor1Mock).as(
      "getMonitor1"
    );

    cy.intercept("GET", "/monitors?page=1&page_size=10", monitorsMock).as(
      "getMonitors"
    );
    cy.intercept("GET", "/monitors?page=2&page_size=10", monitorsMock).as(
      "getMonitors2"
    );
    cy.intercept("PUT", `/monitors/${monitor1Mock.id}`, updatedInfo).as(
      "putUpdate"
    );
    cy.intercept("GET", `/students?page=1&page_size=500`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=500`, studentsMock).as(
      "getStudentsPage2"
    );

    cy.intercept("PUT", "/monitors", createdMonitor).as("createdmonitor");

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

  it("Can create a new monitor", () => {
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.get("#ref").type(createdMonitor.ref);
    cy.get("#first_name").type(createdMonitor.first_name);
    cy.get("#last_name").type(createdMonitor.last_name);
    cy.get("#nic").type(createdMonitor.nic);
    cy.get("#birth_place").type(createdMonitor.birth_place);
    cy.get("#email").type(createdMonitor.email);
    cy.get("#entrance_datetime")
      .click()
      .type(createdMonitor.entrance_datetime.toISOString().slice(0, 10));
    cy.get("#student_refs").click();
    cy.wait("@getStudentsPage1");
    cy.contains("STD21111").click();
    cy.get("#student_refs").click();
    cy.contains("STD00025").click();
    cy.get("#student_refs").click();
    cy.contains("STD123365").click();
    cy.contains("Enregistrer").click();
    cy.wait("@createdmonitor").its("response.statusCode").should("eq", 200);
  });
});
