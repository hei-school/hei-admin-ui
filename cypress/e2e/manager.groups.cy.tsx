import {
  group1Mock,
  group1Student1Mock,
  group1Students,
  group2Mock,
  groupCreate,
  groupsMock,
  leaveGroupFlow,
  moveGroupFlow,
} from "../fixtures/api_mocks/groups-mocks";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.Group", () => {
  beforeEach(() => {
    cy.intercept("GET", "*/groups?*", groupsMock);

    cy.login({role: "MANAGER"});

    cy.get('[href="/groups"]').click();
  });

  it("can list groups", () => {
    cy.contains("Liste des groupes");
    cy.contains("Groupes");
    cy.contains("Étudiants");
    cy.contains("Femmes");
    cy.contains("Hommes");
    cy.get(".column-creation_datetime").contains("Date de création");
    cy.get(".column-ref").contains("Référence");
    cy.get(".column-name").contains("Nom");
  });

  it("can create a group", () => {
    cy.intercept("GET", `*/students?*`, studentsMock);
    cy.intercept(
      "GET",
      `*/groups/${groupCreate.id}/students?*`,
      group1Students
    );
    cy.intercept("PUT", "*/groups", [groupCreate]);
    cy.intercept("GET", `*/groups/${groupCreate.id}`, groupCreate);

    cy.contains("Créer").click();
    cy.get("#ref").click().type(groupCreate?.ref!);
    cy.get("#name").click().type(groupCreate?.name!);
    cy.get("#creation_datetime").click().type("2023-04-01");
    // click on the checkbox to select the student
    group1Students?.map((student) =>
      cy
        .get(
          `.MuiTableBody-root > :nth-child(${group1Students.indexOf(student) + 1}) > .MuiTableCell-paddingCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input`
        )
        .click()
    );

    cy.contains("Enregistrer").click({force: true});

    cy.contains("Élément créé");
  });

  it("can detail a group with its students", () => {
    cy.intercept("GET", `*/groups/${group1Mock.id}`, group1Mock);
    cy.intercept("GET", `*/groups/${group1Mock.id}/students?*`, group1Students);
    cy.intercept("GET", `*/students?*`, studentsMock);

    cy.contains(group1Mock.name).click();

    cy.contains("Les étudiants dans ce groupe");
    cy.get(".column-ref").contains("Référence");
  });

  it("can remove a student from a group", () => {
    cy.intercept("GET", `*/groups/${group1Mock.id}`, group1Mock);
    cy.intercept("GET", `*/groups/${group1Mock.id}/students?*`, group1Students);
    cy.intercept("GET", `*/students?*`, studentsMock);
    cy.intercept(
      "POST",
      `*/students/${group1Student1Mock.id}/group_flows`,
      leaveGroupFlow
    );

    cy.contains(group1Mock.name).click();

    cy.contains("Retirer").click();
    cy.get("#alert-dialog-title").contains("Supprimer un étudiant");
    cy.contains("Confirmer").click();
    cy.contains(`a été supprimé avec succès`);
  });

  it("can move a student to another group", () => {
    cy.intercept("GET", `*/groups/${group1Mock.id}`, group1Mock);
    cy.intercept("GET", `*/groups/${group1Mock.id}/students?*`, group1Students);
    cy.intercept("GET", `*/students?*`, studentsMock);
    cy.intercept(
      "POST",
      `*/students/${group1Student1Mock.id}/group_flows`,
      moveGroupFlow
    );

    cy.contains(group1Mock.name).click();

    cy.contains("Migrer").click();
    cy.get(".MuiInputBase-root").click(); // Choose a group
    cy.contains("Migrer un étudiant");
    cy.contains(group2Mock.ref).click();

    cy.contains("Envoyer").click();
    cy.contains(`a été migré avec succès`);
  });
});
