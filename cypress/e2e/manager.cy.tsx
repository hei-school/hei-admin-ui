import {FeeTemplate} from "@haapi/typescript-client";
import {
  feesTemplates1Mock,
  feesTemplatesMocks,
} from "../fixtures/feesTemplates-mocks";

const feesTemplate1Updated: Required<FeeTemplate> = {
  ...feesTemplates1Mock,
  name: "udated",
  type: "TUITION",
  amount: 1000,
};

describe("Manager.feesTemplates", () => {
  before(() => {
    cy.login({role: "MANAGER"});
    cy.intercept(
      "GET",
      "**fees/templates?page=1&page_size=10",
      feesTemplatesMocks
    ).as("getFeesTemplates");
    cy.intercept(
      "GET",
      `**fees/templates/${feesTemplates1Mock.id}`,
      feesTemplates1Mock
    ).as("getFeesTemplate1");
    cy.get('a[href="#/fees-templates"]').click();
  });

  it("can edit feesTemplates", () => {
    cy.intercept(
      "PUT",
      `**fees/templates/${feesTemplates1Mock.id}`,
      feesTemplate1Updated
    ).as("updateFeesTemplate1");
    cy.wait("@getFeesTemplates");
    cy.get("tbody tr").should("have.length", feesTemplatesMocks.length);
    cy.contains(feesTemplates1Mock.name).click();
    cy.wait("@getFeesTemplate1");
    cy.get("#name").clear().type(feesTemplate1Updated.name);
    cy.get("#type_TUITION").click();
    cy.get("#amount").clear().type(feesTemplate1Updated.amount.toString());
    cy.getByTestid("SaveIcon").click();

    cy.wait("@updateFeesTemplate1").then((interception) => {
      const {body} = interception.request;
      expect(body).to.deep.equal({
        ...feesTemplate1Updated,
        creation_datetime: body.creation_datetime,
      });
    });
  });
});
