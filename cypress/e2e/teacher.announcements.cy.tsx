import {announcement1, announcementsMock, createdAnnouncement} from "../fixtures/api_mocks/announcement-mocks";

describe("Manager announcements", () => {
    beforeEach(() => {
        cy.login({role: "TEACHER"});
        
        cy.intercept('POST', `/announcements`, createdAnnouncement);
        cy.intercept('GET', `/teachers/announcements?page=1&page_size=10`, announcementsMock).as("getAnnouncements");
        
        cy.get('[href="#/announcements"]').click();
    });
    
    it("can view announcements list", () => {
        cy.contains("Annonces");
        cy.contains("Cliquez sur la carte pour accéder à l'annonce complète et découvrir tous les détails pertinents.")
    });

    it("can show an announcement", () => {
        cy.contains(announcement1?.title!).click();
        cy.contains(announcement1?.title!);
        cy.contains(announcement1?.author?.email!);
    })
})