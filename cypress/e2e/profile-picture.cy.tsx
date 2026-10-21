import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {admin1Mock} from "../fixtures/api_mocks/admins-mock";

const uploadRoute = {
  method: "POST",
  url: `**/admins/${admin1Mock.id}/picture/raw`,
};

const choosePhoto = (fixture: string) => {
  cy.getByTestid("upload-picture-button").click();
  cy.contains("Modifier la photo de profil");
  cy.contains("Photo en portrait (plus haute que large)");
  cy.get("[role='dialog'] input[type='file']").selectFile(
    `cypress/fixtures/${fixture}`,
    {force: true}
  );
  cy.get("[role='dialog']").contains("button", "Enregistrer").click();
};

describe("Profile picture", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
  });

  it("refuses a landscape photo before sending it", () => {
    cy.intercept(uploadRoute, cy.spy().as("uploadPicture"));

    choosePhoto("landscape-photo.png");

    cy.contains("La photo doit être en portrait (plus haute que large).");
    cy.get("@uploadPicture").should("not.have.been.called");
  });

  it("sends a portrait photo", () => {
    cy.intercept(uploadRoute, admin1Mock).as("uploadPicture");

    choosePhoto("portrait-photo.png");

    cy.wait("@uploadPicture");
    cy.contains("Photo mise à jour avec succès!").should("exist");
  });
});
