/// <reference types="cypress" />

import {Whoami} from "@haapi/typescript-client";
import "cypress-file-upload";
import {getUserConnected} from "../fixtures/api_mocks/authentification-mocks";
import {LoginConfig} from "./global";

Cypress.Commands.add("getByTestid", <Subject = any>(id: string) => {
  return cy.get<Subject>(`[data-testid='${id}']`);
});

Cypress.Commands.add(
  "attachFileToDropZone",
  {prevSubject: "element"},
  (subject, filePath: string) => {
    cy.wrap(subject).attachFile(
      {filePath, encoding: "utf-8"},
      {
        subjectType: "drag-n-drop",
      }
    );
  }
);

Cypress.Commands.add("routePathnameEq", (to) => {
  cy.window()
    .its("location")
    .should(({pathname}) => {
      expect(pathname).to.eq(to);
    });
});

Cypress.Commands.add(
  "inteceptMockByOne",
  <T extends {id: string}>(resource: string, mocks: T[]) => {
    mocks.forEach((mock) => {
      cy.intercept(`${resource}/${mock.id}`, mock).as(`getOne_${resource}`);
    });
  }
);

Cypress.Commands.add(
  "assertRequestBody",
  <T>(requestAlias: string, expectedBody: (body: any) => T) => {
    cy.wait(requestAlias).then((interception) => {
      const body = interception.request.body;
      expect(body).to.deep.equal(expectedBody(body));
    });
  }
);

Cypress.Commands.add("login", (options: LoginConfig) => {
  const {role, success: isSuccess = true} = options;
  const defaultUserConnected = getUserConnected(role);

  if (!defaultUserConnected || !defaultUserConnected.user) {
    throw new Error(`No default user found for role: ${role}`);
  }

  const user = options.user || defaultUserConnected.user;
  const username = options.username || defaultUserConnected.username;
  const password = options.password || defaultUserConnected.password;

  if (!username || !password) {
    throw new Error(
      `Missing credentials: username=${username}, password=${password}`
    );
  }

  const whoami: Whoami = {
    id: user.id,
    bearer: "dummy",
    role,
  };

  cy.intercept("GET", `**/${role.toLowerCase()}s/${user.id}`, user).as(
    "getProfile"
  );
  cy.intercept("**/health/db", "OK").as("getHealthDb");
  cy.intercept("POST", "https://cognito-idp.eu-west-3.amazonaws.com").as(
    "postCognito"
  );
  cy.visit("/login");

  cy.get("#username").clear().type(username);
  cy.get("#password").clear().type(password);
  cy.get("button").contains("Connexion", {timeout: 10000}).click();

  cy.wait("@postCognito");
  cy.wait("@postCognito");

  if (isSuccess) {
    cy.intercept("**/whoami", whoami).as("getWhoami");
    cy.wait("@getWhoami");
    cy.wait("@getProfile");
  }
});
