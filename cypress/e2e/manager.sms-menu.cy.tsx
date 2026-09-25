import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {smsCampaignsMock} from "../fixtures/api_mocks/sms-mocks";

describe("SmsMenu.AccessControl", () => {
  it("shows the SMS menu and balance for a manager", () => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.getByTestid("sms-balance-indicator").should("contain", "1250 SMS");
    cy.getByTestid("sms-menu").click();
    cy.get('a[href="/sms-campaigns"]').should("be.visible");
    cy.get('a[href="/sms-contact-groups"]').should("be.visible");
    cy.get('a[href="/sms-contacts"]').should("be.visible");
  });

  it("shows the SMS menu and balance for an admin", () => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.getByTestid("sms-balance-indicator").should("contain", "1250 SMS");
    cy.getByTestid("sms-menu").click();
    cy.get('a[href="/sms-campaigns"]').should("be.visible");
  });

  it("hides the SMS menu and balance for a teacher", () => {
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
    cy.getByTestid("sms-balance-indicator").should("not.exist");
    cy.getByTestid("sms-menu").should("not.exist");
  });

  it("navigates to the campaigns list from the balance chip", () => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
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
