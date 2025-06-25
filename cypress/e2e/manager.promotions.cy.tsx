import {
  CrupdatePromotion,
  UpdatePromotionSGroup,
} from "@haapi/typescript-client";
import {groupsMock} from "../fixtures/api_mocks/groups-mocks";
import {
  promotion1Mock,
  promotionsMock,
} from "../fixtures/api_mocks/promotions-mocks";

const promotion2Mock = promotionsMock[1];

const NEW_PROMOTION: CrupdatePromotion = {
  name: "new name",
  ref: "new ref",
};

const INSERT_API: UpdatePromotionSGroup = {
  type: "ADD",
  group_ids: promotionsMock[1].groups.map((group) => group.id!),
};

const MIGRATE_API: UpdatePromotionSGroup = {
  type: "ADD",
  group_ids: [promotion1Mock.groups[0].id!],
};

const LEAVE_API: UpdatePromotionSGroup = {
  type: "REMOVE",
  group_ids: [promotion1Mock.groups[0].id!],
};

describe("Manager.Promotions", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.intercept("GET", `/groups?*`, groupsMock).as("getGroups");
    cy.intercept("GET", `/promotions?page=1&page_size=10`, promotionsMock).as(
      "getPromotionsPage1"
    );
    cy.intercept("GET", `/promotions?page=1&page_size=499`, promotionsMock).as(
      "getPromotionsPage1Many"
    );
    cy.intercept("GET", `/promotions?page=2&page_size=499`, promotionsMock).as(
      "getPromotionsPage2Many"
    );
    cy.intercept("GET", `/promotions?page=2&page_size=10`, promotionsMock).as(
      "getPromotionsPage2"
    );
    cy.inteceptMockByOne("groups", groupsMock);
    cy.intercept("GET", `/promotions/${promotion1Mock.id}`, promotion1Mock).as(
      "getPromotion1"
    );
    cy.getByTestid("promotions-menu").click();
    cy.wait(1000);
    cy.wait("@getPromotionsPage1");
    cy.intercept(
      "GET",
      `/groups/${promotion1Mock?.groups[0]?.id!}`,
      groupsMock[0]
    );
    cy.intercept(
      "GET",
      `/groups/${promotion1Mock?.groups[1]?.id!}`,
      groupsMock[1]
    );
  });

  it("can list all promotions and details one promotion", () => {
    cy.intercept(
      "GET",
      `/promotions?page=1&page_size=10?name=${promotion1Mock.name}`,
      [promotion1Mock]
    ).as("getFilteredPromotions");
    cy.intercept(
      "GET",
      `/promotions?page=2&page_size=10?name=${promotion1Mock.name}`,
      [promotion1Mock]
    ).as("getFilteredPromotions2");
    cy.get("tbody tr").should("have.length", promotionsMock.length);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("promotion-name-filter").type(promotion1Mock.name);
    cy.getByTestid("apply-filter").type(promotion1Mock.name);

    cy.wait("@getFilteredPromotions");
    cy.contains(promotion1Mock.name).click();
    cy.wait("@getPromotion1");
    cy.contains(promotion1Mock.name);
    cy.contains(promotion1Mock.ref);
    cy.get("tbody tr").should("have.length", promotion1Mock.groups.length);
  });

  it("can create new promotion", () => {
    cy.intercept("PUT", "/promotions", NEW_PROMOTION).as("createPromotion");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.get("#name").type(NEW_PROMOTION.name!);
    cy.get("#ref").type(NEW_PROMOTION.ref!);
    cy.get(".RaToolbar-defaultToolbar > .MuiButtonBase-root")
      .as("saveButton")
      .click();

    cy.wait("@createPromotion").then((intereception) => {
      const body = intereception.request.body as CrupdatePromotion;
      NEW_PROMOTION.id = body.id;
      expect(body).to.deep.equal(NEW_PROMOTION);
    });
  });

  it("can edit promotion", () => {
    cy.get("tbody tr")
      .should("have.length", promotionsMock.length)
      .first()
      .click();
    cy.wait("@getPromotion1");
    cy.intercept("PUT", "/promotions").as("editPromotion");
    cy.getByTestid("edit-button").click();
    cy.get("#name").clear().type(NEW_PROMOTION.name!);
    cy.get("#ref").clear().type(NEW_PROMOTION.ref!);
    cy.get('form > .MuiToolbar-root > [data-testid="edit-button"]')
      .as("saveButton")
      .click();
    cy.wait("@editPromotion").then((intereception) => {
      const body = intereception.request.body as CrupdatePromotion;
      NEW_PROMOTION.id = body.id;
      expect(body).to.deep.equal(NEW_PROMOTION);
    });
  });

  it.skip("can remove one group from promotion", () => {
    cy.get("tbody tr")
      .should("have.length", promotionsMock.length)
      .first()
      .click();
    cy.wait("@getPromotion1");
    cy.intercept(
      "PUT",
      `/promotions/${promotion1Mock?.id!}/groups`,
      promotion1Mock
    ).as("removeGroup");
    cy.getByTestid("leave-button").first().click();
    cy.get(".ra-confirm").click();

    cy.wait("@removeGroup").then((intercept) => {
      const body = intercept.request.body;
      expect(body).to.deep.equal(LEAVE_API);
    });
    cy.contains(
      `Le groupe ${promotion1Mock?.groups[0]?.ref!} a été retiré avec succès`
    );
  });

  it("can migrate one groups from promotion", () => {
    cy.get("tbody tr")
      .should("have.length", promotionsMock?.length)
      .first()
      .click();
    cy.wait("@getPromotion1");
    cy.intercept(
      "PUT",
      `/promotions/${promotion2Mock.id}/groups`,
      promotion2Mock
    ).as("migrateGroup");
    cy.getByTestid("migrate-button").first().click();
    cy.getByTestid("migrate-autocomplete").click();
    cy.contains(promotion2Mock?.ref!).click();
    cy.getByTestid("save-flows-button").click();

    cy.wait("@migrateGroup").then((intercept) => {
      const body = intercept.request.body;
      expect(body).to.deep.equal(MIGRATE_API);
    });
    cy.contains(
      `Le groupe ${promotion1Mock?.groups[0]?.ref!} a été migré avec succès`
    );
  });

  it.skip("can insert new groups to the promotion", () => {
    cy.get("tbody tr")
      .should("have.length", promotionsMock?.length!)
      .first()
      .click();
    cy.wait("@getPromotion1");
    cy.intercept(
      "PUT",
      `/promotions/${promotion1Mock.id}/groups`,
      promotion1Mock
    ).as("insertGroups");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("insert-button").click();
    cy.getByTestid("insert-autocomplete").click();
    cy.contains(promotion2Mock?.groups[0]?.ref!).click();
    cy.getByTestid("insert-autocomplete").click();
    cy.contains(promotion2Mock?.groups[1]?.ref!).click();
    cy.getByTestid("save-flows-button").click();

    cy.wait("@insertGroups").then((intercept) => {
      const body = intercept.request.body;
      expect(body).to.deep.equal(INSERT_API);
    });
    cy.contains("Tous les groupes ont été insérés avec succès!");
  });
});
