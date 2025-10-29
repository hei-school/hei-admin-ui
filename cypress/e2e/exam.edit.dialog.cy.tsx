import {courseMocks} from "../fixtures/api_mocks/course-mocks";
import {examMocks} from "../fixtures/api_mocks/exam-mocks";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

describe("Exam.Edit.Dialog", () => {
  const exam = examMocks[0];

  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});

    cy.intercept("GET", "/exams?**", examMocks).as("getExams");

    cy.intercept("GET", `/exams/${exam.id}`, exam).as("getExam");

    cy.intercept("GET", "/courses?**", courseMocks).as("getCourses");

    cy.intercept("GET", "/teachers?**", teachersMock).as("getTeachers");

    cy.intercept("GET", "/course-assignments?**", [exam.course_assignment]).as(
      "getCourseAssignments"
    );
  });

  it("manager can open exam edit dialog from exam card", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");

    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Modifier l'examen").should("be.visible");
  });

  it("manager can see pre-filled exam data in edit dialog", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').should("have.value", exam.title);
    cy.get('input[name="coefficient_numerator"]').should(
      "have.value",
      exam.coefficient?.numerator?.toString()
    );
    cy.get('input[name="coefficient_denominator"]').should(
      "have.value",
      exam.coefficient?.denominator?.toString()
    );
  });

  it("manager can update exam title", () => {
    const updatedExam = {...exam, title: "Updated Exam Title"};

    cy.intercept("PUT", `/exams/${exam.id}`, updatedExam).as("updateExam");

    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').clear().type("Updated Exam Title");

    cy.contains("Enregistrer").click();

    cy.wait("@updateExam").then((interception) => {
      expect(interception.request.body.title).to.equal("Updated Exam Title");
    });

    cy.contains("Examen modifié avec succès").should("be.visible");
  });

  it("manager can update exam date", () => {
    const newDate = "2025-09-15T10:00";
    const updatedExam = {
      ...exam,
      examination_date: new Date(newDate),
    };

    cy.intercept("PUT", `/exams/${exam.id}`, updatedExam).as("updateExam");

    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="examination_date"]').clear().type(newDate);

    cy.contains("Enregistrer").click();

    cy.wait("@updateExam");
    cy.contains("Examen modifié avec succès").should("be.visible");
  });

  it("manager can update exam coefficient", () => {
    const updatedExam = {
      ...exam,
      coefficient: {numerator: 4, denominator: 3},
    };

    cy.intercept("PUT", `/exams/${exam.id}`, updatedExam).as("updateExam");

    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="coefficient_numerator"]').clear().type("4");
    cy.get('input[name="coefficient_denominator"]').clear().type("3");

    cy.contains("Enregistrer").click();

    cy.wait("@updateExam").then((interception) => {
      expect(interception.request.body.coefficient.numerator).to.equal(4);
      expect(interception.request.body.coefficient.denominator).to.equal(3);
    });

    cy.contains("Examen modifié avec succès").should("be.visible");
  });

  it("manager cannot set numerator greater than denominator", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="coefficient_numerator"]').clear().type("5");
    cy.get('input[name="coefficient_denominator"]').clear().type("3");

    cy.contains("Enregistrer").click();

    cy.contains(
      "Le numérateur ne peut pas être supérieur au dénominateur"
    ).should("be.visible");
  });

  it("manager cannot set coefficient to zero", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="coefficient_numerator"]').clear().type("0");

    cy.contains("Enregistrer").click();

    cy.contains("Le coefficient doit être supérieur à 0").should("be.visible");
  });

  it("manager can change course assignment", () => {
    const newCourseAssignment = {
      id: "new_assignment_id",
      main_teacher: teachersMock[1],
      course: courseMocks[1],
      groups: [],
    };

    const updatedExam = {
      ...exam,
      course_assignment_id: newCourseAssignment.id,
    };

    cy.intercept("PUT", `/exams/${exam.id}`, updatedExam).as("updateExam");

    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('[data-testid="course-assignment-select"]').click();
    cy.contains(courseMocks[1].code!).click();

    cy.contains("Enregistrer").click();

    cy.wait("@updateExam");
    cy.contains("Examen modifié avec succès").should("be.visible");
  });

  it("manager can cancel exam edit", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').clear().type("Changed Title");

    cy.contains("Annuler").click();

    cy.get('[role="dialog"]').should("not.exist");

    cy.contains(exam.title!).should("be.visible");
  });

  it("manager can close dialog with X button", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('[aria-label="close"]').click();

    cy.get('[role="dialog"]').should("not.exist");
  });

  it("manager sees validation errors for required fields", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').clear();
    cy.get('input[name="examination_date"]').clear();

    cy.contains("Enregistrer").click();
    cy.contains("Le titre est obligatoire").should("be.visible");
    cy.contains("La date d'examen est obligatoire").should("be.visible");
  });

  it("manager can see loading state while saving", () => {
    cy.intercept("PUT", `/exams/${exam.id}`, (req) => {
      req.reply((res) => {
        res.delay = 1000;
        res.send(exam);
      });
    }).as("slowUpdate");

    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').clear().type("New Title");
    cy.contains("Enregistrer").click();

    cy.get('[role="progressbar"]').should("be.visible");
  });

  it("manager sees error message on save failure", () => {
    cy.intercept("PUT", `/exams/${exam.id}`, {
      statusCode: 500,
      body: {message: "Internal Server Error"},
    }).as("failedUpdate");

    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').clear().type("New Title");
    cy.contains("Enregistrer").click();

    cy.wait("@failedUpdate");

    cy.contains("Erreur lors de la modification").should("be.visible");
  });

  it("edit button only appears on hover", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="edit-exam-button"]').first().should("not.be.visible");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");

    cy.get('[data-testid="edit-exam-button"]').first().should("be.visible");
  });

  it("clicking edit button does not navigate to grades page", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.url().should("include", "/exams");
    cy.url().should("not.include", "/participants");

    cy.get('[role="dialog"]').should("be.visible");
  });

  it("manager can see helpful alerts in dialog", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.contains("Le coefficient").should("be.visible");
    cy.contains("numérateur").should("be.visible");
    cy.contains("dénominateur").should("be.visible");
  });

  it("dialog has proper sections organization", () => {
    cy.visit("/exams");
    cy.wait("@getExams");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.contains("Attribution du cours").should("be.visible");
    cy.contains("Détails de l'examen").should("be.visible");
    cy.contains("Coefficient").should("be.visible");
  });

  it("teacher can also edit exams", () => {
    cy.mockLogin({role: "TEACHER"});

    cy.intercept("GET", "/exams?**", examMocks).as("getExamsTeacher");
    cy.intercept("PUT", `/exams/${exam.id}`, exam).as("updateExamTeacher");

    cy.visit("/exams");
    cy.wait("@getExamsTeacher");

    cy.get('[data-testid="exam-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-exam-button"]').first().click({force: true});

    cy.get('input[name="title"]').clear().type("Teacher Updated Title");
    cy.contains("Enregistrer").click();

    cy.wait("@updateExamTeacher");
    cy.contains("Examen modifié avec succès").should("be.visible");
  });
});
