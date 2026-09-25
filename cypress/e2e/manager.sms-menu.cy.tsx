import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {smsCampaignsMock} from "../fixtures/api_mocks/sms-mocks";

const mockAppBarSideEffects = () => {
  cy.intercept("GET", "/fees?page=*&page_size=500", {data: []});
  cy.intercept("GET", "/students/credit-payments*", []);
  cy.intercept("GET", "/retake_exams*", []);
};

describe("SmsMenu.AccessControl", () => {
  it("shows the SMS balance for a manager", () => {
    mockAppBarSideEffects();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.wait("@getSmsBalance");
    cy.getByTestid("sms-balance-indicator").should("contain", "1250 SMS");
  });

  it("shows the SMS menu with its three sub-items for a manager", () => {
    mockAppBarSideEffects();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.getByTestid("sms-menu").should("be.visible").click();
    cy.get('a[href="/sms-campaigns"]').scrollIntoView().should("be.visible");
    cy.get('a[href="/sms-contact-groups"]')
      .scrollIntoView()
      .should("be.visible");
    cy.get('a[href="/sms-contacts"]').scrollIntoView().should("be.visible");
  });

  it("shows the SMS menu and balance for an admin", () => {
    mockAppBarSideEffects();
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.wait("@getSmsBalance");
    cy.getByTestid("sms-balance-indicator").should("contain", "1250 SMS");
    cy.getByTestid("sms-menu").should("be.visible").click();
    cy.get('a[href="/sms-campaigns"]').should("be.visible");
  });

  it("hides the SMS menu and balance for a teacher", () => {
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
    cy.getByTestid("sms-balance-indicator").should("not.exist");
    cy.getByTestid("sms-menu").should("not.exist");
  });

  it("navigates to the campaigns list from the balance chip", () => {
    mockAppBarSideEffects();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.wait("@getSmsBalance");
    cy.intercept(
      "GET",
      "/sms-campaigns?page=1&page_size=10",
      smsCampaignsMock
    ).as("getCampaigns");
    cy.getByTestid("sms-balance-indicator").click();
    cy.wait("@getCampaigns");
    cy.url().should("include", "/sms-campaigns");
    cy.contains("Campagnes SMS");
  });
});
