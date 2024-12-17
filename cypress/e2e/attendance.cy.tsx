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
    cy.intercept("POST", `/attendance/movement`, (req) => {
      req.reply({
        statusCode: 201,
        body: {
          ...req.body,
          id: attendancesMock.length + 1,
        },
      });
    }).as("CreateAttendanceMovement");
  });

  const navigateToAttendancePage = () => {
    cy.get('[href="#/attendance"]').first().click();
  };

  it("manager can see list of present", () => {
    navigateToAttendancePage();
    cy.get("tbody tr").should("have.length", attendancesMock.length);
    cy.get("body").click();
  });

  it("manager can create attendance arrive", () => {
    navigateToAttendancePage();
    cy.get('[href="#/attendance/create"]').click();

    cy.contains("button", "Arriver").click();
    cy.wait("@CreateAttendanceMovement");
    cy.contains("Présence réussie !").should("be.visible");
    cy.wait("@getPresencePage1");

    navigateToAttendancePage();
    cy.get("tbody tr").should("have.length", attendancesMock.length);
  });

  it("manager can create attendance exit", () => {
    navigateToAttendancePage();
    cy.get('[href="#/attendance/create"]').click();

    cy.contains("button", "Sortie").click();
    cy.wait("@CreateAttendanceMovement");
    cy.contains("Présence réussie !").should("be.visible");
    cy.wait("@getPresencePage1");

    navigateToAttendancePage();
    cy.get("tbody tr").should("have.length", attendancesMock.length);
  });

  // TODO REFACTOR
  /* it('manager can create attendance eby scan', () => {
    navigateToAttendancePage();
    cy.get('[href="#/attendance/scan"]').click();
  });*/
});
