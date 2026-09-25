import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {admin1Mock} from "../fixtures/api_mocks/admins-mock";
import {
  smsContact1Mock,
  smsContact2Mock,
  smsContactGroup1DetailMock,
  smsContactGroup1Mock,
  smsContactGroupsMock,
  smsContactsMock,
} from "../fixtures/api_mocks/sms-mocks";

describe("Manager.SmsContactGroups", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept(
      "GET",
      "/sms-contact-groups?page=1&page_size=10",
      smsContactGroupsMock
    ).as("getGroups");
    cy.intercept("GET", `/admins/${admin1Mock.id}`, admin1Mock).as("getOwner");
    cy.visit("/sms-contact-groups");
    cy.wait("@getGroups");
  });

  it("lists the contact groups with their member count and owner", () => {
    cy.get("table tbody tr").should("have.length", 2);
    cy.wait("@getOwner");
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", smsContactGroup1Mock.name)
      .and("contain", "1")
      .and("contain", admin1Mock.ref)
      .and("contain", admin1Mock.first_name);
  });

  it("creates a new contact group", () => {
    cy.intercept("GET", "/sms-contacts?page=1&page_size=500", []);
    cy.intercept("POST", "/sms-contact-groups", {
      id: "new_group_id",
      name: "Parents 2027",
      ownerId: admin1Mock.id,
      memberCount: 0,
    }).as("createGroup");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-sms-contact-group").click();
    cy.get("#name").type("Parents 2027");
    cy.getByTestid("save-sms-contact-group").click();
    cy.wait("@createGroup")
      .its("request.body")
      .should("deep.equal", {name: "Parents 2027", contactIds: []});
    cy.contains("Groupe créé avec succès");
  });

  it("deletes a contact group", () => {
    cy.intercept(
      "DELETE",
      `/sms-contact-groups/${smsContactGroup1Mock.id}`,
      smsContactGroup1Mock
    ).as("deleteGroup");
    cy.get("table tbody tr")
      .eq(0)
      .find("button[data-testid='delete-button-confirm']")
      .click();
    cy.get(".ra-confirm").click();
    cy.wait("@deleteGroup");
    cy.contains("Élément supprimé avec succès.");
  });

  it("navigates to the group detail page and shows its members", () => {
    cy.intercept(
      "GET",
      `/sms-contact-groups/${smsContactGroup1Mock.id}`,
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
    cy.intercept("GET", "/sms-contacts?page=1&page_size=500", smsContactsMock);
    cy.get("table tbody tr").eq(0).click();
    cy.wait("@getGroupDetail");
    cy.wait("@getOwner");
    cy.url().should(
      "include",
      `/sms-contact-groups/${smsContactGroup1Mock.id}`
    );
    cy.contains("Groupes de contacts");
    cy.contains(smsContactGroup1Mock.name!);
    cy.contains("1 membre(s)");
    cy.contains(`Propriétaire : ${admin1Mock.ref} — ${admin1Mock.first_name}`);
    cy.contains(smsContact1Mock.name!);
    cy.contains(smsContact1Mock.phoneNumber!);
  });

  it("adds a contact to the group and removes one", () => {
    cy.intercept(
      "GET",
      `/sms-contact-groups/${smsContactGroup1Mock.id}`,
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
    cy.intercept("GET", "/sms-contacts?page=1&page_size=500", smsContactsMock);
    cy.visit(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
    cy.wait("@getGroupDetail");

    cy.intercept(
      "POST",
      `/sms-contact-groups/${smsContactGroup1Mock.id}/members/${smsContact2Mock.id}`,
      {
        ...smsContactGroup1DetailMock,
        members: [smsContact1Mock, smsContact2Mock],
      }
    ).as("addMember");
    cy.intercept("GET", `/sms-contact-groups/${smsContactGroup1Mock.id}`, {
      ...smsContactGroup1DetailMock,
      memberCount: 2,
      members: [smsContact1Mock, smsContact2Mock],
    }).as("getGroupDetailAfterAdd");

    cy.get(".MuiAutocomplete-root input").type(smsContact2Mock.name!);
    cy.get(".MuiAutocomplete-popper li")
      .contains(smsContact2Mock.name!)
      .click();
    cy.getByTestid("add-sms-contact-group-member").click();
    cy.wait("@addMember");
    cy.wait("@getGroupDetailAfterAdd");
    cy.contains("Contact ajouté au groupe");
    cy.contains(smsContact2Mock.name!);

    cy.intercept(
      "DELETE",
      `/sms-contact-groups/${smsContactGroup1Mock.id}/members/${smsContact1Mock.id}`,
      {...smsContactGroup1DetailMock, members: [smsContact2Mock]}
    ).as("removeMember");
    cy.intercept("GET", `/sms-contact-groups/${smsContactGroup1Mock.id}`, {
      ...smsContactGroup1DetailMock,
      memberCount: 1,
      members: [smsContact2Mock],
    }).as("getGroupDetailAfterRemove");
    cy.getByTestid(
      `remove-sms-contact-group-member-${smsContact1Mock.id}`
    ).click();
    cy.wait("@removeMember");
    cy.wait("@getGroupDetailAfterRemove");
    cy.contains("Contact retiré du groupe");
  });
});
