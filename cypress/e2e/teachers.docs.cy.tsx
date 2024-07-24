import {heiDoc1, heiDocsMocks} from "../fixtures/api_mocks/docs-mocks";

describe("Hei.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", "/school/files?*", heiDocsMocks);
    cy.intercept("GET", `/school/files/${heiDoc1.id}`, heiDoc1);

    cy.login({role: "TEACHER"});

    cy.get('[data-testid="docs"]').click();
    cy.getByTestid("hei-docs").click();
  });

  it("can list hei docs", () => {
    cy.contains("Liste des documents chez HEI");
    cy.contains("Nom du fichier");
    cy.contains("Date de création");
    cy.contains("Afficher");

    cy.contains("Taille : " + heiDocsMocks.length);
  });
});
