import {lettersMocks} from "../fixtures/api_mocks/letters-mocks";
import {missingParticipantsMock} from "../fixtures/api_mocks/missing-participants-mock";

describe("Manager.Attendance", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});

    cy.intercept("GET", "/events/stats", {
      missed_stats: {
        total: 12146,
        justified: 339,
        unjustified: 11807,
      },
      present: 27856,
      late: 63,
      total: 40065,
    }).as("getAttendanceStats");

    cy.intercept("GET", "/event_participants?**", missingParticipantsMock).as(
      "getMissingParticipants"
    );

    cy.intercept("GET", "/students/*/letters?**", lettersMocks).as(
      "getLetters"
    );
  });

  it("manager can view attendance statistics", () => {
    cy.visit("/event_participants");
    cy.wait("@getAttendanceStats");

    cy.contains("Absents").should("be.visible");
    cy.contains("12146").should("be.visible");

    cy.get('[data-testid="stat-info-button"]').first().click();
    cy.contains("Absences justifiées").should("be.visible");
    cy.contains("339").should("be.visible");
    cy.contains("Absences non justifiées").should("be.visible");
    cy.contains("11807").should("be.visible");
  });

  it("manager can view absence list with all details", () => {
    cy.visit("/event_participants");
    cy.wait("@getMissingParticipants");

    cy.get(".event-missing-list tbody tr").should("have.length.at.least", 1);

    const firstAbsence = missingParticipantsMock[0];
    cy.get(".event-missing-list tbody tr")
      .first()
      .within(() => {
        cy.contains(firstAbsence.event_participant?.first_name!).should(
          "be.visible"
        );
        cy.contains(firstAbsence.event_participant?.last_name!).should(
          "be.visible"
        );
        cy.contains(firstAbsence.event_participant?.ref!).should("be.visible");

        if (firstAbsence.event?.type === "COURSE") {
          cy.contains(firstAbsence.event?.course?.code!).should("be.visible");
        }
        cy.contains(firstAbsence.event?.title!).should("be.visible");
        cy.contains(firstAbsence.event?.groups?.[0].ref!).should("be.visible");
      });
  });

  it("manager can filter absences by date range", () => {
    cy.visit("/event_participants");

    cy.get('input[name="from"]').type("2025-04-01");
    cy.get('input[name="to"]').type("2025-04-30");

    cy.wait("@getMissingParticipants").then((interception) => {
      expect(interception.request.url).to.include("from=");
      expect(interception.request.url).to.include("to=");
    });
  });

  it("manager can filter absences by group", () => {
    cy.visit("/event_participants");

    cy.intercept("GET", "/groups?**", {
      body: [
        {id: "group_1", ref: "G1", name: "Group One"},
        {id: "group_2", ref: "G2", name: "Group Two"},
      ],
    }).as("getGroups");

    cy.get('[data-testid="group-filter"]').click();
    cy.contains("G1").click();

    cy.wait("@getMissingParticipants").then((interception) => {
      expect(interception.request.url).to.include("groupRef=");
    });
  });

  it("manager can filter absences by student name", () => {
    cy.visit("/event_participants");

    cy.get('input[placeholder*="Rechercher"]').type("John");

    cy.wait("@getMissingParticipants").then((interception) => {
      expect(interception.request.url).to.include("studentName=");
    });
  });

  it("manager can filter absences with justification", () => {
    cy.visit("/event_participants");

    cy.contains("Avec justificatif")
      .parent()
      .find('input[type="checkbox"]')
      .check();

    cy.wait("@getMissingParticipants").then((interception) => {
      expect(interception.request.url).to.include("hasJustification=true");
    });
  });

  it("manager can click on absence card to view details", () => {
    cy.visit("/event_participants");
    cy.wait("@getMissingParticipants");

    cy.get(".event-missing-list tbody tr").first().click();

    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Détails de l'absence").should("be.visible");
  });

  it("manager can view suspended student with visual distinction", () => {
    const suspendedAbsence = {
      ...missingParticipantsMock[0],
      event_participant: {
        ...missingParticipantsMock[0].event_participant,
        status: "SUSPENDED",
      },
    };

    cy.intercept("GET", "/event_participants?**", [suspendedAbsence]).as(
      "getSuspendedAbsences"
    );

    cy.visit("/event_participants");
    cy.wait("@getSuspendedAbsences");

    cy.contains("SUSPENDU").should("be.visible");

    cy.get(".event-missing-list tbody tr")
      .first()
      .should("have.css", "border-left-color")
      .and("match", /rgb\(244, 67, 54\)/);
  });

  it("manager can clear all filters", () => {
    cy.visit("/event_participants");

    cy.get('input[name="from"]').type("2025-04-01");
    cy.get('input[placeholder*="Rechercher"]').type("John");

    cy.get('[data-testid="clear-filters"]').click();
    cy.get('input[name="from"]').should("have.value", "");
    cy.get('input[placeholder*="Rechercher"]').should("have.value", "");
  });

  it("manager can see empty state when no absences", () => {
    cy.intercept("GET", "/event_participants?**", []).as("getNoAbsences");
    cy.intercept("GET", "/events/stats", {
      missed_stats: {total: 0, justified: 0, unjustified: 0},
      present: 100,
      late: 0,
      total: 100,
    }).as("getStatsNoAbsences");

    cy.visit("/event_participants");
    cy.wait("@getNoAbsences");

    cy.contains("Aucune absence enregistrée").should("be.visible");
  });

  it("manager can navigate through pagination", () => {
    const page1Data = missingParticipantsMock.slice(0, 2);
    const page2Data = missingParticipantsMock.slice(2, 4);

    cy.intercept("GET", "/event_participants?*page=1*", page1Data).as(
      "getPage1"
    );
    cy.intercept("GET", "/event_participants?*page=2*", page2Data).as(
      "getPage2"
    );

    cy.visit("/event_participants");
    cy.wait("@getPage1");

    cy.get('[aria-label="Go to next page"]').click();
    cy.wait("@getPage2");

    cy.get(".event-missing-list tbody tr").should(
      "have.length",
      page2Data.length
    );
  });

  it("manager can view attendance statistics breakdown", () => {
    cy.visit("/event_participants");
    cy.wait("@getAttendanceStats");

    cy.contains("Présents").should("be.visible");
    cy.contains("27856").should("be.visible");

    cy.contains("En retard").should("be.visible");
    cy.contains("63").should("be.visible");

    cy.contains("Total").should("be.visible");
    cy.contains("40065").should("be.visible");
  });
});
