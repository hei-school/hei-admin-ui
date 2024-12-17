import {
  announcement1,
  announcementCreate,
  announcementsMock,
  createdAnnouncement,
} from "../fixtures/api_mocks/announcement-mocks";

describe("Manager announcements", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});

    cy.intercept("POST", `*/announcements`, createdAnnouncement);
    cy.intercept(
      "GET",
      `*/announcements?page=1&page_size=10`,
      announcementsMock
    ).as("getAnnouncements");

    cy.get('[href="#/announcements"]').click();
  });

  it("can view announcements list", () => {
    cy.contains("Annonces");
    cy.contains(
      "Cliquez sur la carte pour accéder à l'annonce complète et découvrir tous les détails pertinents."
    );
  });

  it("can show an announcement", () => {
    cy.contains(announcement1?.title!).click();
    cy.contains(announcement1?.title!);
    cy.contains(announcement1?.author?.email!);
  });

  it("can create an announcement", () => {
    cy.get('[data-testid="MoreVertIcon"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get("#title").type(announcementCreate?.title!);
    cy.get(".toastui-editor-ww-container > .toastui-editor > .ProseMirror")
      .type(announcementCreate?.content!)
      .as("Type the announcement content");

    cy.intercept(
      "GET",
      `*/announcements/${createdAnnouncement.id}`,
      createdAnnouncement
    );

    cy.contains("Enregistrer").click();
    cy.contains("Élément créé");
  });
});
