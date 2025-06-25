import {
  announcement1,
  announcementsMock,
  createdAnnouncement,
} from "../fixtures/api_mocks/announcement-mocks";

describe("Student announcements", () => {
  beforeEach(() => {
    cy.mockLogin({role: "STUDENT"});

    cy.intercept("POST", `/announcements`, createdAnnouncement);
    cy.intercept(
      "GET",
      `/students/announcements?page=1&page_size=12`,
      announcementsMock
    ).as("getAnnouncements");
    cy.intercept(
      "GET",
      `/students/announcements?page=2&page_size=12`,
      announcementsMock
    ).as("getAnnouncements2");

    cy.intercept(
      "GET",
      `students/announcements/${announcement1.id}`,
      announcement1
    ).as("getOneAnnoncement");

    cy.intercept("PUT", `/announcements/${announcement1.id}/reaction`, {
      id: announcement1.id,
      reaction: "UNCHECK",
    }).as("updateReaction");

    cy.get('[href="/announcements"]').click();
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

  it("Can react to an annoucement", () => {
    cy.contains(announcement1?.title!).click();
    cy.get("#reaction").click();
    cy.wait("@updateReaction").its("response.statusCode").should("eq", 200);
    cy.contains("Réaction mise à jour avec succès");
  });
});
