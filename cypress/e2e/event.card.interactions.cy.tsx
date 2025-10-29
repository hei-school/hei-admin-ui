import {courseMocks} from "../fixtures/api_mocks/course-mocks";
import {event1mock, eventsMock} from "../fixtures/api_mocks/event-mocks";
import {groupsMock} from "../fixtures/api_mocks/groups-mocks";

describe("Event.Card.Interactions", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});

    cy.intercept("GET", "/events?**", eventsMock).as("getEvents");
    cy.intercept("GET", `/events/${event1mock.id}`, event1mock).as("getEvent");
    cy.intercept("GET", "/groups?**", groupsMock).as("getGroups");
    cy.intercept("GET", "/courses?**", courseMocks).as("getCourses");
  });

  it("manager can see event card with all information", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .within(() => {
        cy.contains(event1mock.title!).should("be.visible");
        cy.contains(event1mock.description!).should("be.visible");

        if (event1mock.planner) {
          cy.contains(event1mock.planner.first_name!).should("be.visible");
          cy.contains(event1mock.planner.last_name!).should("be.visible");
        }
        if (event1mock.type === "COURSE" && event1mock.course) {
          cy.contains(event1mock.course.code!).should("be.visible");
        }

        if (event1mock.groups && event1mock.groups.length > 0) {
          cy.contains(event1mock.groups[0].ref!).should("be.visible");
        }
      });
  });

  it("event card has colored border based on type", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .should(($card) => {
        const borderTopColor = $card.css("border-top-color");
        const borderBottomColor = $card.css("border-bottom-color");

        expect(borderTopColor).to.not.equal("rgb(0, 0, 0)");
        expect(borderBottomColor).to.not.equal("rgb(0, 0, 0)");
      });
  });

  it("event card scales on hover", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .should("have.css", "transform", "none");
    cy.get('[data-testid="event-card"]').first().trigger("mouseover");

    cy.get('[data-testid="event-card"]')
      .first()
      .should("have.css", "transform")
      .and("include", "scale");
  });

  it("edit button appears on hover", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .find('[data-testid="edit-event-fab"]')
      .should("not.be.visible");
    cy.get('[data-testid="event-card"]').first().trigger("mouseover");

    cy.get('[data-testid="event-card"]')
      .first()
      .find('[data-testid="edit-event-fab"]')
      .should("be.visible");
  });

  it("clicking event card navigates to participants page", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.intercept("GET", `/events/${event1mock.id}/participants?**`, []).as(
      "getParticipants"
    );

    cy.get('[data-testid="event-card"]').first().click();

    cy.url().should("include", `/events/${event1mock.id}/participants`);
  });

  it("clicking edit button opens dialog without navigation", () => {
    cy.intercept("PUT", `/events/${event1mock.id}`, event1mock).as(
      "updateEvent"
    );

    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-event-fab"]').first().click({force: true});

    cy.get('[role="dialog"]').should("be.visible");
    cy.url().should("include", "/events");
    cy.url().should("not.include", "/participants");
  });

  it("event card shows attendance statistics", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="stat-card"]').should("exist");

        if (event1mock.count) {
          cy.contains("Présents").should("be.visible");
          cy.contains("Absents").should("be.visible");
        }
      });
  });

  it("event card shows event type tag", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="event-type-tag"]').should("exist");
      });
  });

  it("event card shows date and time", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="calendar-icon"]').should("exist");

        const eventDate = new Date(event1mock.begin_datetime!);
        const formattedDate = eventDate.toLocaleDateString("fr-FR");
        cy.contains(formattedDate).should("be.visible");
      });
  });

  it("event card shows organizer with avatar", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    if (event1mock.planner) {
      cy.get('[data-testid="event-card"]')
        .first()
        .within(() => {
          cy.contains("Organisateur").should("be.visible");
          cy.get('[data-testid="organizer-avatar"]').should("exist");
        });
    }
  });

  it("event card shows course information for COURSE type", () => {
    const courseEvent = eventsMock.find((e) => e.type === "COURSE");

    if (courseEvent) {
      cy.visit("/events");
      cy.wait("@getEvents");

      cy.contains(courseEvent.title!)
        .parent()
        .within(() => {
          cy.contains("Cours").should("be.visible");
          if (courseEvent.course) {
            cy.contains(courseEvent.course.code!).should("be.visible");
          }
        });
    }
  });

  it("event card shows groups with badges", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    if (event1mock.groups && event1mock.groups.length > 0) {
      cy.get('[data-testid="event-card"]')
        .first()
        .within(() => {
          cy.contains("Groupes").should("be.visible");

          event1mock.groups!.forEach((group) => {
            cy.contains(group.ref!).should("be.visible");
          });
        });
    }
  });

  it("event card shows view attendance button", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .within(() => {
        cy.contains("Voir les présences").should("be.visible");
      });
  });

  it("event card description is truncated if too long", () => {
    const longDescriptionEvent = {
      ...event1mock,
      description:
        "This is a very long description that should be truncated to only show two lines maximum. This is a very long description that should be truncated to only show two lines maximum.",
    };

    cy.intercept("GET", "/events?**", [longDescriptionEvent]).as(
      "getLongEvents"
    );

    cy.visit("/events");
    cy.wait("@getLongEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="event-description"]').should(($desc) => {
          const lineClamp = $desc.css("-webkit-line-clamp");
          expect(lineClamp).to.equal("2");
        });
      });
  });

  it("different event types have different colors", () => {
    const courseEvent = {...event1mock, type: "COURSE"};
    const examEvent = {...event1mock, type: "EXAM", id: "exam_event"};

    cy.intercept("GET", "/events?**", [courseEvent, examEvent]).as(
      "getMixedEvents"
    );

    cy.visit("/events");
    cy.wait("@getMixedEvents");

    cy.contains(courseEvent.title!)
      .parent()
      .should("have.css", "border-top-color")
      .and("match", /rgb\(102, 126, 234\)/);
    cy.contains(examEvent.title!)
      .parent()
      .should("have.css", "border-top-color")
      .and("match", /rgb\(255, 193, 7\)/);
  });

  it("event card has shadow effect", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .should(($card) => {
        const boxShadow = $card.css("box-shadow");
        expect(boxShadow).to.not.equal("none");
      });
  });

  it("event card has rounded corners", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]')
      .first()
      .should(($card) => {
        const borderRadius = $card.css("border-radius");
        expect(borderRadius).to.equal("7px");
      });
  });

  it("manager can see multiple event cards in grid layout", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]').should("have.length.at.least", 1);
    cy.get('[data-testid="events-grid"]').should("have.css", "display", "grid");
  });

  it("event card is responsive", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.viewport(1920, 1080);
    cy.get('[data-testid="event-card"]').first().should("be.visible");

    cy.viewport(768, 1024);
    cy.get('[data-testid="event-card"]').first().should("be.visible");

    cy.viewport(375, 667);
    cy.get('[data-testid="event-card"]').first().should("be.visible");
  });

  it("edit button has tooltip", () => {
    cy.visit("/events");
    cy.wait("@getEvents");

    cy.get('[data-testid="event-card"]').first().trigger("mouseover");
    cy.get('[data-testid="edit-event-fab"]').first().trigger("mouseover");
    cy.contains("Modifier l'événement").should("be.visible");
  });

  it("event card shows only for authorized roles", () => {
    cy.mockLogin({role: "STUDENT"});

    cy.visit("/events");

    cy.url().should("not.include", "/events");
    cy.url().should("not.include", "/events");
  });
});
