import {examMocks} from "../fixtures/api_mocks/exam-mocks";

const pageAssertions = () => {
  cy.contains("Liste des examens").should("be.visible");
  cy.contains(
    "Veuillez trouver ci-joint la liste des différents examens."
  ).should("be.visible");
};

describe("ExamParticipantList", () => {
  beforeEach(() => {
    cy.login({role: "TEACHER"});
  });

  it("should return no exams", () => {
    cy.intercept("GET", "/exams?*", []).as("getNoExams");
    cy.visit("/exams");
    cy.wait("@getNoExams");
    pageAssertions();
    cy.contains("Aucun examen trouvé.").should("be.visible");
    cy.get('[data-testid="exam-card"]').should("not.exist");
  });

  it("should return list of exams", () => {
    cy.intercept("GET", "/exams?*", examMocks).as("getExams");
    cy.visit("/exams");
    cy.wait("@getExams");
    pageAssertions();
    cy.get('[data-testid="exam-card"]').should("not.exist");
  });

  it("should create or update a new exam", () => {
    const updatedExam = {
      id: "exam-001",
      teacher: "Mr Fiantso",
      title: "Math Final",
      coefficient: 3,
      date: "2025-06-20",
    };

    cy.intercept("PUT", "/exams", (req) => {
      expect(req.body).to.deep.equal(updatedExam);
      req.reply({statusCode: 200, body: updatedExam});
    }).as("putExam");
    cy.intercept("GET", "/exams?*", [updatedExam]).as("getExamsAfterUpdate");
    cy.visit("/exams");
    cy.get('[data-testid="exam-actions-btn"] button').click();
    cy.url().should("include", "/exams/create");
    cy.get('input[name="teacher"]').type(updatedExam.title);
    cy.get('input[name="title"]').type(updatedExam.title);
    cy.get('input[name="coefficient"]').type(String(updatedExam.coefficient));
    cy.get('input[name="examination_date"]').type(updatedExam.date);
    cy.get('button[type="submit"]').click();
    cy.wait("@putExam");
    cy.wait("@getExamsAfterUpdate");
    cy.contains(updatedExam.title).should("be.visible");
  });
});
