import {student1LettersMocks} from "../fixtures/api_mocks/letters-mocks";
import {missingParticipantsMock} from "../fixtures/api_mocks/missing-participants-mock";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("PDF.Viewer", () => {
  const letter = student1LettersMocks[0];
  const absence = missingParticipantsMock[0];

  describe("PDF Viewer with Authentication", () => {
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

    it("manager can view PDF with authenticated request", () => {
      cy.intercept("GET", "**/test_file*.pdf", (req) => {
        expect(req.headers).to.have.property("authorization");

        req.reply({
          statusCode: 200,
          headers: {"Content-Type": "application/pdf"},
          body: "PDF content",
        });
      }).as("getAuthenticatedPDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.wait("@getAuthenticatedPDF");
      cy.get('[data-testid="pdf-viewer"]').should("be.visible");
    });

    it("PDF viewer shows loading state", () => {
      cy.intercept("GET", "**/test_file*.pdf", (req) => {
        req.reply((res) => {
          res.delay = 1000;
          res.send({
            statusCode: 200,
            headers: {"Content-Type": "application/pdf"},
            body: "PDF content",
          });
        });
      }).as("getSlowPDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.get('[role="progressbar"]').should("be.visible");
    });

    it("PDF viewer shows error message on 404", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 404,
        body: "Not Found",
      }).as("get404PDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.wait("@get404PDF");

      cy.contains("Une erreur est survenue lors du chargement du PDF").should(
        "be.visible"
      );
    });

    it("PDF viewer shows error message on 401 unauthorized", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 401,
        body: "Unauthorized",
      }).as("get401PDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.wait("@get401PDF");

      cy.contains("Une erreur est survenue").should("be.visible");
    });

    it("PDF viewer shows error message on 500 server error", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 500,
        body: "Internal Server Error",
      }).as("get500PDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.wait("@get500PDF");

      cy.contains("Une erreur est survenue").should("be.visible");
    });

    it("PDF viewer can be closed", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF");

      cy.get('[aria-label="close"]').click();

      cy.get('[data-testid="pdf-viewer"]').should("not.exist");
    });

    it("PDF viewer displays PDF content", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF");

      cy.get('[data-testid="pdf-viewer"]').should("exist");
      cy.get('[data-testid="pdf-content"]').should("exist");
    });

    it("multiple PDFs can be viewed sequentially", () => {
      cy.intercept("GET", "**/test_file_1.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content 1",
      }).as("getPDF1");

      cy.intercept("GET", "**/test_file_2.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content 2",
      }).as("getPDF2");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF1");
      cy.get('[data-testid="pdf-viewer"]').should("be.visible");
      cy.get('[aria-label="close"]').click();
      cy.contains("Voir le fichier").eq(1).click();
      cy.wait("@getPDF2");
      cy.get('[data-testid="pdf-viewer"]').should("be.visible");
    });

    it("PDF viewer uses blob URL for display", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF");

      cy.get('[data-testid="pdf-content"]')
        .should("have.attr", "src")
        .and("include", "blob:");
    });

    it("PDF viewer handles network errors gracefully", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        forceNetworkError: true,
      }).as("getNetworkError");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.contains("Une erreur est survenue").should("be.visible");
    });
  });

  describe("PDF Viewer in Student Context", () => {
    beforeEach(() => {
      cy.mockLogin({role: "STUDENT", user: student1Mock});

      cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
        "getStudent"
      );

      cy.intercept("GET", `/students/${student1Mock.id}/attendance?**`, [
        {
          id: "att_1",
          attendanceStatus: "MISSING",
          beginDatetime: "2025-04-10T08:00:00Z",
          endDatetime: "2025-04-10T10:00:00Z",
          eventType: "COURSE",
          eventTitle: "PROG1",
          eventDescription: "Course",
        },
      ]).as("getAttendance");

      cy.intercept(
        "GET",
        `/students/${student1Mock.id}/letters?**`,
        student1LettersMocks
      ).as("getStudentLetters");
    });

    it("student can view their own justification PDFs", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF");

      cy.get('[data-testid="pdf-viewer"]').should("be.visible");
    });

    it("student sees error if PDF is not accessible", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 403,
        body: "Forbidden",
      }).as("get403PDF");

      cy.visit(`/students/${student1Mock.id}/show/participation`);
      cy.wait("@getAttendance");

      cy.get('[data-testid="attendance-card"]').first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@get403PDF");

      cy.contains("Une erreur est survenue").should("be.visible");
    });
  });

  describe("PDF Viewer in Letters Management", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MANAGER"});

      cy.intercept("GET", "/students/letters/stats", {
        pending: 15,
        received: 50,
        rejected: 10,
      }).as("getLetterStats");

      cy.intercept("GET", "/students/letters?**", student1LettersMocks).as(
        "getAllLetters"
      );
    });

    it("manager can view PDF from letters list", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit("/students/letters");
      cy.wait("@getAllLetters");

      cy.get('[data-testid="view-pdf-button"]').first().click();

      cy.wait("@getPDF");
      cy.get('[data-testid="pdf-viewer"]').should("be.visible");
    });

    it("PDF viewer shows letter information", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit("/students/letters");
      cy.wait("@getAllLetters");

      cy.get('[data-testid="view-pdf-button"]').first().click();
      cy.wait("@getPDF");

      cy.contains(letter.description!).should("be.visible");
    });
  });

  describe("PDF Viewer Performance", () => {
    beforeEach(() => {
      cy.mockLogin({role: "MANAGER"});

      cy.intercept("GET", "/event_participants?**", missingParticipantsMock).as(
        "getMissingParticipants"
      );

      cy.intercept(
        "GET",
        `/students/${absence.event_participant?.student_id}/letters?**`,
        student1LettersMocks
      ).as("getStudentLetters");
    });

    it("PDF viewer handles large files", () => {
      const largePDFContent = new Array(5 * 1024 * 1024).join("x");

      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: largePDFContent,
      }).as("getLargePDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();

      cy.get('[role="progressbar"]').should("be.visible");

      cy.wait("@getLargePDF");
      cy.get('[data-testid="pdf-viewer"]', {timeout: 10000}).should(
        "be.visible"
      );
    });

    it("PDF viewer cleans up blob URLs on close", () => {
      cy.intercept("GET", "**/test_file*.pdf", {
        statusCode: 200,
        headers: {"Content-Type": "application/pdf"},
        body: "PDF content",
      }).as("getPDF");

      cy.visit("/event_participants");
      cy.wait("@getMissingParticipants");

      cy.get(".event-missing-list tbody tr").first().click();
      cy.wait("@getStudentLetters");

      cy.contains("Voir le fichier").first().click();
      cy.wait("@getPDF");

      cy.get('[data-testid="pdf-content"]')
        .should("have.attr", "src")
        .and("include", "blob:");

      cy.get('[aria-label="close"]').click();

      cy.get('[data-testid="pdf-viewer"]').should("not.exist");
    });
  });
});
