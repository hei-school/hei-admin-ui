import {fee1Mock, feesMock} from "../fixtures/api_mocks/fees-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.Fee.Archive", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `/students?page=*&page_size=*&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept("GET", `/students/${student1Mock.id}/level`, "L1").as(
      "getStudentLevel"
    );
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.wait("@getStudents");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
  });

  it("can archive a fee", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFees2");
    cy.intercept(
      "PATCH",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      {}
    ).as("archiveFee");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    )
      .find('[data-testid="archive-button-confirm"]')
      .click();
    cy.get("#alert-dialog-title").should("contain", "Archivage de frais");
    cy.contains("Confirmez-vous l'archivage de ce frais ?");
    cy.get(".ra-confirm").click();
    cy.wait("@archiveFee");
    cy.contains("Frais archivé avec succès.");
  });

  it("disables the archive button for an already archived fee", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      [{...fee1Mock, is_archived: true}, ...feesMock.slice(1)]
    ).as("getFeesArchived");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=10`,
      feesMock
    ).as("getFeesArchived2");
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFeesArchived");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    )
      .find('[data-testid="archive-button-confirm"]')
      .should("be.disabled");
  });
});
