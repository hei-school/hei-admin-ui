import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {manager1Mock, managersMock} from "../fixtures/api_mocks/managers-mocks";

const otherManager = {
  id: "manager2_id",
  first_name: "Nina",
  last_name: "Responsable",
};

const routingsMock = [
  {
    id: "ROUTING001",
    type: "FINANCIAL",
    manager: manager1Mock,
    creation_datetime: "2025-09-01T08:00:00.000Z",
  },
  {
    id: "ROUTING002",
    type: "ACADEMIC",
    manager: otherManager,
    creation_datetime: "2025-09-05T08:00:00.000Z",
  },
];

describe("Complaint Routings Manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept(
      "GET",
      "/complaint-routings?page=*&page_size=*",
      routingsMock
    ).as("getRoutings");
    cy.intercept("GET", "/managers?*", managersMock).as("getManagers");
    cy.visit("/complaint-routings");
    cy.wait("@getRoutings");
    cy.wait("@getManagers");
  });

  it("should display the list of manager assignments", () => {
    cy.contains(manager1Mock.first_name!).should("be.visible");
    cy.contains(manager1Mock.last_name!).should("be.visible");
    cy.contains("Financière").should("be.visible");
  });

  it("should show the create button and filters directly, with no extra click", () => {
    cy.getByTestid("menu-list-action").should("not.exist");
    cy.getByTestid("create-routing").should("be.visible");
    cy.getByTestid("filter-routing-type").should("be.visible");
    cy.getByTestid("filter-routing-manager").should("be.visible");
  });

  it("should create a new manager assignment", () => {
    cy.intercept("GET", "/complaint-routings/last?type=ACADEMIC", {
      statusCode: 404,
    }).as("getAcademicRouting");
    cy.intercept("POST", "/complaint-routings", {
      id: "ROUTING002",
      type: "ACADEMIC",
      manager: manager1Mock,
    }).as("createRouting");

    cy.getByTestid("create-routing").click();
    cy.wait("@getAcademicRouting");

    cy.contains("Aucun responsable assigné").should("be.visible");

    cy.getByTestid("manager-autocomplete")
      .find("input")
      .type(manager1Mock.first_name!);
    cy.get(".MuiAutocomplete-popper li").first().click();
    cy.getByTestid("assign-manager").click();
    cy.wait("@createRouting");
    cy.contains("Manager assigné avec succès.").should("be.visible");
  });

  it("should filter the assignments by complaint type", () => {
    cy.intercept("GET", "/complaint-routings?*complaint_type=ACADEMIC*", []).as(
      "getAcademicRoutings"
    );

    cy.getByTestid("filter-routing-type").click();
    cy.get('[data-value="ACADEMIC"]').click();
    cy.wait("@getAcademicRoutings");
  });

  it("should filter the assignments by manager", () => {
    cy.getByTestid("filter-routing-manager")
      .find("input")
      .type(manager1Mock.first_name!);
    cy.get(".MuiAutocomplete-popper li").first().click();
    cy.wait("@getRoutings");

    cy.contains(manager1Mock.first_name!).should("be.visible");
    cy.contains(otherManager.first_name).should("not.exist");
  });
});
