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
  const user = options.user || defaultUserConnected.user;
  let attemptConnection = false;

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
  cy.intercept("**/whoami", (req) => {
    if (attemptConnection) {
      return req.reply({...req, body: whoami, statusCode: 200});
    }
    return req.reply({...req, statusCode: 403});
  }).as("getWhoami");

  cy.visit("/login");

  // have to click 'cause of MUI input style
  cy.get("#username")
    .clear()
    .type(options.username || defaultUserConnected.username);
  cy.get("#password")
    .clear()
    .type(options.password || defaultUserConnected.password);
  cy.get("button")
    .contains("Connexion", {timeout: 10000})
    .click()
    .then(() => {
      attemptConnection = true;
    });

  cy.wait("@postCognito");

  if (isSuccess) {
    cy.wait("@getWhoami");
    cy.wait("@getProfile");
  }

  cy.intercept(
    {
      url: /.*awswaf.*telemetry.*/, // Match any URL containing 'awswaf' and 'telemetry'
      method: "POST",
    },
    {
      statusCode: 200,
      body: {
        token: "dummy_token",
        next_interval: 100,
        awswaf_session_storage: "awswaf_dummy_session_storage_key",
      },
    }
  ).as("awsWafTelemetry");
});
