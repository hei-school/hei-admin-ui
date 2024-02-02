import {mount} from "@cypress/react";
import {manager1} from "./credentials";
import {
  badPicManager,
  noPicManager,
  updatedManager,
  whoamiManagerMock,
  withPicManager,
} from "./mocks/responses";
import App from "../App";
import specTitle from "cypress-sonarqube-reporter/specTitle";

// /!\ TODO : Create cypress command cy.getByTestids
describe(specTitle("Profile picture test"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();

    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.get('[href="#/profile"]').click();
  });

  it("should fallback to default source when profile_pic is falsy", () => {
    cy.intercept("GET", `/managers/${noPicManager().id}`, noPicManager()).as(
      "getManager"
    );
    cy.wait("@getManager");

    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", "blank-profile-photo");
  });

  it("should have the right source when profile_pic is ok", () => {
    cy.intercept(
      "GET",
      `/managers/${withPicManager().id}`,
      withPicManager()
    ).as("getManager");
    cy.wait("@getManager");

    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", withPicManager().profile_picture);
  });

  it("should fallback to default source when profile_pic cannot be fetched", () => {
    cy.intercept("GET", `/managers/${badPicManager().id}`, badPicManager()).as(
      "getManager"
    );
    cy.wait("@getManager");

    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", "blank-profile-photo");
  });

  it("can edit the profile picture", () => {
    cy.intercept(
      "GET",
      `/managers/${withPicManager().id}`,
      withPicManager()
    ).as("getManager");
    cy.wait("@getManager");

    cy.getByTestid("upload-picture-button").click();
    cy.getByTestid("dropzone").selectFile(
      "cypress/fixtures/profile_picture/profile-picture.png",
      {action: "drag-drop"}
    );
    cy.contains("Enregistrer").click();

    cy.intercept(
      "POST",
      `/managers/${updatedManager().id}/picture/raw`,
      updatedManager()
    ).as("getManager");
    cy.intercept(
      "GET",
      `/managers/${updatedManager().id}`,
      updatedManager()
    ).as("getManager");

    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", updatedManager().profile_picture);

    cy.getByTestid("MenuIcon").click();

    cy.getByTestid("appbar-profile-pic")
      .should("have.attr", "src")
      .and("include", updatedManager().profile_picture);
  });
});
