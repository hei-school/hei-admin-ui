import {StaffMember, WhoamiRoleEnum} from "@haapi/typescript-client";
import {lettersMocks, statsMocks} from "../fixtures/api_mocks/letters-mocks";
import {
  staffCreatedMock,
  staffMock,
  staffUpdatedMock,
} from "../fixtures/api_mocks/staffs-mock";

describe("Admin Staff", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept("GET", "/staff_members?page=1&page_size=10", staffMock).as(
      "getStaff"
    );
    cy.intercept("GET", "/staff_members?page=2&page_size=10", staffMock).as(
      "getStaff2"
    );
    cy.intercept("GET", `/staff_members/${staffMock[0].id}`, staffMock[0]).as(
      "getStaff1"
    );
    cy.intercept("PUT", "/staff_members", staffCreatedMock).as("createStaff");

    cy.intercept(
      "PUT",
      `/staff_members/${staffMock[0].id}`,
      staffUpdatedMock
    ).as("updateStaff");

    cy.intercept("GET", `/letters/stats`, statsMocks).as("getStats");
    cy.intercept(
      "GET",
      `/letters?page=1&page_size=12`,
      lettersMocks.slice(0)
    ).as("getAllLetters");

    cy.intercept("GET", "/staff_members/raw/xlsx", {
      statusCode: 200,
      headers: {
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": "attachment; filename=staff.xlsx",
      },
      body: "FAKE-EXCEL-CONTENT",
    }).as("exportStaff");
    cy.visit("/staffmembers");
  });

  it("should display staff list", () => {
    cy.contains("Liste des staffs de HEI").should("be.visible");
    cy.get(".staff-list .MuiTableBody-root.datagrid-body.RaDatagrid-tbody")
      .first()
      .contains(staffMock[0].ref!)
      .should("be.visible");
    cy.get(".staff-list .MuiTableBody-root.datagrid-body.RaDatagrid-tbody")
      .first()
      .contains(staffMock[0].first_name!)
      .should("be.visible");
    cy.get(".staff-list .MuiTableBody-root.datagrid-body.RaDatagrid-tbody")
      .first()
      .contains(staffMock[0].last_name!)
      .should("be.visible");
    cy.get(".staff-list .MuiTableBody-root.datagrid-body.RaDatagrid-tbody")
      .first()
      .contains(staffMock[0].function!)
      .should("be.visible");
    cy.getByTestid("edit-button").should("be.visible");
  });

  it("should display staff details", () => {
    cy.get(".staff-list .MuiTableBody-root.datagrid-body.RaDatagrid-tbody")
      .first()
      .contains(staffMock[0].first_name!)
      .click();
    cy.url().should("include", `/staffmembers/${staffMock[0].id}`);
    cy.wait("@getStaff1");
    cy.contains(staffMock[0].first_name!).should("be.visible");
    cy.contains(staffMock[0].last_name!).should("be.visible");
    cy.contains(staffMock[0].function!).should("be.visible");
    cy.contains(staffMock[0].email!).should("be.visible");
    cy.contains(staffMock[0].phone!).should("be.visible");
    cy.contains(staffMock[0].address!).should("be.visible");
    cy.contains(staffMock[0].cnaps!).should("be.visible");
    cy.contains(staffMock[0].ostie!).should("be.visible");
    cy.contains(staffMock[0].degree!).should("be.visible");
    cy.contains(staffMock[0].ref!).should("be.visible");
    cy.contains(staffMock[0].nic!).should("be.visible");
  });

  it("can update existing staff", () => {
    cy.getByTestid("edit-button").first().click();
    cy.get("#last_name").clear().type(staffUpdatedMock.last_name);
    cy.get("#nic").clear().type(staffUpdatedMock.nic);
    cy.getByTestid("SaveIcon").click();
    cy.wait("@updateStaff").then((interception) => {
      const body = interception.request.body as Required<StaffMember>[];
      expect(body).to.deep.equal(staffUpdatedMock);
    });
    cy.contains("Élément mis à jour").should("be.visible");
  });

  it("can create new staff", () => {
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.url().should("include", "/staffmembers/create");
    cy.get("#ref").clear().type(staffCreatedMock.ref);
    cy.get("#first_name").clear().type(staffCreatedMock.first_name);
    cy.get("#last_name").clear().type(staffCreatedMock.last_name);
    cy.get("#email").clear().type(staffCreatedMock.email);
    cy.get("#birth_date").clear().type("1998-05-12");
    cy.get("#birth_place").clear().type(staffCreatedMock.birth_place);
    cy.get("#coordinates\\.latitude")
      .clear()
      .type(staffCreatedMock.coordinates.latitude!.toString());
    cy.get("#coordinates\\.longitude")
      .clear()
      .type(staffCreatedMock.coordinates.longitude!.toString());
    cy.get("#nic").clear().type(staffCreatedMock.nic);
    cy.get("#address").clear().type(staffCreatedMock.address);
    cy.get("#phone").clear().type(staffCreatedMock.phone);
    cy.get("#cnaps").clear().type(staffCreatedMock.cnaps);
    cy.get("#ostie").clear().type(staffCreatedMock.ostie);
    cy.get("#function").clear().type(staffCreatedMock.function);
    cy.get("#degree").clear().type(staffCreatedMock.degree);
    cy.get("#entrance_datetime").clear().type("2025-04-08");
    cy.get("#ending_service").clear().type("2030-06-30");
    cy.getByTestid("SaveIcon").click();
    cy.wait("@createStaff").then((interception) => {
      expect(interception!.response!.statusCode).to.eq(200);
    });
  });

  it("can export staff list", () => {
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("download-button").click();
  });
});
