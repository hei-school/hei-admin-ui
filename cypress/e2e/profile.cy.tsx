import {toUTC} from "../../src/utils/date";
import {editedManager1, manager1Mock} from "../fixtures/managers-mocks";

describe("Profil test", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
  });

  it("can edit profile", () => {
    cy.contains("Profil").click();
    cy.getByTestid("profile-edit-button").click();
    cy.get("#last_name").click().clear().type(editedManager1.first_name);
    cy.get("#birth_date").click().type(editedManager1.birth_date);
    cy.getByTestid("longitude-input")
      .click()
      .type(editedManager1.coordinates.longitude!.toString());
    cy.getByTestid("latitude-input")
      .click()
      .type(editedManager1.coordinates.latitude!.toString());

    cy.intercept("PUT", `/managers/${manager1Mock.id}`, editedManager1).as(
      "modifyProfile"
    );

    cy.contains("Enregistrer").click();

    // it doesn't work yet

    // cy.wait("@modifyProfile").then((interceptedReq) => {
    //   const reqBody = interceptedReq.request.body;
    //   const sortObject = (obj: any) => {
    //     return Object.keys(obj)
    //       .sort()
    //       .reduce((sortedObj, key) => {
    //         // @ts-ignore
    //         sortedObj[key] = obj[key];
    //         return sortedObj;
    //       }, {});
    //   };
    //   reqBody.entrance_datetime = new Date(reqBody.entrance_datetime)
    //   editedManager1.entrance_datetime = new Date(editedManager1.entrance_datetime)
    //   editedManager1.birth_date = toUTC(
    //     new Date(editedManager1.birth_date)
    //   ).toISOString();
    //   expect(JSON.stringify(sortObject(reqBody))).to.equal(
    //     JSON.stringify(sortObject(editedManager1))
    //   );
    // });

    cy.contains("Élément mis à jour");
  });
});
