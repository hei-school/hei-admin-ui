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

  const casdoorSignin = {
    "code": 200,
    "status": "ok",
    "data": "dummy",
  } 

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

     cy.intercept("GET", "**/redirect-url").as(
    "getRedirectionURL"
  );

    cy.intercept("GET", "https://numer.casdoor.com/login/oauth/authorize").as(
    "getIntoCasdoorLoginPage"
  );

    
  cy.visit("/login");

  // have to click 'cause of MUI input style
  cy.get('[data-testid="casdoor-login-btn"]',{timeout: 15000}).click();

  cy.origin("https://numer.casdoor.com", () => {
    // Saisie de l'identifiant (email ou téléphone)
    cy.get('input[placeholder="identifiant, adresse e-mail ou téléphone"], input[placeholder="username, Email or phone"]', { timeout: 45000 })
    .click()
    .type("name_here@mail.hei.school");
  
    // Saisie du mot de passe
    cy.get('input[placeholder="Mot de passe"], input[placeholder="Password"').click().type("_password_here_");
  
    // Clic sur "Se connecter"
    cy.contains(/Se connecter|Sign In/).click()
    .then(() => {
      attemptConnection = true;
    });;
  });
  
  cy.get('body', { timeout: 45000 }).should('contain', 'La page est en cours de chargement, merci de bien vouloir patienter.');

  if (isSuccess) {
    cy.intercept("**/whoami", whoami).as("getWhoami");
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
