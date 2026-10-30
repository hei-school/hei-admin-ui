import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {
  complaintMock,
  complaintStatusHistoryMock,
} from "../fixtures/api_mocks/complaint-mock";
import {managersMock} from "../fixtures/api_mocks/managers-mocks";
import {staffMock} from "../fixtures/api_mocks/staffs-mock";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

describe("Complaints Manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept("GET", "/complaints?page=*&page_size=*", complaintMock).as(
      "getComplaints"
    );
    cy.intercept(
      "GET",
      `/complaints/${complaintMock[0].id}`,
      complaintMock[0]
    ).as("getComplaintDetails");
    cy.intercept(
      "GET",
      `/complaints/${complaintMock[0].id}/history?*`,
      complaintStatusHistoryMock
    ).as("getComplaintHistory");
    cy.visit("/complaints");
    cy.wait("@getComplaints");
  });

  it("should display the complaint list", () => {
    cy.contains(complaintMock[0].title!).should("be.visible");
    cy.contains(complaintMock[0].student?.first_name!).should("be.visible");
    cy.contains(complaintMock[0].student?.last_name!).should("be.visible");
  });

  it("should display the complaint details and status history", () => {
    cy.getByTestid("show-button").first().click();
    cy.wait("@getComplaintDetails");
    cy.wait("@getComplaintHistory");
    cy.contains(complaintMock[0].description!).should("be.visible");
    cy.contains(complaintStatusHistoryMock[1].comment!).should("be.visible");
  });

  it("should assign the complaint to a teacher", () => {
    cy.intercept("GET", "/staff_members?*", []).as("getStaffMembers");
    cy.intercept("GET", "/teachers?*", teachersMock).as("getTeachers");
    cy.intercept("GET", "/managers?*", managersMock).as("getManagers");
    cy.intercept(
      "PUT",
      `/complaints/${complaintMock[0].id}/assignees`,
      complaintMock[0]
    ).as("assignComplaint");

    cy.visit(`/complaints/${complaintMock[0].id}/show`);
    cy.wait("@getComplaintDetails");

    cy.getByTestid("assign-complaint").click();
    cy.get("input[type='text']").last().type(teachersMock[0].first_name!);
    cy.wait(["@getStaffMembers", "@getTeachers", "@getManagers"]);
    cy.contains(".MuiAutocomplete-popper li", teachersMock[0].first_name!)
      .first()
      .click();
    cy.contains("button", "Assigner").last().click();
    cy.wait("@assignComplaint");
    cy.contains("Réclamation assignée avec succès.").should("be.visible");
  });

  it("should filter the complaint list by responsable", () => {
    cy.intercept("GET", "/staff_members?*", staffMock).as("getStaffMembers");
    cy.intercept("GET", `/complaints?*assignee_id=${staffMock[0].id}*`, [
      complaintMock[1],
    ]).as("getComplaintsByAssignee");

    cy.getByTestid("filter-complaint-responsable")
      .find("input")
      .type(staffMock[0].first_name!);
    cy.wait("@getStaffMembers");
    cy.get(".MuiAutocomplete-popper li").first().click();
    cy.wait("@getComplaintsByAssignee");
    cy.contains(complaintMock[1].title!).should("be.visible");
  });

  it("should reject a complaint with a reason", () => {
    cy.intercept("PUT", `/complaints/${complaintMock[0].id}/status`, {
      ...complaintMock[0],
      status: "REJECTED",
    }).as("rejectComplaint");

    cy.visit(`/complaints/${complaintMock[0].id}/show`);
    cy.wait("@getComplaintDetails");

    cy.getByTestid("reject-complaint").click();
    cy.get("textarea").first().type("Réclamation non fondée");
    cy.contains("button", "Confirmer le rejet").click();
    cy.wait("@rejectComplaint");
    cy.contains("Réclamation rejetée.").should("be.visible");
  });
});
