import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {admin1Mock} from "../fixtures/api_mocks/admins-mock";
import {
  smsContact1Mock,
  smsContact2Mock,
  smsContactGroup1DetailMock,
  smsContactGroup1Mock,
  smsContactGroupsMock,
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

  it("creates a new contact group with an initial member found by search", () => {
    cy.intercept("GET", "/sms-contacts?search=*", [smsContact2Mock]).as(
      "searchContacts"
    );
    cy.intercept("POST", "/sms-contact-groups", {
      id: "new_group_id",
      name: "Parents 2027",
      ownerId: admin1Mock.id,
      memberCount: 1,
    }).as("createGroup");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-sms-contact-group").click();
    cy.get("#name").type("Parents 2027");

    cy.getByTestid("sms-contact-search-contacts").type(smsContact2Mock.name!);
    cy.wait("@searchContacts");
    cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`)
      .should("be.visible")
      .click();

    cy.getByTestid("save-sms-contact-group").click();
    cy.wait("@createGroup")
      .its("request.body")
      .should("deep.equal", {
        name: "Parents 2027",
        contactIds: [smsContact2Mock.id],
      });
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
    cy.contains("Élément supprimé avec succès.").should("be.visible");
  });

  it("navigates to the group detail page and shows its members", () => {
    cy.intercept(
      {
        method: "GET",
        url: `/sms-contact-groups/${smsContactGroup1Mock.id}`,
        resourceType: "xhr",
      },
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
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

  it("requires at least 2 characters before searching contacts", () => {
    cy.intercept(
      {
        method: "GET",
        url: `/sms-contact-groups/${smsContactGroup1Mock.id}`,
        resourceType: "xhr",
      },
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
    cy.visit(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
    cy.wait("@getGroupDetail");

    cy.intercept("GET", "/sms-contacts?search=*", []).as("searchContacts");
    cy.getByTestid("sms-contact-search-input").type("T");
    cy.contains("Tapez au moins 2 caractères");
    cy.get("@searchContacts.all").should("have.length", 0);
  });

  it("checks multiple found contacts and adds them all in one action", () => {
    cy.intercept(
      {
        method: "GET",
        url: `/sms-contact-groups/${smsContactGroup1Mock.id}`,
        resourceType: "xhr",
      },
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
    cy.visit(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
    cy.wait("@getGroupDetail");

    cy.intercept("GET", "/sms-contacts?search=*", [smsContact2Mock]).as(
      "searchContacts"
    );
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

    cy.getByTestid("sms-contact-search-input").type(smsContact2Mock.name!);
    cy.wait("@searchContacts");
    cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`)
      .should("be.visible")
      .click();
    cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`)
      .find("input[type='checkbox']")
      .should("be.checked");
    cy.contains(smsContact2Mock.name!);

    cy.getByTestid("add-sms-contact-group-members")
      .should("contain", "Ajouter (1)")
      .should("be.enabled")
      .click();
    cy.wait("@addMember");
    cy.wait("@getGroupDetailAfterAdd");
    cy.contains("1 contact(s) ajouté(s) au groupe");
    cy.contains(smsContact2Mock.name!);
  });

  it("removes a member from the group", () => {
    cy.intercept(
      {
        method: "GET",
        url: `/sms-contact-groups/${smsContactGroup1Mock.id}`,
        resourceType: "xhr",
      },
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
    cy.visit(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
    cy.wait("@getGroupDetail");

    cy.intercept(
      "DELETE",
      `/sms-contact-groups/${smsContactGroup1Mock.id}/members/${smsContact1Mock.id}`,
      {...smsContactGroup1DetailMock, members: []}
    ).as("removeMember");
    cy.intercept("GET", `/sms-contact-groups/${smsContactGroup1Mock.id}`, {
      ...smsContactGroup1DetailMock,
      memberCount: 0,
      members: [],
    }).as("getGroupDetailAfterRemove");

    cy.getByTestid(
      `remove-sms-contact-group-member-${smsContact1Mock.id}`
    ).click();
    cy.get("#alert-dialog-title").should(
      "contain",
      "Retirer ce contact du groupe ?"
    );
    cy.get(".ra-confirm").click();
    cy.wait("@removeMember");
    cy.wait("@getGroupDetailAfterRemove");
    cy.contains("Contact retiré du groupe");
    cy.contains("Ce groupe n'a aucun membre pour le moment.");
  });

  it("does not remove a member when the confirmation is cancelled", () => {
    cy.intercept(
      {
        method: "GET",
        url: `/sms-contact-groups/${smsContactGroup1Mock.id}`,
        resourceType: "xhr",
      },
      smsContactGroup1DetailMock
    ).as("getGroupDetail");
    cy.visit(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
    cy.wait("@getGroupDetail");

    cy.intercept(
      "DELETE",
      `/sms-contact-groups/${smsContactGroup1Mock.id}/members/${smsContact1Mock.id}`
    ).as("removeMember");

    cy.getByTestid(
      `remove-sms-contact-group-member-${smsContact1Mock.id}`
    ).click();
    cy.get("#alert-dialog-title").should("be.visible");
    cy.contains("button", "Annuler").click();
    cy.get("@removeMember.all").should("have.length", 0);
    cy.contains(smsContact1Mock.name!);
  });
});
