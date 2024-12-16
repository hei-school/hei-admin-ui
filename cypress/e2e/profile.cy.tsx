import {Manager} from "@haapi/typescript-client";
import {toUTC} from "../../src/utils/date";
import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";

const editedManager1: Required<Manager> = {
  ...manager1Mock,
  first_name: "edited",
  birth_date: "1995-01-01",
  coordinates: {
    latitude: 400,
    longitude: 500,
  },
};

describe("Profil test", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
  });

  it("can edit profile", () => {
    cy.contains("Profil").click();
    cy.getByTestid("profile-edit-button").click();
    cy.get("#first_name").click().clear().type(editedManager1.first_name);
    cy.get("#birth_date").click().type(editedManager1.birth_date);
    cy.getByTestid("longitude-input")
      .click()
      .type(editedManager1.coordinates.longitude!.toString());
    cy.getByTestid("latitude-input")
      .click()
      .type(editedManager1.coordinates.latitude!.toString());

    cy.intercept("PUT", `*/managers/${manager1Mock.id}`, editedManager1).as(
      "modifyProfile"
    );

    cy.contains("Enregistrer").click();

    cy.wait("@modifyProfile").then((interceptedReq) => {
      const reqBody = interceptedReq.request.body;
      reqBody.entrance_datetime = new Date(reqBody.entrance_datetime);
      editedManager1.entrance_datetime = reqBody.entrance_datetime;
      editedManager1.birth_date = toUTC(
        new Date(editedManager1.birth_date)
      ).toISOString();
      expect(reqBody).to.deep.equal(editedManager1);
    });

    cy.contains("Élément mis à jour");
  });
});
