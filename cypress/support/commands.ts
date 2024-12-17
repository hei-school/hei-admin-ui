/// <reference types="cypress" />

import {Whoami} from "@haapi/typescript-client";
import {LoginConfig} from "./global";
import {getUserConnected} from "../fixtures/api_mocks/authentification-mocks";
import "cypress-file-upload";

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
  const user = options.user || defaultUserConnected.user;

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

  // have to click 'cause of MUI input style
  cy.get("#username")
    .click()
    .type(options.username || defaultUserConnected.username);

  isSuccess && cy.intercept("**/whoami", whoami).as("getWhoami");
  cy.get("#password")
    .click()
    .type(options.password || defaultUserConnected.password);
  cy.get("button").contains("Connexion", {timeout: 10000}).click();

  cy.wait("@postCognito");
  cy.wait("@postCognito");

  if (isSuccess) {
    cy.wait("@getWhoami");
    cy.wait("@getProfile");
  }
});
