import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  courseResultsMock,
  emptyYearlyResultMock,
  gradesInformaticsMock,
  yearlyResultL2Mock,
  yearlyResultL3Mock,
  yearlyResultMock,
} from "../fixtures/api_mocks/grades-mocks";
import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {studentLinkedToMonitorMock} from "../fixtures/api_mocks/students-mocks";

const goToStudentGrades = () => {
  cy.intercept(
    "GET",
    `/monitors/${monitor1Mock.id}/students?page=1&page_size=10`,
    studentLinkedToMonitorMock
  ).as("getStudents");
  cy.intercept(
    "GET",
    `/students/${studentLinkedToMonitorMock[0].id!}`,
    studentLinkedToMonitorMock[0]
  ).as("getStudent");
  cy.intercept(
    "GET",
    `/monitors/${monitor1Mock.id}/students/${studentLinkedToMonitorMock[0].id!}`,
    studentLinkedToMonitorMock[0]
  ).as("getStudentOne");
  cy.intercept(
    "GET",
    `/monitors/${monitor1Mock.id}/students?page=2&page_size=10`,

    studentLinkedToMonitorMock
  ).as("getStudents2");

  cy.get('[href="/monitors/monitor1_id/students"]').click();
  cy.wait("@getStudents");
  cy.getByTestid("show-monitor-student").first().click();
  cy.getByTestid("grades-tab").click();
};

describe("GradesDashboard Component - Extended Tests", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});
    goToStudentGrades();

    cy.intercept(
      "GET",
      `/students/${studentLinkedToMonitorMock[0].id!}/yearly_results/L1`,
      yearlyResultMock
    ).as("getYearlyResults");
    cy.intercept(
      "GET",
      `/students/${studentLinkedToMonitorMock[0].id!}/yearly_results/L2`,
      yearlyResultL2Mock
    ).as("getYearlyResults2");
    cy.intercept(
      "GET",
      `/students/${studentLinkedToMonitorMock[0].id!}/yearly_results/L3`,
      yearlyResultL3Mock
    ).as("getYearlyResults3");
    cy.intercept("GET", `/grades?*`, {data: courseResultsMock}).as(
      "getCourseResults"
    );
  });

  describe("Test all view for monitor for Level 1", () => {
    it("should display transcript overview card with all required information", () => {
      cy.getByTestid("transcript-overview").should("be.visible");
      cy.getByTestid("level").should(
        "contain",
        `Niveau ${yearlyResultMock.level}`
      );
      const expectedLabel =
        yearlyResultMock.status === "VALIDATED"
          ? "Moyenne Finale"
          : yearlyResultMock.status === "INVALIDATED"
            ? "Non Validé"
            : yearlyResultMock.status === "IN_PROGRESS"
              ? "Moyenne Provisoire"
              : yearlyResultMock.status === "NOT_STARTED"
                ? "Non Commencé"
                : "Incomplet";
      cy.getByTestid("status-chip").should("contain", expectedLabel);
      cy.getByTestid("credits").should(
        "contain",
        `${yearlyResultMock.obtained_credits!} / ${yearlyResultMock.total_credits!}`
      );

      cy.getByTestid("average-display").should(
        "contain",
        yearlyResultMock.weighted_average!.toFixed(2)
      );
    });

    it("should display courses correctly in both grid and list views", () => {
      cy.getByTestid("grid-view-toggle").click();
      cy.getByTestid("course-result-card").should("exist");
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${courseResultsMock[0]?.course?.name} (${courseResultsMock[0]?.course?.code})`
        );
      cy.getByTestid("course-result-card")
        .first()
        .contains(`${courseResultsMock[0]?.weighted_average?.toFixed(2)}/20`);
      cy.getByTestid("course-result-card")
        .first()
        .contains(`${courseResultsMock[0]?.course?.credits} crédits`);

      cy.getByTestid("list-view-toggle").click();
      cy.getByTestid("courses-list-view").should("exist");
      cy.getByTestid("course-row").should(
        "have.length",
        courseResultsMock.length
      );
      cy.getByTestid("course-row").contains(
        `${courseResultsMock[0]?.course?.name}`
      );
      cy.getByTestid("course-row").contains(
        `${courseResultsMock[0]?.course?.code}`
      );
      cy.getByTestid("course-row").contains(
        `${courseResultsMock[0]?.weighted_average?.toFixed(2)}/20`
      );
      cy.getByTestid("course-row").contains(
        `${courseResultsMock[0]?.course?.credits}`
      );
      const statusValue = courseResultsMock[0]?.status;
      const statusText =
        statusValue === "VALIDATED"
          ? "Validé"
          : statusValue === "IN_PROGRESS"
            ? "En Cours"
            : statusValue === "INCOMPLETE"
              ? "Incomplet"
              : "Non commencé";

      cy.getByTestid("course-row").contains(statusText);
    });
  });

  describe("Test level filter and view type toggle", () => {
    it("should filter courses to L2 and L3 correctly", () => {
      cy.getByTestid("grid-view-toggle").click();

      ["L2", "L3"].forEach((level) => {
        cy.getByTestid("level-select").click();
        cy.get(`[data-value="${level}"]`).click();
        const alias =
          level === "L2" ? "@getYearlyResults2" : "@getYearlyResults3";
        cy.wait(alias);
        const mock = level === "L2" ? yearlyResultL2Mock : yearlyResultL3Mock;

        cy.getByTestid("transcript-overview").should("be.visible");
        cy.getByTestid("level").should("contain", `Niveau ${mock.level}`);
        cy.getByTestid("average-display").should(
          "contain",
          mock.weighted_average!.toFixed(2)
        );
        cy.getByTestid("course-result-card")
          .first()
          .contains(
            `${mock?.course_results?.[0]?.course?.name} (${mock?.course_results?.[0]?.course?.code})`
          );
        cy.getByTestid("course-result-card")
          .first()
          .contains(
            `${mock?.course_results?.[0]?.weighted_average?.toFixed(2)}/20`
          );
        cy.getByTestid("course-result-card")
          .first()
          .contains(`${mock?.course_results?.[0]?.course?.credits} crédits`);
      });
    });
  });

  describe("display for empty course results", () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id!}/yearly_results/L1`,
        emptyYearlyResultMock
      ).as("emptyYearlyResults");
    });
    it("should display empty state when no course results are available on grid view", () => {
      cy.getByTestid("course-result-card").should("not.exist");

      cy.contains("Aucun cours trouvé").should("exist");
      cy.contains(
        "Il n'y a pas de cours ou de notes disponibles pour ce niveau."
      ).should("exist");
    });
    it("should not display course results when empty list view", () => {
      cy.getByTestid("list-view-toggle").click();
      cy.getByTestid("courses-list-view").should("not.exist");
      cy.contains("Aucun cours trouvé").should("exist");
      cy.contains(
        "Il n'y a pas de cours ou de notes disponibles pour ce niveau."
      ).should("exist");
    });
  });

  describe("display for empty yearly result", () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id!}/yearly_results/L1`,
        {}
      ).as("emptyYearlyResults");
    });
    it("should display empty state when no course results are available on grid view", () => {
      cy.getByTestid("transcript-overview").should("be.visible");
      cy.getByTestid("level").should("contain", `Niveau`);
      cy.getByTestid("status-chip").should("contain", "Non Commencé");
      cy.getByTestid("credits").should("contain", `0 / 60`);
      cy.getByTestid("average-display").should("contain", "0");
      cy.getByTestid("course-result-card").should("not.exist");
      cy.contains("Aucun cours trouvé").should("exist");
      cy.contains(
        "Il n'y a pas de cours ou de notes disponibles pour ce niveau."
      ).should("exist");
    });
  });

  describe("display grades details", () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id!}/courses/${courseResultsMock[0].course?.id!}/grades`,
        gradesInformaticsMock
      ).as("getCourseResults");
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id!}/level`,
        "L1"
      ).as("getStudentLevel");
    });
    it("should display grades details", () => {
      cy.getByTestid("grid-view-toggle").click();
      cy.getByTestid("toggle-details-button").first().click();
      cy.getByTestid("grades-details").should("be.visible");
      cy.getByTestid("grades-details-row").should(
        "have.length",
        gradesInformaticsMock.length
      );
      cy.getByTestid("grades-details-row")
        .first()
        .contains(`${gradesInformaticsMock[0].exam.title}`);
      cy.getByTestid("grades-details-row")
        .first()
        .contains(`${gradesInformaticsMock[0].score.toFixed(2)}/20`);
      cy.getByTestid("grades-details-row")
        .first()
        .contains(`${gradesInformaticsMock[0].exam.coefficient}`);
      cy.getByTestid("grades-details-row")
        .first()
        .contains(
          new Date(
            gradesInformaticsMock[0].exam.examination_date
          ).toLocaleDateString("fr-FR")
        );

      cy.getByTestid("grades-details-row")
        .first()
        .contains(
          new Date(gradesInformaticsMock[0].update_date).toLocaleDateString(
            "fr-FR"
          )
        );
      const examStatus =
        gradesInformaticsMock[0].score >= 10 ? "Validé" : "Non Validé";
      cy.getByTestid("grades-details-row").first().contains(examStatus);
    });
  });
});

describe("display error on overview card", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});
    goToStudentGrades();
    cy.intercept(
      "GET",
      `/students/${studentLinkedToMonitorMock[0].id!}/yearly_results/L1`,
      {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: {message: "Internal Server Error"},
      }
    ).as("getYearlyResults");
  });
  it("should display error message when fetching yearly results fails", () => {
    cy.contains("Erreur lors du chargement des données").should("exist");
  });
});
