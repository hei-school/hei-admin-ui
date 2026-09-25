import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  smsContact1Mock,
  smsContact2Mock,
  smsContactGroupsMock,
  smsContactsMock,
} from "../fixtures/api_mocks/sms-mocks";

describe("Manager.SmsContacts", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept(
      "GET",
      "/sms-contacts?page=1&page_size=10",
      smsContactsMock
    ).as("getContacts");
    cy.intercept(
      "GET",
      "/sms-contact-groups?page=1&page_size=500",
      smsContactGroupsMock
    );
    cy.visit("/sms-contacts");
    cy.wait("@getContacts");
  });

  it("lists the contacts with their owner reference and role", () => {
    cy.get("table tbody tr").should("have.length", 2);
    cy.get("table tbody tr")
      .eq(0)
      .should("contain", smsContact1Mock.name)
      .and("contain", smsContact1Mock.phoneNumber)
      .and("contain", smsContact1Mock.ownerRef)
      .and("contain", "Étudiant");
    cy.get("table tbody tr").eq(1).should("contain", "Enseignant");
  });

  it("filters the contacts by owner role", () => {
    cy.intercept(
      "GET",
      "/sms-contacts?owner_role=STUDENT&page=1&page_size=10",
      [smsContact1Mock]
    ).as("getStudentContacts");
    cy.contains(".MuiFormControl-root", "Rôle")
      .find(".MuiSelect-select")
      .click();
    cy.get("ul[role='listbox'] li").contains("Étudiant").click();
    cy.wait("@getStudentContacts");
    cy.get("table tbody tr").should("have.length", 1);
  });

  it("deletes a contact from the address book", () => {
    cy.intercept(
      "DELETE",
      `/sms-contacts/${smsContact2Mock.id}`,
      smsContact2Mock
    ).as("deleteContact");
    cy.get("table tbody tr")
      .eq(1)
      .find("button[data-testid='delete-button-confirm']")
      .click();
    cy.get("#alert-dialog-title").should(
      "contain",
      "Retirer ce contact du carnet d'adresses SMS ?"
    );
    cy.get(".ra-confirm").click();
    cy.wait("@deleteContact");
    cy.contains("Élément supprimé avec succès.");
  });
});
