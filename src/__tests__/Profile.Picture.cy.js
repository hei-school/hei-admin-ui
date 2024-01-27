import {mount} from "@cypress/react";
import {manager1} from "./credentials";
import {
  badPicManager,
  noPicManager,
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
    cy.intercept("GET", `/managers/${noPicManager().id}`, noPicManager());

    cy.get('[data-testid="profile-pic"]')
      .should("have.attr", "src")
      .and("include", "blank-profile-photo");
  });

  it("should have the right source when profile_pic is ok", () => {
    cy.intercept("GET", `/managers/${withPicManager().id}`, withPicManager());

    cy.get('[data-testid="profile-pic"]')
      .should("have.attr", "src")
      .and("include", withPicManager().profile_picture);
  });

  it("should fallback to default source when profile_pic cannot be fetched", () => {
    cy.intercept("GET", `/managers/${badPicManager().id}`, badPicManager());

    cy.get('[data-testid="profile-pic"]')
      .should("have.attr", "src")
      .and("include", "blank-profile-photo");
  });
});
