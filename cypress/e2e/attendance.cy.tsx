import {attendancesMock} from "../fixtures/api_mocks/attendances-mocks";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Attendance", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});

    cy.intercept("GET", `/attendance?page=1&page_size=10`, attendancesMock).as(
      "getPresencePage1"
    );
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudent"
    );
    cy.intercept("POST", `/attendance/movement`, {}).as(
      "CreateAttendanceMovement"
    );
    cy.visit("/attendance");
  });

  it("manager can see list of present", () => {
    cy.get("tbody tr").should("have.length", attendancesMock.length);
    cy.get("body").click();
  });

  it("manager can create attendance arrive", () => {
    cy.get('[href="#/attendance/create"]').click();

    cy.contains("button", "Arriver").click();
    cy.wait("@CreateAttendanceMovement");
    cy.contains("Présence réussie !").should("be.visible");
    cy.wait("@getPresencePage1");
  });

  it("manager can create attendance exit", () => {
    cy.get('[href="#/attendance/create"]').click();

    cy.contains("button", "Sortie").click();
    cy.wait("@CreateAttendanceMovement");
    cy.contains("Présence réussie !").should("be.visible");
    cy.wait("@getPresencePage1");
  });

  // TODO REFACTOR
  /* it('manager can create attendance eby scan', () => {
    navigateToAttendancePage();
    cy.get('[href="#/attendance/scan"]').click();
  });*/
});
