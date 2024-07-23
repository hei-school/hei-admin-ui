import {Event, EventType} from "@haapi/typescript-client";
import {manager1Mock} from "./managers-mocks";
import {courseMock1} from "./course-mocks";

//FIXME: fix this after client generated
export const eventMocks: (Event & {title: string})[] = [
  {
    id: "event_id1",
    title: "event_title1",
    description: "event_description1",
    begin_datetime: new Date("2021-01-01T00:00:00Z"),
    end_datetime: new Date("2021-01-01T02:05:00Z"),
    type: EventType.COURSE,
    planner: manager1Mock,
    course: courseMock1,
  },
  {
    id: "event_id2",
    title: "event_title2",
    description: "event_description2",
    begin_datetime: new Date("2022-01-01T00:00:00Z"),
    end_datetime: new Date("2022-01-01T02:05:00Z"),
    type: EventType.INTEGRATION,
    planner: manager1Mock,
  },
] as Required<Event & {title: string}>[];

export const eventMock1 = eventMocks[0] as Required<Event & {title: string}>;
