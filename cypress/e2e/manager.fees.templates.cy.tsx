import {FeeTemplate} from "@haapi/typescript-client";
import {
  feesTemplates1Mock,
  feesTemplatesMocks,
} from "../fixtures/api_mocks/fees-templates-mocks";

const feesTemplate1Updated: Required<FeeTemplate> = {
  ...feesTemplates1Mock,
  name: "udated",
  type: "TUITION",
  amount: 1000,
};

describe("Manager.feesTemplates", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept(
      "GET",
      "*/fees/templates?page=1&page_size=10",
      feesTemplatesMocks
    ).as("getFeesTemplates");
    cy.intercept("PUT", `*/fees/templates/**`, feesTemplate1Updated).as(
      "putFeeTemplate1"
    );
    cy.intercept(
      "GET",
      `*/fees/templates/${feesTemplates1Mock.id}`,
      feesTemplates1Mock
    ).as("getFeesTemplate1");

    cy.get('a[href="/fees-templates"]').click();
  });

  it("can edit feesTemplates", () => {
    cy.wait("@getFeesTemplates");
    cy.get("tbody tr").should("have.length", feesTemplatesMocks.length);
    cy.contains(feesTemplates1Mock.name).click();
    cy.wait("@getFeesTemplate1");
    cy.get("#name").clear().type(feesTemplate1Updated.name);
    cy.get("#type_TUITION").click();
    cy.get("#amount").clear().type(feesTemplate1Updated.amount.toString());
    cy.getByTestid("SaveIcon").click();

    cy.wait("@putFeeTemplate1").then((interception) => {
      const {body} = interception.request;
      expect(body).to.deep.equal({
        ...feesTemplate1Updated,
        creation_datetime: body.creation_datetime,
      });
    });
  });

  it("can create feesTemplates", () => {
    cy.wait("@getFeesTemplates");
    cy.get("tbody tr").should("have.length", feesTemplatesMocks.length);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.get("#type_TUITION").click();
    cy.get("#name").clear().type(feesTemplate1Updated.name);
    cy.get("#amount").clear().type(feesTemplate1Updated.amount.toString());
    cy.get("#number_of_payments")
      .clear()
      .type(feesTemplate1Updated.number_of_payments.toString());
    cy.getByTestid("SaveIcon").click();

    cy.wait("@putFeeTemplate1").then((interception) => {
      const {body} = interception.request;
      body.creation_datetime = feesTemplate1Updated.creation_datetime;
      expect(body).to.deep.equal({
        ...feesTemplate1Updated,
        id: body.id,
      });
    });
  });
});
