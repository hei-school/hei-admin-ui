import {student1LettersMocks} from "../fixtures/api_mocks/letters-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Student.Attendance", () => {
  const studentAttendanceMock = [
    {
      id: "attendance_1",
      attendance_status: "MISSING",
      title: "PROG1 - Algorithmique",
      description: "Cours sur les algorithmes de tri",
      begin_datetime: "2025-04-10T08:00:00Z",
      end_datetime: "2025-04-10T10:00:00Z",
      event_type: "COURSE",
      location: {room: "A101", place: "ANDRAHARO"},
    },
    {
      id: "attendance_2",
      attendance_status: "PRESENT",
      title: "WEB1 - Développement Web",
      description: "Introduction à React",
      begin_datetime: "2025-04-11T10:00:00Z",
      end_datetime: "2025-04-11T12:00:00Z",
      event_type: "COURSE",
      location: {room: "B202", place: "ANDRAHARO"},
    },
    {
      id: "attendance_3",
      attendance_status: "LATE",
      title: "MATH2 - Mathématiques",
      description: "Algèbre linéaire",
      begin_datetime: "2025-04-12T14:00:00Z",
      end_datetime: "2025-04-12T16:00:00Z",
      event_type: "COURSE",
      location: {room: "C303", place: "ANDRAHARO"},
    },
    {
      id: "attendance_4",
      attendance_status: "MISSING",
      title: "Examen PROG1",
      description: "Examen final",
      begin_datetime: "2025-04-13T08:00:00Z",
      end_datetime: "2025-04-13T10:00:00Z",
      event_type: "EXAM",
      location: {room: "D404", place: "ANDRAHARO"},
    },
  ];

  beforeEach(() => {
    cy.mockLogin({role: "STUDENT", user: student1Mock});

    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudentProfile"
    );

    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/attendance?**`,
      studentAttendanceMock
    ).as("getStudentAttendance");

    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/letters?**`,
      student1LettersMocks
    ).as("getStudentLetters");
  });

  it("student can view their own attendance records", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.get('[data-testid="attendance-card"]').should("have.length", 4);
  });

  it("student can see absence cards with proper styling", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("PROG1 - Algorithmique")
      .parent()
      .within(() => {
        cy.contains("Absent").should("be.visible");
        cy.get('[data-testid="status-chip"]')
          .should("have.css", "background-color")
          .and("match", /rgb\(255, 235, 238\)/); // Red background
      });
  });

  it("student can see present cards with proper styling", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("WEB1 - Développement Web")
      .parent()
      .within(() => {
        cy.contains("Présent").should("be.visible");
        cy.get('[data-testid="status-chip"]')
          .should("have.css", "background-color")
          .and("match", /rgb\(232, 245, 233\)/); // Green background
      });
  });

  it("student can see late cards with proper styling", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("MATH2 - Mathématiques")
      .parent()
      .within(() => {
        cy.contains("En retard").should("be.visible");
        cy.get('[data-testid="status-chip"]')
          .should("have.css", "background-color")
          .and("match", /rgb\(255, 243, 224\)/); // Orange background
      });
  });

  it("student can filter attendance by status", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.get('[data-testid="status-filter"]').click();
    cy.contains("Absences uniquement").click();

    cy.get('[data-testid="attendance-card"]').should("have.length", 2);
    cy.contains("PROG1 - Algorithmique").should("be.visible");
    cy.contains("Examen PROG1").should("be.visible");
  });

  it("student can filter attendance by date range", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.get('input[name="from"]').type("2025-04-10");
    cy.get('input[name="to"]').type("2025-04-11");

    cy.wait("@getStudentAttendance").then((interception) => {
      expect(interception.request.url).to.include("from=2025-04-10");
      expect(interception.request.url).to.include("to=2025-04-11");
    });
  });

  it("student can click on absence card to view details", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("PROG1 - Algorithmique").click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Détails de l'absence").should("be.visible");
  });

  it("student can see event location on attendance cards", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("A101").should("be.visible");
    cy.contains("B202").should("be.visible");
  });

  it("student can see event time on attendance cards", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("08:00").should("be.visible");
    cy.contains("10:00").should("be.visible");
  });

  it("student can see empty state when no attendance records", () => {
    cy.intercept("GET", `/students/${student1Mock.id}/attendance?**`, []).as(
      "getNoAttendance"
    );

    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getNoAttendance");

    cy.contains("Aucune donnée de présence").should("be.visible");
  });

  it("student can see loading state while fetching attendance", () => {
    // Delay the response to see loading state
    cy.intercept("GET", `/students/${student1Mock.id}/attendance?**`, (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send(studentAttendanceMock);
      });
    }).as("getDelayedAttendance");

    cy.visit(`/students/${student1Mock.id}/show/participation`);

    cy.get('[role="progressbar"]').should("be.visible");
  });

  it("student can clear filters", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.get('input[name="from"]').type("2025-04-10");
    cy.get('[data-testid="status-filter"]').click();
    cy.contains("Absences uniquement").click();

    cy.get('[data-testid="clear-filters"]').click();

    cy.get('input[name="from"]').should("have.value", "");
    cy.get('[data-testid="attendance-card"]').should("have.length", 4);
  });

  it("student can see event type on attendance cards", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("COURSE").should("be.visible");
    cy.contains("EXAM").should("be.visible");
  });

  it("student can view attendance summary statistics", () => {
    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getStudentAttendance");

    cy.contains("Total").should("be.visible");
    cy.contains("4").should("be.visible");

    cy.contains("Absences").should("be.visible");
    cy.contains("2").should("be.visible");
  });

  it("student can see celebratory message when no absences", () => {
    const allPresentAttendance = studentAttendanceMock.map((record) => ({
      ...record,
      attendance_status: "PRESENT",
    }));

    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/attendance?**`,
      allPresentAttendance
    ).as("getAllPresent");

    cy.visit(`/students/${student1Mock.id}/show/participation`);
    cy.wait("@getAllPresent");

    cy.get('[data-testid="status-filter"]').click();
    cy.contains("Absences uniquement").click();

    cy.contains("Félicitations").should("be.visible");
    cy.contains("Aucune absence").should("be.visible");
  });
});
