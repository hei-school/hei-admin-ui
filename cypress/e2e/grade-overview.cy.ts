import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {getCourseStatusLabel} from "../../src/operations/grades/utils/constants";
import {
  courseResultsMock,
  yearlyResultL2Mock,
  yearlyResultL3Mock,
  yearlyResultMock,
} from "../fixtures/api_mocks/grades-mocks";
import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {studentLinkedToMonitorMock} from "../fixtures/api_mocks/students-mocks";
import {summaryResultMocks} from "../fixtures/api_mocks/summary-result-mocks";

describe("All View", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=1&page_size=10`,
      studentLinkedToMonitorMock
    ).as("getStudents");
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
    cy.intercept(
      "GET",
      `/students/${studentLinkedToMonitorMock[0].id}/yearly_results/${yearlyResultMock.level}/transcript`,
      {
        status: "AVAILABLE",
        link: "https://preprod-storage-bucket-haapi-bucket-w0nawdbjed2n.s3.eu-west-3.amazonaws.com/LETTERBOX/STD21004/Plateforme%20d%27%C3%A9ducation%20%C3%A0%20l%27entrepreneuriat%20num%C3%A9rique%20JA_%20Se%20connecter%20sur%20le%20site.pdf.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJGMEQCIDs7FqcNhhqQpLeboju46iTpeTeY9Y5HUwuL36V0LFuRAiBiLSekf8ZAuz5S%2BloLuXyHg0fixVksiojEYHxh2jkBHirCAwjW%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE5NDcyMjQyNzIxMyIMqpXuHnMPD6BKVrG2KpYD6RzxwInLeSxgnwq7BHjWS1uLNSJahrbA262w7Ty%2Bkm%2BkbzDtYYpzHjnfDXiziYLgbYy5JzNup%2BUxtmjMgKtpbbVyUe1pG6sf1ni9hLxJa5eWlUogca9pgYgz3xVDk6tXTI4aaH8QeyTBaBfkihR0tf1nIlJozDW3Sw5D6UjIafzd%2FrBzXRWQc5Dj7ySMDcrEBR01uofwliSIlY%2FdQrviOjwxkiUr4l%2B0Eml08rDrAwtA%2BBJP7xlJBAE%2FWjQsfSExVZV4XptyER3WNjV727LfYeOJaz%2BIyqBS6oX5eZFJt4tjcSjol5AioJKNa0Eb0CurXg6KoiwGA4F0Ny9T6SwWM45rYuKuS2rv6qClogQtWsUKveKjVvAzHTyBQYXCfia8oh9fkD3vNKimCBQc7Mq0kTnPJ25qcrfFdVQG%2B1CK7W3d2ONRPNAsUQJXygiKYoJmlHcmcu5ztUeXywpJfQk0%2Fy97JFJVF3AHGjw1XIgQ0fcUCglExuYf%2FpdoBxDBEHvg8z65rz4ruQqVRGD1%2F5gx0C3RRnhn2DDkmJfFBjqfAbwxVf4oV9JqR3CHsvi48bz1bgMm3rtZ3Y9JCd2LGd6pfZ8IUP75P2205Ol7kbT1SCTsluZ%2Fv6gBNfVASaai3YZ880LsN5ACCxfIhjpT%2BPw2etNuTJGoCcZHYYiL4gIUw8LNDcsOhU2hWxNq9hYShL9H%2B%2BTY0GRrvzU%2Fzs38W4HyGZ0GBKXcaqO%2FLCfkQctZSYSFiwSXgiGFHI13kKbrxA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250820T134149Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAS2VS4OFG2AX5NGYL%2F20250820%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=84600&X-Amz-Signature=933af146c71747bd2bf5a39f0d8ee6f459ac77d0a42cbe0307d82a9ac5e06ea6",
      }
    ).as("getTranscript");
  });

  describe("Yearly view", () => {
    it("should display the yearly results correctly", () => {
      cy.get(".download-button").should("exist");
      cy.get(".download-button").click();
      cy.wait("@getTranscript").then((interception) => {
        expect(interception.response!.statusCode).to.eq(200);
        expect(interception.response!.body).to.have.property("link");
      });
    });

    it("should create an anchor and download when transcript is AVAILABLE immediately", () => {
      cy.window().then((win) => {
        const fetchStub = cy.stub(win, "fetch").callsFake((_url: string) =>
          Promise.resolve({
            blob: () =>
              Promise.resolve(new Blob(["dummy"], {type: "application/pdf"})),
          } as unknown as Response)
        );
        const createObjectURLStub = cy
          .stub(win.URL, "createObjectURL")
          .returns("blob:fake-url");
        const revokeObjectURLStub = cy.stub(win.URL, "revokeObjectURL");
        const anchorClickStub = cy.stub(
          win.HTMLAnchorElement.prototype,
          "click"
        );
        const anchorRemoveStub = cy.stub(
          win.HTMLAnchorElement.prototype,
          "remove"
        );

        cy.wrap(fetchStub).as("fetchStub");
        cy.wrap(createObjectURLStub).as("createObjectURL");
        cy.wrap(revokeObjectURLStub).as("revokeObjectURL");
        cy.wrap(anchorClickStub).as("anchorClick");
        cy.wrap(anchorRemoveStub).as("anchorRemove");
      });

      cy.get(".download-button").click();
      cy.wait("@getTranscript");

      cy.get("@fetchStub").should("have.been.called");
      cy.get("@createObjectURL").should("have.been.calledOnce");
      cy.get("@anchorClick").should("have.been.calledOnce");
      cy.get("@anchorRemove").should("have.been.calledOnce");
      cy.get("@revokeObjectURL").should(
        "have.been.calledWith",
        "blob:fake-url"
      );
    });

    it("should poll until transcript becomes AVAILABLE, then download and stop loading", () => {
      let callCount = 0;
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id}/yearly_results/${yearlyResultMock.level}/transcript`,
        (req) => {
          callCount += 1;
          if (callCount === 1) {
            req.reply({status: "PENDING"});
          } else {
            req.reply({
              status: "AVAILABLE",
              link: "https://example.com/file.pdf",
            });
          }
        }
      ).as("pollTranscript");

      cy.window().then((win) => {
        const fetchStub = cy.stub(win, "fetch").callsFake((_url: string) =>
          Promise.resolve({
            blob: () =>
              Promise.resolve(new Blob(["dummy"], {type: "application/pdf"})),
          } as unknown as Response)
        );
        const createObjectURLStub = cy
          .stub(win.URL, "createObjectURL")
          .returns("blob:fake-url");
        const revokeObjectURLStub = cy.stub(win.URL, "revokeObjectURL");
        const anchorClickStub = cy.stub(
          win.HTMLAnchorElement.prototype,
          "click"
        );
        const anchorRemoveStub = cy.stub(
          win.HTMLAnchorElement.prototype,
          "remove"
        );

        cy.wrap(fetchStub).as("fetchStub");
        cy.wrap(createObjectURLStub).as("createObjectURL");
        cy.wrap(revokeObjectURLStub).as("revokeObjectURL");
        cy.wrap(anchorClickStub).as("anchorClick");
        cy.wrap(anchorRemoveStub).as("anchorRemove");
      });

      cy.clock();

      cy.get(".download-button").click();
      cy.wait("@pollTranscript");
      cy.tick(2000);
      cy.wait("@pollTranscript");
      cy.get("@fetchStub").should("have.been.called");
      cy.get("@createObjectURL").should("have.been.calledOnce");
      cy.get("@anchorClick").should("have.been.calledOnce");
      cy.get("@anchorRemove").should("have.been.calledOnce");
      cy.get("@revokeObjectURL").should(
        "have.been.calledWith",
        "blob:fake-url"
      );
    });
  });

  describe("Global summary view", () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id}/results_summary`,
        summaryResultMocks
      ).as("getGlobalSummary");
      cy.getByTestid("global-view-toggle").click();
    });

    it("should display the correct summary information", () => {
      cy.wait("@getGlobalSummary");
      cy.getByTestid("global-summary-card").should("be.visible");
      cy.getByTestid("global-summary-weighted-average").should(
        "contain",
        summaryResultMocks.weighted_average!.toFixed(2)
      );
      cy.getByTestid("global-summary-obtained-credits").should(
        "contain",
        `${summaryResultMocks.obtained_credits}/${summaryResultMocks.total_credits}`
      );
      cy.getByTestid("global-summary-status-chip").should(
        "contain",
        getCourseStatusLabel(summaryResultMocks.status!)
      );
      cy.getByTestid("yearly-result-accordion").should("be.visible");
      cy.getByTestid("yearly-result-accordion")
        .first()
        .within(() => {
          cy.contains(`Année: ${summaryResultMocks?.yearly_results![0].level}`);
          cy.contains(
            getCourseStatusLabel(summaryResultMocks?.yearly_results![0].status!)
          );
          cy.getByTestid("accordion-summary-button").should("be.visible");
        });
    });

    it("should display list all courses", () => {
      cy.wait("@getGlobalSummary");
      cy.getByTestid("yearly-result-accordion")
        .first()
        .within(() => {
          cy.getByTestid("accordion-summary-button").click();
          cy.getByTestid("yearly-result-average").should(
            "contain",
            summaryResultMocks?.yearly_results![0].weighted_average!.toFixed(2)
          );
          cy.getByTestid("yearly-result-credits").should(
            "contain",
            `Crédits: ${summaryResultMocks?.yearly_results![0].obtained_credits} / ${summaryResultMocks?.yearly_results![0].total_credits}`
          );

          cy.getByTestid("courses-lists-row").should(
            "have.length",
            summaryResultMocks?.yearly_results![0].course_results!.length
          );
        });

      cy.getByTestid("courses-lists-row")
        .first()
        .within(() => {
          cy.contains(
            `${
              summaryResultMocks?.yearly_results![0].course_results![0].course
                ?.name
            }`
          );
          cy.contains(
            `${summaryResultMocks?.yearly_results![0].course_results![0].weighted_average!.toFixed(
              2
            )}`
          );
          cy.contains(
            `${
              summaryResultMocks?.yearly_results![0].course_results![0].course
                ?.credits
            }`
          );
          cy.contains(
            `${getCourseStatusLabel(
              summaryResultMocks?.yearly_results![0].course_results![0].status
            )}`
          );
        });
    });

    it("should switch between yearly and global views", () => {
      cy.getByTestid("yearly-view-toggle").click();
      cy.getByTestid("global-view-toggle").click();
    });

    it("should show loading spinner before rendering summary", () => {
      cy.getByTestid("yearly-view-toggle").click();
      cy.intercept(
        "GET",
        `/students/${studentLinkedToMonitorMock[0].id}/results_summary`,
        (req) => req.reply({delay: 400, body: summaryResultMocks})
      ).as("getGlobalSummaryDelayed");

      cy.getByTestid("global-view-toggle").click();
      cy.get('[role="progressbar"]').should("be.visible");

      cy.wait("@getGlobalSummaryDelayed");
      cy.contains("Synthèse Globale").should("be.visible");
      cy.contains("12.45").should("be.visible");
    });
  });
});
