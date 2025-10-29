import {LetterStatus} from "@haapi-b0fc7615/typescript-client";
import {
  lettersMocks,
  student1LettersMocks,
} from "../fixtures/api_mocks/letters-mocks";
import {missingParticipantsMock} from "../fixtures/api_mocks/missing-participants-mock";

describe("Justification.Management", () => {
  const absence = missingParticipantsMock[0];
  const pendingLetter = student1LettersMocks.find(
    (l) => l.status === LetterStatus.PENDING
  )!;

  describe("Manager can manage justifications", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MANAGER"});

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

    it("manager can approve a pending justification", () => {
      cy.intercept(
        "PUT",
        `/students/${absence.event_participant?.student_id}/letters/${pendingLetter.id}`,
        {
          ...pendingLetter,
          status: LetterStatus.RECEIVED,
        }
      ).as("approveLetter");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Accepter").click();
      });

      cy.wait("@approveLetter").then((interception) => {
        expect(interception.request.body.status).to.equal("RECEIVED");
      });

      cy.contains("Justificatif approuvé").should("be.visible");
    });

    it("manager can reject a pending justification with reason", () => {
      cy.intercept(
        "PUT",
        `/students/${absence.event_participant?.student_id}/letters/${pendingLetter.id}`,
        {
          ...pendingLetter,
          status: LetterStatus.REJECTED,
          reason_for_refusal: "Document incomplet",
        }
      ).as("rejectLetter");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Refuser").click();
      });
      cy.get('[data-testid="rejection-reason"]').type("Document incomplet");
      cy.contains("Confirmer le refus").click();

      cy.wait("@rejectLetter").then((interception) => {
        expect(interception.request.body.status).to.equal("REJECTED");
        expect(interception.request.body.reason_for_refusal).to.equal(
          "Document incomplet"
        );
      });

      cy.contains("Justificatif refusé").should("be.visible");
    });

    it("manager cannot reject without providing a reason", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Refuser").click();
      });
      cy.contains("Confirmer le refus").click();
      cy.contains("La raison du refus est obligatoire").should("be.visible");
    });

    it("manager can only see action buttons for pending justifications", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      const receivedLetter = student1LettersMocks.find(
        (l) => l.status === LetterStatus.RECEIVED
      );
      if (receivedLetter) {
        cy.get(`[data-testid="letter-${receivedLetter.id}"]`).within(() => {
          cy.contains("Accepter").should("not.exist");
          cy.contains("Refuser").should("not.exist");
        });
      }
    });

    it("manager can cancel rejection dialog", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Refuser").click();
      });
      cy.contains("Annuler").click();
      cy.get('[data-testid="rejection-dialog"]').should("not.exist");
    });

    it("manager can see letter status badges with correct colors", () => {
      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get('[data-testid="status-PENDING"]')
        .should("contain", "En attente")
        .and("have.css", "background-color")
        .and("match", /rgb\(255, 243, 224\)/);
      cy.get('[data-testid="status-RECEIVED"]')
        .should("contain", "Accepté")
        .and("have.css", "background-color")
        .and("match", /rgb\(232, 245, 233\)/);
      cy.get('[data-testid="status-REJECTED"]')
        .should("contain", "Refusé")
        .and("have.css", "background-color")
        .and("match", /rgb\(255, 235, 238\)/);
    });

    it("manager can see rejection reason for rejected letters", () => {
      const rejectedLetter = student1LettersMocks.find(
        (l) => l.status === LetterStatus.REJECTED
      );

      if (rejectedLetter) {
        cy.visit("/event_participants");
        cy.wait("@getMissingParticipants");

        cy.get(".event-missing-list tbody tr").first().click();
        cy.wait("@getStudentLetters");

        cy.get(`[data-testid="letter-${rejectedLetter.id}"]`).within(() => {
          cy.contains(rejectedLetter.reason_for_refusal!).should("be.visible");
        });
      }
    });

    it("manager can refresh list after approving/rejecting", () => {
      cy.intercept(
        "PUT",
        `/students/${absence.event_participant?.student_id}/letters/${pendingLetter.id}`,
        {
          ...pendingLetter,
          status: LetterStatus.RECEIVED,
        }
      ).as("approveLetter");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Accepter").click();
      });

      cy.wait("@approveLetter");

      cy.wait("@getStudentLetters");
    });
  });

  describe("Teacher can manage justifications", () => {
    beforeEach(() => {
      cy.mockLogin({role: "TEACHER"});

      cy.intercept("GET", "/events/stats", {
        missed_stats: {total: 50, justified: 10, unjustified: 40},
        present: 100,
        late: 5,
        total: 155,
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

    it("teacher can approve justifications", () => {
      cy.intercept(
        "PUT",
        `/students/${absence.event_participant?.student_id}/letters/${pendingLetter.id}`,
        {
          ...pendingLetter,
          status: LetterStatus.RECEIVED,
        }
      ).as("approveLetter");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Accepter").click();
      });

      cy.wait("@approveLetter");
      cy.contains("Justificatif approuvé").should("be.visible");
    });

    it("teacher can reject justifications with reason", () => {
      cy.intercept(
        "PUT",
        `/students/${absence.event_participant?.student_id}/letters/${pendingLetter.id}`,
        {
          ...pendingLetter,
          status: LetterStatus.REJECTED,
          reason_for_refusal: "Certificat médical non valide",
        }
      ).as("rejectLetter");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.get(`[data-testid="letter-${pendingLetter.id}"]`).within(() => {
        cy.contains("Refuser").click();
      });

      cy.get('[data-testid="rejection-reason"]').type(
        "Certificat médical non valide"
      );
      cy.contains("Confirmer le refus").click();

      cy.wait("@rejectLetter");
      cy.contains("Justificatif refusé").should("be.visible");
    });
  });

  describe("Student cannot manage justifications", () => {
    beforeEach(() => {
      cy.mockLogin({role: "STUDENT"});

      cy.intercept(
        "GET",
        `/students/${absence.event_participant?.student_id}`,
        absence.event_participant
      ).as("getStudent");

      cy.intercept(
        "GET",
        `/students/${absence.event_participant?.student_id}/attendance?**`,
        [
          {
            id: "att_1",
            attendanceStatus: "MISSING",
            beginDatetime: absence.event?.begin_datetime,
            endDatetime: absence.event?.end_datetime,
            eventType: absence.event?.type,
            eventTitle: absence.event?.title,
            eventDescription: absence.event?.description,
          },
        ]
      ).as("getAttendance");

      cy.intercept(
        "GET",
        `/students/${absence.event_participant?.student_id}/letters?**`,
        student1LettersMocks
      ).as("getStudentLetters");
    });

    it("student cannot see approve/reject buttons", () => {
      cy.visit(
        `/students/${absence.event_participant?.student_id}/show/participation`
      );
      cy.wait("@getAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Accepter").should("not.exist");
      cy.contains("Refuser").should("not.exist");
    });

    it("student can only view their justification status", () => {
      cy.visit(
        `/students/${absence.event_participant?.student_id}/show/participation`
      );
      cy.wait("@getAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.get('[data-testid="letter-status"]').should("exist");
      cy.get('[data-testid="letter-card"]').should("not.have.attr", "onclick");
    });
  });

  describe("Justification list management", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MANAGER"});

      cy.intercept("GET", "/students/letters/stats", {
        pending: 15,
        received: 50,
        rejected: 10,
      }).as("getLetterStats");

      cy.intercept("GET", "/students/letters?**", lettersMocks).as(
        "getAllLetters"
      );
    });

    it("manager can view all pending justifications", () => {
      cy.visit("/students/letters");
      cy.wait("@getAllLetters");

      cy.get('[data-testid="status-filter"]').click();
      cy.contains("En attente").click();

      cy.wait("@getAllLetters").then((interception) => {
        expect(interception.request.url).to.include("status=PENDING");
      });
    });

    it("manager can view justification statistics", () => {
      cy.visit("/students/letters");
      cy.wait("@getLetterStats");

      cy.contains("En attente").should("be.visible");
      cy.contains("15").should("be.visible");

      cy.contains("Acceptés").should("be.visible");
      cy.contains("50").should("be.visible");

      cy.contains("Refusés").should("be.visible");
      cy.contains("10").should("be.visible");
    });

    it("manager can filter justifications by student", () => {
      cy.visit("/students/letters");
      cy.wait("@getAllLetters");

      cy.get('input[placeholder*="Rechercher"]').type("John Doe");

      cy.wait("@getAllLetters").then((interception) => {
        expect(interception.request.url).to.include("userName=John");
      });
    });

    it("manager can bulk approve multiple justifications", () => {
      cy.intercept("PUT", "/students/letters/bulk-update", {
        statusCode: 200,
        body: {updated: 3},
      }).as("bulkApprove");

      cy.visit("/students/letters");
      cy.wait("@getAllLetters");

      cy.get('[data-testid="letter-checkbox"]').first().check();
      cy.get('[data-testid="letter-checkbox"]').eq(1).check();
      cy.get('[data-testid="letter-checkbox"]').eq(2).check();
      cy.get('[data-testid="bulk-approve"]').click();
      cy.contains("Confirmer").click();

      cy.wait("@bulkApprove");
      cy.contains("3 justificatifs approuvés").should("be.visible");
    });
  });
});
