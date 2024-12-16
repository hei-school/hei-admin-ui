import {teacher1Mock, teachersMock} from "../fixtures/api_mocks/teachers-mocks";
import {updatedInfo} from "./utils";

describe("Manager.Teachers", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept(
      "GET",
      /teachers\?page=1&page_size=10&(first_name|ref|last_name)=/,
      [teacher1Mock]
    ).as("getFilters");
    cy.intercept("GET", `*/teachers/${teacher1Mock.id}`, teacher1Mock).as(
      "getTeachers1"
    );
    cy.intercept("GET", "**/teachers?page=1&page_size=10", teachersMock).as(
      "getTeachers"
    );
    cy.intercept("PUT", `*/teachers/${teacher1Mock.id}`, updatedInfo).as(
      "putUpdate"
    );
    cy.get('[href="#/teachers"]').click();
    cy.wait("@getTeachers");
    cy.get(":nth-child(1) > .column-undefined > .MuiButtonBase-root").as(
      "editButton"
    );
  });

  it("list all teachers", () => {
    cy.get("tbody tr").should("have.length", teachersMock.length);
    cy.getByTestid("menu-list-action").click();
    cy.get("body").click();
    cy.get('a[aria-label="Éditer"]').should("exist");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").should("exist");
  });

  it("can filter teachers by first_name", () => {
    cy.getByTestid("main-search-filter").type(teacher1Mock.first_name);
    cy.wait("@getFilters");
    cy.get("tbody tr")
      .should("have.length", 1)
      .should("not.contain", teachersMock[1].first_name);
    cy.get("tbody tr").should("have.length", 1);
    cy.get("tbody tr:first-child").should("contain", teacher1Mock.first_name);
  });

  it("can filter teachers by last_name", () => {
    cy.getByTestid("main-search-filter").clear();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(teacher1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.wait("@getFilters");
    cy.get("tbody tr")
      .should("have.length", 1)
      .should("not.contain", teachersMock[1].first_name);
    cy.get("tbody tr").should("have.length", 1);
    cy.get("tbody tr:first-child").should("contain", teacher1Mock.first_name);
  });

  it("can filter teachers by ref", () => {
    cy.getByTestid("main-search-filter").clear();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-ref").type(teacher1Mock.ref);
    cy.getByTestid("apply-filter").click();
    cy.wait("@getFilters");
    cy.get("tbody tr")
      .should("have.length", 1)
      .should("not.contain", teachersMock[1].first_name);
    cy.get("tbody tr").should("have.length", 1);
    cy.get("tbody tr:first-child").should("contain", teacher1Mock.first_name);
  });

  it("can edit teachers", () => {
    cy.get("@editButton").click();
    cy.wait("@getTeachers1");
    cy.get("#last_name").clear().type(updatedInfo.last_name);
    cy.getByTestid("SaveIcon").click();
    cy.intercept("GET", `*/teachers/${teachersMock[0].id}`, updatedInfo).as(
      "getTeachers1"
    );
    cy.wait("@putUpdate");
    cy.get("@editButton").click();
    cy.wait("@getTeachers1");
    cy.get("#last_name").should("have.value", updatedInfo.last_name);
  });
});
