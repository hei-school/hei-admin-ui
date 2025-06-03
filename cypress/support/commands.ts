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
      url: /.*awswaf.*telemetry.*/,
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

  cy.intercept(
    "GET",
    `**/authentication/login-url?redirect_uri=${window.location.origin}/auth/callback`
  ).as("getRedirectionURL");

  cy.visit("/login");

  cy.get('[data-testid="casdoor-login-btn"]').click();

  if (!isSuccess) {
    cy.visit(`/auth/callback?code=${role}&state=HEI Admin`);
  } else if (isSuccess) {
    cy.intercept("**/authentication/signin**", casdoorSignin).as(
      "getCasdoorToken"
    );
    cy.intercept("**/whoami", whoami).as("getWhoami");
    cy.visit(`/auth/callback?code=${role}&state=HEI Admin`);
    cy.wait("@getProfile");
  }
});
