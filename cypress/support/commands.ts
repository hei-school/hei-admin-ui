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

  const whoami: Whoami = {
    id: user.id,
    bearer: "dummy",
    role,
  };

  const casdoorSignin = {
    code: 200,
    status: "ok",
    data: "dummy",
  };

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

  cy.intercept("GET", `**/${role.toLowerCase()}s/${user.id}`, user).as(
    "getProfile"
  );
  cy.intercept("**/health/db", "OK").as("getHealthDb");

  cy.intercept("GET", "**/redirect-url").as("getRedirectionURL");

  cy.visit("/login");

  // have to click 'cause of MUI input style
  cy.get('[data-testid="casdoor-login-btn"]', {timeout: 15000}).click();

  cy.wait("@getRedirectionURL");

  cy.origin("https://numer.casdoor.com", () => {
    // Saisie de l'identifiant (email ou téléphone)

    cy.get(
      'input[placeholder="identifiant, adresse e-mail ou téléphone"], input[placeholder="username, Email or phone"]',
      {timeout: 45000}
    )
      .click()
      .type("_name_here_@mail.hei.school");

    // Saisie du mot de passe
    cy.get('input[placeholder="Mot de passe"], input[placeholder="Password"')
      .click()
      .type("_password_here_");
    /*
        // Clic sur "Se connecter"
    cy.contains(/Se connecter|Sign In/).click()
    .then(() => {
      attemptConnection = true;
    });
  */
  });

  cy.visit(`/callback?code=${role}&state=HEI Admin`);

  if (isSuccess) {
    cy.intercept("**/api/api/signin", casdoorSignin).as("getCasdoorToken");
    //cy.wait("@casdoorSignin");
    cy.intercept("**/whoami", whoami).as("getWhoami");
    cy.wait("@getProfile");
  }
});
