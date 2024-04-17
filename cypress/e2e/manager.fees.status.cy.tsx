import {FeeStatusEnum} from "@haapi/typescript-client";
import {student1Mock} from "../fixtures/students-mocks";
import {fee1Mock, lateFeesMock} from "../fixtures/fees-mocks";
import {payment1Mock} from "../fixtures/payments-mocks";

const applyFilter = (status: FeeStatusEnum) => {
  cy.getByTestid("students-menu").click();
  cy.get('a[href="#/fees"]').click();
  cy.getByTestid("menu-list-action").click();
  cy.getByTestid("add-filter").click();
  cy.getByTestid("filter-fees-status").click();
  cy.get(`[data-value=${status}]`).click();
  cy.contains("Appliquer").click();
};

const assertRequestUrl = (status: FeeStatusEnum) => {
  cy.intercept("GET", `/fees*`).as("getFees");

  cy.wait("@getFees").then((interception) => {
    expect(interception.request.url).to.include(status);
  });
};

describe("Manager.Fee.Late", () => {
  beforeEach(() => {
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

    cy.login({role: "MANAGER"});
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
