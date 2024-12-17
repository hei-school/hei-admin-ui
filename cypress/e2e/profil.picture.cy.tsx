import {
  badPicManager,
  updatedManager,
  withPicManager,
} from "../fixtures/api_mocks/profil-mocks";

describe("Profile picture test", () => {
  it("should fallback to default source when profile_pic is falsy", () => {
    cy.login({role: "MANAGER"});
    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", "blank-profile-photo");
  });

  it("should have the right source when profile_pic is ok", () => {
    cy.login({role: "MANAGER", user: withPicManager()});
    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", withPicManager().profile_picture);
  });

  it("should fallback to default source when profile_pic cannot be fetched", () => {
    cy.login({role: "MANAGER", user: badPicManager()});
    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", "blank-profile-photo");
  });

  it("can edit the profile picture", () => {
    cy.login({role: "MANAGER", user: withPicManager()});
    cy.getByTestid("upload-picture-button").click();
    cy.getByTestid("dropzone").selectFile(
      "cypress/fixtures/profile_picture/profile-picture.png",
      {action: "drag-drop"}
    );
    cy.intercept(
      "POST",
      `*/managers/${updatedManager().id}/picture/raw`,
      updatedManager()
    ).as("getManager");
    cy.intercept(
      "GET",
      `*/managers/${updatedManager().id}`,
      updatedManager()
    ).as("getManager");

    cy.contains("Enregistrer").click();
    cy.wait("@getManager");
    cy.getByTestid("profile-pic")
      .should("have.attr", "src")
      .and("include", updatedManager().profile_picture);
  });
});
