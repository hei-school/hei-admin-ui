import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  courseAssignmentMocks,
  examMocks,
} from "../fixtures/api_mocks/exam-mocks";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

const dialog = () => cy.get('[role="dialog"]');
const titleInput = () => dialog().find('input[name="title"]');
const numeratorInput = () =>
  dialog().find('input[name="coefficient.numerator"]');
const denominatorInput = () =>
  dialog().find('input[name="coefficient.denominator"]');
const submit = () => dialog().contains("button", "Enregistrer").click();
// the section warning repeats some messages: only the field helpers are checked
const fieldErrors = () => dialog().find(".MuiFormHelperText-root");

const openEditDialog = () => {
  cy.getByTestid("exam-card").first().trigger("mouseover");
  cy.getByTestid("exam-card")
    .first()
    .find('[data-testid="EditOutlinedIcon"]')
    .closest("button")
    .click();
  dialog().contains("Modifier l'examen").should("be.visible");
};

describe("Validation du formulaire de modification d'un examen (enseignant)", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
    cy.intercept("GET", "/exams?*", examMocks).as("getExams");
    cy.intercept(
      "GET",
      `teachers/${teachersMock[0].id}/course_assignments?**`,
      courseAssignmentMocks
    ).as("getCourseAssignments");
    cy.visit("/exams");
    cy.wait("@getExams");
    openEditDialog();
  });

  it("valide la longueur du titre", () => {
    titleInput().clear().type("   ");
    submit();
    dialog().contains("Le titre de l'examen est requis").should("be.visible");

    titleInput().clear().type("ab");
    submit();
    dialog()
      .contains("Le titre doit contenir au moins 3 caractères")
      .should("be.visible");

    titleInput().clear().type("a".repeat(101), {delay: 0});
    submit();
    dialog()
      .contains("Le titre ne peut pas dépasser 100 caractères")
      .should("be.visible");

    titleInput().clear().type("Titre valide");
    submit();
    fieldErrors()
      .should("not.contain.text", "Le titre ne peut pas dépasser")
      .and("not.contain.text", "Le titre doit contenir");
  });

  it("valide le numérateur et le dénominateur du coefficient", () => {
    numeratorInput().clear().type("0");
    denominatorInput().clear().type("0");
    submit();
    fieldErrors()
      .should("contain.text", "Le numérateur est requis")
      .and("contain.text", "Le dénominateur est requis");

    numeratorInput().clear().type("-1");
    denominatorInput().clear().type("-2");
    submit();
    fieldErrors()
      .should("contain.text", "Le numérateur doit être positif")
      .and("contain.text", "Le dénominateur doit être positif");

    numeratorInput().clear().type("5");
    denominatorInput().clear().type("2");
    submit();
    fieldErrors()
      .should(
        "contain.text",
        "Le numérateur ne peut pas être supérieur au dénominateur"
      )
      .and(
        "contain.text",
        "Le dénominateur ne peut pas être inférieur au numérateur"
      );

    numeratorInput().clear().type("1");
    denominatorInput().clear().type("2");
    submit();
    fieldErrors()
      .should("not.contain.text", "Le numérateur")
      .and("not.contain.text", "Le dénominateur");
  });

  it("refuse une date d'examen incomplète", () => {
    dialog()
      .find('input[name="examination_date"]')
      .should("not.have.value", "")
      .type("{backspace}");
    submit();
    fieldErrors().should("contain.text", "Date invalide");
  });

  it("enregistre les modifications quand le formulaire est valide", () => {
    cy.intercept("PUT", "/exams", (req) => {
      expect(req.body).to.include({
        id: examMocks[0].id,
        title: "Programmation avancée",
        course_assignment_id: courseAssignmentMocks[0].id,
      });
      expect(req.body.coefficient).to.deep.eq({
        numerator: 1,
        denominator: 2,
      });
      req.reply({statusCode: 200, body: examMocks[0]});
    }).as("updateExam");

    titleInput().clear().type("Programmation avancée");
    numeratorInput().clear().type("1");
    denominatorInput().clear().type("2");
    cy.wait("@getCourseAssignments");
    cy.getByTestid("course-select").click();
    cy.get('[role="option"]')
      .contains(courseAssignmentMocks[0].course.code)
      .click();
    submit();

    cy.wait("@updateExam").its("response.statusCode").should("eq", 200);
    cy.contains("Examen modifié avec succès").should("be.visible");
  });
});
