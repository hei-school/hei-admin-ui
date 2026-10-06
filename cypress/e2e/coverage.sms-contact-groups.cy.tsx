import {
  SmsContactGroup,
  SmsContactGroupDetail,
  WhoamiRoleEnum,
} from "@haapi-b0fc7615/typescript-client";
import {admin1Mock} from "../fixtures/api_mocks/admins-mock";
import {
  smsCoverageBareMemberMock,
  smsCoverageGroupDetailWithMemberWithoutIdMock,
  smsCoverageGroupDetailWithoutNameMock,
  smsCoverageGroupFilledMock,
  smsCoverageGroupsForListMock,
  smsCoverageGroupWithoutNameMock,
  smsCoverageGroupWithoutOwnerMock,
  smsCoverageMemberWithoutIdMock,
  smsCoverageNamedMemberMock,
  smsCoverageRefOnlyOwnerMock,
  smsCoverageSearchContactMock,
} from "../fixtures/api_mocks/sms-coverage-mocks";
import {
  smsContact1Mock,
  smsContact2Mock,
  smsContactGroup1DetailMock,
  smsContactGroup1Mock,
} from "../fixtures/api_mocks/sms-mocks";
import {
  mockSmsCoverageSideEffects,
  navigateInApp,
} from "../support/sms-coverage-helpers";

const SEARCH_CONTACTS_URL = /\/sms-contacts\?.*search=/;
const GROUP_LIST_URL = "/sms-contact-groups?page=1&page_size=10";

const interceptGroupDetail = (
  detail: SmsContactGroupDetail,
  alias = "getGroupDetail",
  delay = 0
) =>
  cy
    .intercept(
      {
        method: "GET",
        url: `/sms-contact-groups/${detail.id}`,
        resourceType: "xhr",
      },
      {delay, body: detail}
    )
    .as(alias);

const visitGroupList = (groups: SmsContactGroup[]) => {
  cy.intercept("GET", GROUP_LIST_URL, groups).as("getGroups");
  navigateInApp("/sms-contact-groups");
  cy.wait("@getGroups");
  cy.get("table tbody tr").should("have.length", groups.length);
};

describe("Coverage.SmsContactGroups", () => {
  beforeEach(() => {
    mockSmsCoverageSideEffects();
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
    cy.intercept("GET", `/admins/${admin1Mock.id}`, admin1Mock).as(
      "getAdminOwner"
    );
    cy.intercept(
      "GET",
      `/admins/${smsCoverageRefOnlyOwnerMock.id}`,
      smsCoverageRefOnlyOwnerMock
    ).as("getRefOnlyOwner");
  });

  describe("group list", () => {
    it("shows a dash without any owner lookup when the group has no owner, and a zero member chip", () => {
      visitGroupList(smsCoverageGroupsForListMock);
      cy.wait("@getAdminOwner");
      cy.get("table tbody tr")
        .eq(0)
        .should("contain", smsCoverageGroupWithoutOwnerMock.name)
        .and("contain", "—")
        .and("contain", "0");
      cy.get("table tbody tr")
        .eq(0)
        .find(".MuiChip-colorDefault")
        .should("exist");
      cy.get("table tbody tr")
        .eq(1)
        .should("contain", "3")
        .and("contain", `${admin1Mock.ref} — ${admin1Mock.first_name}`)
        .find(".MuiChip-colorPrimary")
        .should("exist");
    });

    it("shows a skeleton while the owner is loading, then the owner reference only", () => {
      cy.intercept("GET", `/admins/${smsCoverageRefOnlyOwnerMock.id}`, {
        delay: 1500,
        body: smsCoverageRefOnlyOwnerMock,
      }).as("getSlowOwner");
      visitGroupList([smsCoverageGroupWithoutNameMock]);
      cy.get("table tbody tr").eq(0).find(".MuiSkeleton-root").should("exist");
      cy.wait("@getSlowOwner");
      cy.get("table tbody tr")
        .eq(0)
        .should("contain", smsCoverageRefOnlyOwnerMock.ref)
        .and("not.contain", " — ")
        .find(".MuiSkeleton-root")
        .should("not.exist");
    });

    it("opens a group with its view button", () => {
      interceptGroupDetail({
        ...smsCoverageGroupFilledMock,
        members: [smsContact1Mock],
      });
      visitGroupList(smsCoverageGroupsForListMock);
      cy.getByTestid(
        `view-sms-contact-group-${smsCoverageGroupFilledMock.id}`
      ).click();
      cy.wait("@getGroupDetail");
      cy.routePathnameEq(
        `/sms-contact-groups/${smsCoverageGroupFilledMock.id}`
      );
      cy.contains("h5", smsCoverageGroupFilledMock.name!).should("be.visible");
    });

    it("closes the creation dialog with its close icon without creating anything", () => {
      cy.intercept("POST", "/sms-contact-groups", {
        statusCode: 500,
        body: {},
      }).as("createGroup");
      visitGroupList(smsCoverageGroupsForListMock);
      cy.getByTestid("menu-list-action").click();
      cy.getByTestid("create-sms-contact-group").click();
      cy.contains("Créer un groupe de contacts")
        .should("be.visible")
        .find("button")
        .click();
      cy.contains("Créer un groupe de contacts").should("not.exist");
      cy.get("@createGroup.all").should("have.length", 0);
    });

    it("requires a group name before saving", () => {
      cy.intercept("GET", SEARCH_CONTACTS_URL, [smsContact2Mock]).as(
        "searchContacts"
      );
      cy.intercept("POST", "/sms-contact-groups", {
        statusCode: 500,
        body: {},
      }).as("createGroup");
      visitGroupList(smsCoverageGroupsForListMock);
      cy.getByTestid("menu-list-action").click();
      cy.getByTestid("create-sms-contact-group").click();
      cy.getByTestid("save-sms-contact-group").should("be.disabled");
      cy.getByTestid("sms-contact-search-contacts").type("Test");
      cy.wait("@searchContacts");
      cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`).click();
      cy.getByTestid("save-sms-contact-group").should("be.enabled").click();
      cy.get("#name").should("have.attr", "aria-invalid", "true");
      cy.contains("Ce champ est requis").should("be.visible");
      cy.get("@createGroup.all").should("have.length", 0);
    });

    it("ignores an owner answer that arrives after the group list was left", () => {
      cy.intercept("GET", `/admins/${admin1Mock.id}`, {
        delay: 4000,
        body: admin1Mock,
      }).as("getSlowAdminOwner");
      interceptGroupDetail({
        ...smsCoverageGroupFilledMock,
        members: [smsContact1Mock],
      });
      visitGroupList(smsCoverageGroupsForListMock);
      cy.get("table tbody tr").eq(1).find(".MuiSkeleton-root").should("exist");
      cy.getByTestid(
        `view-sms-contact-group-${smsCoverageGroupFilledMock.id}`
      ).click();
      cy.wait("@getGroupDetail");
      cy.get("table").should("not.exist");
      cy.wait("@getSlowAdminOwner");
      cy.contains("h5", smsCoverageGroupFilledMock.name!).should("be.visible");
      cy.contains(
        `Propriétaire : ${admin1Mock.ref} — ${admin1Mock.first_name}`
      ).should("be.visible");
    });

    it("creates a group with two initial members, refreshes the list and closes the dialog", () => {
      cy.intercept("GET", SEARCH_CONTACTS_URL, [
        smsContact2Mock,
        smsCoverageSearchContactMock,
      ]).as("searchContacts");
      cy.intercept("POST", "/sms-contact-groups", {
        id: "sms_cov_new_group_id",
        name: "Équipe pédagogique",
        ownerId: admin1Mock.id,
        memberCount: 2,
      }).as("createGroup");
      visitGroupList(smsCoverageGroupsForListMock);
      cy.getByTestid("menu-list-action").click();
      cy.getByTestid("create-sms-contact-group").click();
      cy.get("#name").type("Équipe pédagogique");
      cy.getByTestid("sms-contact-search-contacts").type("Test");
      cy.wait("@searchContacts");
      cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`).click();
      cy.getByTestid(
        `toggle-sms-contact-${smsCoverageSearchContactMock.id}`
      ).click();
      cy.get("[role='dialog'] .MuiChip-root").should("have.length", 2);

      cy.getByTestid("save-sms-contact-group").click();
      cy.wait("@createGroup")
        .its("request.body")
        .should("deep.equal", {
          name: "Équipe pédagogique",
          contactIds: [smsContact2Mock.id, smsCoverageSearchContactMock.id],
        });
      cy.contains("Groupe créé avec succès").should("be.visible");
      cy.wait("@getGroups");
      cy.contains("Créer un groupe de contacts").should("not.exist");
    });
  });

  describe("group detail", () => {
    it("shows a spinner while loading, then fallbacks for a group without name and a bare member", () => {
      interceptGroupDetail(
        smsCoverageGroupDetailWithoutNameMock,
        "getGroupDetail",
        1500
      );
      navigateInApp(
        `/sms-contact-groups/${smsCoverageGroupWithoutNameMock.id}`
      );
      cy.get(".MuiCircularProgress-root").should("be.visible");
      cy.wait("@getGroupDetail");
      cy.get(".MuiCircularProgress-root").should("not.exist");
      cy.wait("@getRefOnlyOwner");

      cy.contains("Groupe").should("be.visible");
      cy.contains("2 membre(s)").should("be.visible");
      cy.contains(`Propriétaire : ${smsCoverageRefOnlyOwnerMock.ref}`)
        .should("be.visible")
        .and("not.contain", " — ");
      cy.getByTestid(
        `remove-sms-contact-group-member-${smsCoverageBareMemberMock.id}`
      )
        .parents(".MuiBox-root")
        .first()
        .should("contain", "—");
      cy.contains(
        `${smsCoverageNamedMemberMock.phoneNumber} — Étudiant`
      ).should("be.visible");
    });

    it("asks to remove 'ce contact' for a member without a name and cancels by closing", () => {
      interceptGroupDetail(smsCoverageGroupDetailWithoutNameMock);
      cy.intercept(
        "DELETE",
        `/sms-contact-groups/${smsCoverageGroupWithoutNameMock.id}/members/*`
      ).as("removeMember");
      navigateInApp(
        `/sms-contact-groups/${smsCoverageGroupWithoutNameMock.id}`
      );
      cy.wait("@getGroupDetail");
      cy.getByTestid(
        `remove-sms-contact-group-member-${smsCoverageBareMemberMock.id}`
      ).click();
      cy.contains(
        "Voulez-vous vraiment retirer ce contact de ce groupe ?"
      ).should("be.visible");
      cy.get("body").type("{esc}");
      cy.get("#alert-dialog-title").should("not.exist");
      cy.get("@removeMember.all").should("have.length", 0);
    });

    it("does not call the API when confirming the removal of a member without identifier", () => {
      interceptGroupDetail(smsCoverageGroupDetailWithMemberWithoutIdMock);
      cy.intercept(
        "DELETE",
        `/sms-contact-groups/${smsCoverageGroupFilledMock.id}/members/*`
      ).as("removeMember");
      navigateInApp(`/sms-contact-groups/${smsCoverageGroupFilledMock.id}`);
      cy.wait("@getGroupDetail");
      cy.getByTestid("remove-sms-contact-group-member-undefined").click();
      cy.contains(
        `Voulez-vous vraiment retirer ${smsCoverageMemberWithoutIdMock.name} de ce groupe ?`
      ).should("be.visible");
      cy.get(".ra-confirm").click();
      cy.get("#alert-dialog-title").should("not.exist");
      cy.get("@removeMember.all").should("have.length", 0);
      cy.contains(smsCoverageMemberWithoutIdMock.name!).should("be.visible");
    });

    it("shows the bare error message when the removal fails without detail", () => {
      interceptGroupDetail(smsContactGroup1DetailMock);
      cy.intercept(
        "DELETE",
        `/sms-contact-groups/${smsContactGroup1Mock.id}/members/${smsContact1Mock.id}`,
        {statusCode: 500, body: {}}
      ).as("removeMemberError");
      navigateInApp(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
      cy.wait("@getGroupDetail");
      cy.getByTestid(
        `remove-sms-contact-group-member-${smsContact1Mock.id}`
      ).click();
      cy.get(".ra-confirm").click();
      cy.wait("@removeMemberError");
      cy.contains(
        ".MuiSnackbarContent-message",
        "Erreur lors du retrait du contact"
      )
        .should("be.visible")
        .and("not.contain", " : ");
      cy.contains(smsContact1Mock.name!).should("be.visible");
    });

    it("hides existing members from the search, shows the searching state and toggles a selection on and off", () => {
      interceptGroupDetail(smsContactGroup1DetailMock);
      cy.intercept("GET", SEARCH_CONTACTS_URL, {
        delay: 1500,
        body: [smsContact1Mock, smsContact2Mock],
      }).as("searchContacts");
      navigateInApp(`/sms-contact-groups/${smsContactGroup1Mock.id}`);
      cy.wait("@getGroupDetail");

      cy.getByTestid("add-sms-contact-group-members")
        .should("contain", "Ajouter (0)")
        .and("be.disabled");
      cy.getByTestid("sms-contact-search-input").type("Test");
      cy.contains("Recherche…").should("be.visible");
      cy.wait("@searchContacts");
      cy.getByTestid(`toggle-sms-contact-${smsContact1Mock.id}`).should(
        "not.exist"
      );

      cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`).click();
      cy.contains("Contacts sélectionnés").should("be.visible");
      cy.contains(
        ".MuiChip-root",
        `${smsContact2Mock.name} — ${smsContact2Mock.phoneNumber}`
      ).should("be.visible");
      cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`).click();
      cy.contains("Contacts sélectionnés").should("not.exist");

      cy.getByTestid(`toggle-sms-contact-${smsContact2Mock.id}`).click();
      cy.contains(".MuiChip-root", smsContact2Mock.name!)
        .find(".MuiChip-deleteIcon")
        .click();
      cy.contains("Contacts sélectionnés").should("not.exist");
      cy.getByTestid("add-sms-contact-group-members").should("be.disabled");
    });
  });
});
