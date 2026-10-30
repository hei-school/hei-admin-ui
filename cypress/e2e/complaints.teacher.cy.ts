import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {complaintMock} from "../fixtures/api_mocks/complaint-mock";

describe("Complaints Teacher", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
    cy.intercept("GET", "/complaints?page=*&page_size=*", complaintMock).as(
      "getComplaints"
    );
    cy.visit("/complaints");
    cy.wait("@getComplaints");
  });

  it("should display the complaint list", () => {
    cy.contains(complaintMock[0].title!).should("be.visible");
  });

  it("should only offer a status filter, no responsable filter", () => {
    cy.intercept("GET", "/complaints?*complaint_status=RESOLVED*", [
      complaintMock[1],
    ]).as("getResolvedComplaints");

    cy.getByTestid("filter-complaint-status").should("be.visible");
    cy.getByTestid("filter-complaint-responsable").should("not.exist");

    cy.getByTestid("filter-complaint-status").click();
    cy.get('[data-value="RESOLVED"]').click();
    cy.wait("@getResolvedComplaints");
  });
});
