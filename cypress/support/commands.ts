/// <reference types="cypress" />

import {Whoami} from "@haapi/typescript-client";
import {LoginConfig} from "./global";
import {getUserConnected} from "../fixtures/authentification-mocks";

Cypress.Commands.add("getByTestid", <Subject = any>(id: string) => {
  return cy.get<Subject>(`[data-testid='${id}']`);
});

Cypress.Commands.add("routePathnameEq", (to) => {
  cy.window()
    .its("location")
    .should(({pathname}) => {
      expect(pathname).to.eq(to);
    });
});

Cypress.Commands.add("login", (options: LoginConfig) => {
  const {role} = options;
  const defaultUserConnected = getUserConnected(role);
  const user = options.user || defaultUserConnected.user;
  const isSuccess = options.success !== false;

  const whoami: Whoami = {
    id: user.id,
    bearer: "dummy",
    role,
  };

  cy.intercept("**/whoami", (req) => {
    req.reply({
      statusCode: 403,
      body: "Forbidden",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }).as("getWhoAmi");
  cy.intercept(`**/${role.toLowerCase()}s/${user.id}`, user).as("getProfile");
  cy.intercept("**/health/db", "OK").as("getHealthDb");
  cy.visit("/login");

  // have to click 'cause of MUI input style
  cy.get("#username")
    .click()
    .type(options.username || defaultUserConnected.username);
  cy.get("#password")
    .click()
    .type(options.password || defaultUserConnected.password);
  cy.get("button").contains("Connexion").click();

  if (isSuccess) {
    cy.intercept("**/whoami", whoami).as("getWhoAmi");
    cy.wait("@getWhoAmi");
  }

  isSuccess && options.redirect && cy.visit(options.redirect);
});
