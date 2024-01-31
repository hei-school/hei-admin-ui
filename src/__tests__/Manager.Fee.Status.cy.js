import {mount} from "@cypress/react";
import {FeeStatusEnum} from "@haapi/typescript-client";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import App from "../App";
import {manager1} from "./credentials";
import {
  fee1Mock,
  lateFeesMock,
  manager2,
  payment1Mock,
  student1Mock,
  whoamiManagerMock,
} from "./mocks/responses";

const applyFilter = (status) => {
  cy.get('[data-testid="students-menu"]').click();
  cy.get('a[href="#/fees"]').click();
  // TODO: getByTestid
  cy.get('[data-testid="menu-list-action"]').click();
  cy.get('[data-testid="add-filter"]').click();
  cy.get('[data-testid="filter-fees-status"]').click();
  cy.get(`[data-value=${status}]`).click();
  cy.contains("Appliquer").click();
};

const assertRequestUrl = (status) => {
  cy.intercept("GET", `/fees*`).as("getFees");

  cy.wait("@getFees").then((interception) => {
    expect(interception.request.url).to.include(status);
  });
};

describe(specTitle("Manager.Fee.Late"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager2.id}`, (req) => {
      req.reply((res) => {
        res.setDelay(200);
        res.send(manager2);
      });
    }).as("getManager1");
    cy.intercept(
      "GET",
      `/fees?status=LATE&page=1&page_size=10`,
      lateFeesMock
    ).as("getLateFees");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`,
      [payment1Mock]
    ).as("getfees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();
  });

  it("can list paid fees", () => {
    applyFilter(FeeStatusEnum.PAID);
    assertRequestUrl(FeeStatusEnum.PAID);
  });

  it("can list unpaid fees", () => {
    applyFilter(FeeStatusEnum.UNPAID);
    assertRequestUrl(FeeStatusEnum.UNPAID);
  });
});
