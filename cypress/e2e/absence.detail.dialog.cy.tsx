import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {student1LettersMocks} from "../fixtures/api_mocks/letters-mocks";
import {missingParticipantsMock} from "../fixtures/api_mocks/missing-participants-mock";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("AbsenceDetailDialog", () => {
  const absence = missingParticipantsMock[0];

  describe("For Staff (Manager/Teacher)", () => {
    beforeEach(() => {
      cy.mockLogin({role: WhoamiRoleEnum.MANAGER});

      cy.intercept("GET", "/events/stats", {
        missed_stats: {total: 100, justified: 20, unjustified: 80},
        present: 200,
        late: 10,
        total: 310,
      }).as("getStats");

      cy.intercept("GET", "/event_participants?**", missingParticipantsMock).as(
        "getMissingParticipants"
      );

      cy.intercept(
        "GET",
        `/students/${absence.event_participant?.student_id}/letters?**`,
        student1LettersMocks
      ).as("getStudentLetters");
    });

    it("staff can open absence detail dialog by clicking on absence row", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      cy.get('[role="dialog"]').should("be.visible");
      cy.contains("Détails de l'absence").should("be.visible");
    });

    it("staff can view student information in dialog", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains(absence.event_participant?.first_name!).should("be.visible");
      cy.contains(absence.event_participant?.last_name!).should("be.visible");
      cy.contains(absence.event_participant?.ref!).should("be.visible");
      cy.contains(absence.event_participant?.email!).should("be.visible");
    });

    it("staff can view event information in dialog", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      cy.contains(absence.event?.title!).should("be.visible");
      if (absence.event?.course?.code) {
        cy.contains(absence.event.course.code).should("be.visible");
      }
      cy.contains(absence.event?.description!).should("be.visible");
    });

    it("staff can view justification letters in dialog", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Pièces justificatives").should("be.visible");

      const eventDate = new Date(absence.event?.begin_datetime!);
      const filteredLetters = student1LettersMocks.filter((letter) => {
        const letterDate = new Date(letter.creation_datetime);
        const diffTime = Math.abs(letterDate.getTime() - eventDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      if (filteredLetters.length > 0) {
        cy.get('[data-testid="letter-card"]').should("have.length.at.least", 1);
      }
    });

    it("staff can see letter status badges", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get('[data-testid="letter-status"]').should("exist");
    });

    it("staff can view PDF preview of justification letter", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.contains("Voir le fichier").first().click();

      cy.wait("@getPDF");
      cy.get('[data-testid="pdf-viewer"]').should("be.visible");
    });

    it("staff can close dialog", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      cy.get('[aria-label="close"]').click();

      cy.get('[role="dialog"]').should("not.exist");
    });

    it("staff can see letter filtering explanation", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("7 jours").should("be.visible");
    });

    it("staff can see message when no justification letters", () => {
      cy.intercept(
        "GET",
        `/students/${absence.event_participant?.student_id}/letters?**`,
        []
      ).as("getNoLetters");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getNoLetters");

      cy.contains("Aucun justificatif").should("be.visible");
    });

    it("staff can see attendance status with proper color coding", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      cy.get('[data-testid="attendance-status"]')
        .should("contain", "Absent")
        .and("have.css", "background-color")
        .and("match", /rgb\(255, 235, 238\)/);
    });

    it("staff can see event date and time formatted correctly", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      const eventDate = new Date(absence.event?.begin_datetime!);
      const formattedDate = eventDate.toLocaleDateString("fr-FR");
      cy.contains(formattedDate).should("be.visible");
    });

    it("staff can see event location if available", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      cy.get('[data-testid="location-icon"]').should("exist");
    });

    it("staff can see group information", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();

      if (absence.event?.groups && absence.event.groups.length > 0) {
        cy.contains(absence.event.groups[0].ref!).should("be.visible");
      }
    });
  });

  describe("For Students", () => {
    const studentAttendance = {
      id: "attendance_1",
      attendanceStatus: "MISSING",
      beginDatetime: "2025-04-10T08:00:00Z",
      endDatetime: "2025-04-10T10:00:00Z",
      eventType: "COURSE",
      eventTitle: "PROG1 - Algorithmique",
      eventDescription: "Cours sur les algorithmes",
      location: {room: "A101", place: "ANDRAHARO"},
    };

    beforeEach(() => {
      cy.mockLogin({role: "STUDENT", user: student1Mock});

      cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
        "getStudent"
      );

      cy.intercept("GET", `/students/${student1Mock.id}/attendance?**`, [
        studentAttendance,
      ]).as("getStudentAttendance");

      cy.intercept(
        "GET",
        `/students/${student1Mock.id}/letters?**`,
        student1LettersMocks
      ).as("getStudentLetters");
    });

    it("student can open their own absence detail dialog", () => {
      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();

      cy.get('[role="dialog"]').should("be.visible");
      cy.contains("Détails de l'absence").should("be.visible");
    });

    it("student can view their absence details", () => {
      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();

      cy.contains(studentAttendance.eventTitle).should("be.visible");
      cy.contains(studentAttendance.eventDescription).should("be.visible");
    });

    it("student can view their submitted justifications", () => {
      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Pièces justificatives").should("be.visible");
    });

    it("student cannot see approve/reject buttons", () => {
      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Accepter").should("not.exist");
      cy.contains("Refuser").should("not.exist");
    });

    it("student can see status of their submitted justifications", () => {
      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.get('[data-testid="letter-status"]').should("exist");
    });

    it("student can view their justification PDFs", () => {
      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF");
    });

    it("student can see message when they have no justifications", () => {
      cy.intercept("GET", `/students/${student1Mock.id}/letters?**`, []).as(
        "getNoLetters"
      );

      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getStudentAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getNoLetters");

      cy.contains("Aucun justificatif").should("be.visible");
    });
  });
});
