import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {
  courseResultsMock,
  emptyYearlyResultMock,
  yearlyResultL2Mock,
  yearlyResultL3Mock,
  yearlyResultMock,
} from "../fixtures/api_mocks/grades-mocks";
import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {studentLinkedToMonitorMock} from "../fixtures/api_mocks/students-mocks";

describe("GradesDashboard Component - Extended Tests", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=1&page_size=10`,
      studentLinkedToMonitorMock
    ).as("getStudents");
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=1&page_size=15`,
      studentLinkedToMonitorMock
    ).as("getStudentOne");
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=2&page_size=10`,

      studentLinkedToMonitorMock
    ).as("getStudents2");
    cy.get('[href="/monitors/monitor1_id/students"]').click();
    cy.wait("@getStudents");
    cy.contains(studentLinkedToMonitorMock[0].first_name!).click();
    cy.getByTestid("grades-tab").click();
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

    it("should handle course grid view ", () => {
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
        .contains(`${courseResultsMock[0]?.course?.credits} crédits ECTS`);
    });

    it("should handle course list view ", () => {
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
    it("should filter courses to L2", () => {
      cy.getByTestid("level-select").click();
      cy.get('[data-value="L2"]').click();
      cy.wait("@getYearlyResults2");
      cy.getByTestid("transcript-overview").should("be.visible");
      cy.getByTestid("level").should(
        "contain",
        `Niveau ${yearlyResultL2Mock.level}`
      );
      cy.getByTestid("average-display").should(
        "contain",
        yearlyResultL2Mock.weighted_average!.toFixed(2)
      );
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${yearlyResultL2Mock?.course_results?.[0]?.course?.name} (${yearlyResultL2Mock?.course_results?.[0]?.course?.code})`
        );
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${yearlyResultL2Mock?.course_results?.[0]?.weighted_average?.toFixed(2)}/20`
        );
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${yearlyResultL2Mock?.course_results?.[0]?.course?.credits} crédits ECTS`
        );
    });

    it("should filter courses to L3", () => {
      cy.getByTestid("level-select").click();
      cy.get('[data-value="L3"]').click();
      cy.wait("@getYearlyResults3");
      cy.getByTestid("transcript-overview").should("be.visible");
      cy.getByTestid("level").should(
        "contain",
        `Niveau ${yearlyResultL3Mock.level}`
      );
      cy.getByTestid("average-display").should(
        "contain",
        yearlyResultL3Mock.weighted_average!.toFixed(2)
      );
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${yearlyResultL3Mock?.course_results?.[0]?.course?.name} (${yearlyResultL3Mock?.course_results?.[0]?.course?.code})`
        );
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${yearlyResultL3Mock?.course_results?.[0]?.weighted_average?.toFixed(2)}/20`
        );
      cy.getByTestid("course-result-card")
        .first()
        .contains(
          `${yearlyResultL3Mock?.course_results?.[0]?.course?.credits} crédits ECTS`
        );
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
});
