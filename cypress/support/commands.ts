/// <reference types="cypress" />

import {Whoami, WhoamiRoleEnum} from "@haapi/typescript-client";
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
      {subjectType: "drag-n-drop"}
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

function setupLoginMocks(user: any, role: WhoamiRoleEnum) {
  const whoami: Whoami = {
    id: user.id,
    bearer: "dummy",
    role,
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
  cy.intercept("**/whoami", whoami).as("getWhoami");
  cy.intercept("https://www.google-analytics.com/g/**", {statusCode: 200}).as(
    "analytics"
  );
  cy.intercept(
    "https://14bc494aa88b.fca04fe8.eu-west-3.token.awswaf.com/**/**",
    {statusCode: 200}
  ).as("waf");
}

Cypress.Commands.add("login", (options: LoginConfig) => {
  const {role, success: isSuccess = true} = options;
  const defaultUserConnected = getUserConnected(role);
  const user = options.user || defaultUserConnected.user;

  setupLoginMocks(user, role);

  const casdoorSignin = {
    code: 200,
    status: "ok",
    data: "dummy",
  };

  cy.intercept("POST", "https://www.google-analytics.com/**");

  cy.intercept(
    "GET",
    `**/authentication/login-url?redirect_uri=${window.location.origin}/auth/callback`
  ).as("getRedirectionURL");

  cy.visit("/login");
  cy.get('[data-testid="casdoor-login-btn"]').click();

  if (!isSuccess) {
    cy.visit(`/auth/callback?code=${role}&state=HEI Admin`);
  } else {
    cy.intercept("**/authentication/signin**", casdoorSignin).as(
      "getCasdoorToken"
    );
    cy.wait("@getWhoami");
    cy.visit(`/auth/callback?code=${role}&state=HEI Admin`);
  }
});

Cypress.Commands.add("mockLogin", (options: LoginConfig) => {
  const {role} = options;
  const defaultUserConnected = getUserConnected(role);
  const user = options.user || defaultUserConnected.user;

  setupLoginMocks(user, role);

  cy.visit("/");
  cy.intercept("GET", "/students/letters/stats", {
    pending: 0,
    received: 0,
    rejected: 0,
  });
  cy.intercept("GET", "/students/stats", {
    total_students: 0,
    students_alternating: {
      total: 0,
      working: 0,
      have_been_working: 0,
      not_working: 0,
      will_work: 0,
    },
    men: {
      total: 0,
      disabled: 0,
      enabled: 0,
      suspended: 0,
    },
    women: {
      total: 0,
      disabled: 0,
      enabled: 0,
      suspended: 0,
    },
    total_groups: 0,
  });
});
