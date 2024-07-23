import {CreateEvent, EventType} from "@haapi/typescript-client";
import {courseMock1, courseMocks} from "../fixtures/api_mocks/course-mocks";
import {eventMock1, eventMocks} from "../fixtures/api_mocks/event-mocks";
import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";
import {group1Mock, groupsMock} from "../fixtures/api_mocks/groups-mocks";
import {formatDate} from "../../src/utils/date";
import {getDateTimeString} from "./utils";
import {teacher1Mock, teachersMock} from "../fixtures/api_mocks/teachers-mocks";

//FIXME: fix mock type
type TEMP_EVENT_TYPE = Required<CreateEvent & {title: string; id?: string}>;

const NEW_EVENT: TEMP_EVENT_TYPE = {
  id: "new_event_id1",
  title: "new event",
  description: "new event description",
  begin_datetime: new Date("2022-01-01T00:00:00Z"),
  end_datetime: new Date("2022-01-01T02:05:00Z"),
  planner_id: manager1Mock.id,
  groups: [{id: group1Mock.id}],
  event_type: EventType.COURSE,
  course_id: courseMock1.id,
};

const fillEventInputs = () => {
  cy.get("#title").type(NEW_EVENT.title);
  cy.get("#description").type(NEW_EVENT.description);
  cy.get("#begin_datetime").type(getDateTimeString(NEW_EVENT.begin_datetime));
  cy.get("#end_datetime").type(getDateTimeString(NEW_EVENT.end_datetime));
  cy.get("#course_id").click();
  cy.contains(courseMock1.name).click();
  cy.get("#groups").click();
  cy.contains(group1Mock.ref).click();
};

describe("Manager.CreateEvent", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `/courses?page=1&page_size=499`, courseMocks).as(
      "getCoursesPage1"
    );
    cy.intercept("GET", `/teachers?page=1&page_size=499`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `/groups?page=1&page_size=499`, groupsMock).as(
      "getGroupsPage1"
    );
    cy.intercept("GET", `/events?page=1&page_size=10`, eventMocks).as(
      "getEventsPage1"
    );
    cy.get('[href="#/events"]').click();
    cy.wait("@getEventsPage1");
  });

  it("can list all events", () => {
    cy.get(".event-card")
      .should("have.length", eventMocks.length)
      .first()
      //FIXME: add test for title
      //.contains(eventMock1.title)
      .contains(eventMock1.planner.first_name!)
      .contains(eventMock1.planner.last_name!);
    cy.contains(eventMock1.course.code!);
    cy.contains("Cours");
    cy.contains("Intégration");
    cy.contains(formatDate(eventMock1.begin_datetime, true));
    cy.contains(formatDate(eventMock1.end_datetime, true));
  });

  it("manager can create new event planned by him self", () => {
    cy.intercept("PUT", "/events", [NEW_EVENT]).as("createEvent");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    fillEventInputs();
    cy.get(".RaToolbar-defaultToolbar > .MuiButtonBase-root")
      .as("saveButton")
      .click();

    cy.assertRequestBody("@createEvent", (body) => [
      {
        ...NEW_EVENT,
        id: body[0].id,
        begin_datetime: NEW_EVENT.begin_datetime.toISOString(),
        end_datetime: NEW_EVENT.end_datetime.toISOString(),
      },
    ]);
  });

  it("manager can create new event planned by teacher", () => {
    cy.intercept("PUT", "/events", [NEW_EVENT]).as("createEvent");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    fillEventInputs();
    cy.get("#isPlannedByMe").click();
    cy.get("#planner_id").click();
    cy.contains(teacher1Mock.first_name).click();
    cy.get(".RaToolbar-defaultToolbar > .MuiButtonBase-root")
      .as("saveButton")
      .click();

    cy.assertRequestBody("@createEvent", (body) => [
      {
        ...NEW_EVENT,
        id: body[0].id,
        planner_id: teacher1Mock.id,
        begin_datetime: NEW_EVENT.begin_datetime.toISOString(),
        end_datetime: NEW_EVENT.end_datetime.toISOString(),
      },
    ]);
  });

  it("manager can create new event with type another than course", () => {
    cy.intercept("PUT", "/events", [NEW_EVENT]).as("createEvent");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    fillEventInputs();
    cy.get("#event_type").click();
    cy.should("not.contain", "#course_id");
    cy.get('[data-value="SUPPORT_SESSION"]').click();
    cy.get(".RaToolbar-defaultToolbar > .MuiButtonBase-root")
      .as("saveButton")
      .click();

    cy.assertRequestBody("@createEvent", (body) => {
      const CREATE_EVENT = {...NEW_EVENT} as Partial<TEMP_EVENT_TYPE>;
      delete CREATE_EVENT.course_id;

      return [
        {
          ...CREATE_EVENT,
          id: body[0].id,
          planner_id: manager1Mock.id,
          event_type: EventType.SUPPORT_SESSION,
          begin_datetime: NEW_EVENT.begin_datetime.toISOString(),
          end_datetime: NEW_EVENT.end_datetime.toISOString(),
        },
      ];
    });
  });
});
