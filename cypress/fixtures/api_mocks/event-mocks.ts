import { Event, EventParticipant } from "@haapi/typescript-client";
import { courseMock1 } from "./course-mocks";
import { manager1Mock } from "./managers-mocks";
import { student1Mock } from "./students-mocks";

export const eventsMock: Event[] = [
    {
        id: "event1_id",
        type: "COURSE",
        title: "Prog 3",
        description: "Prog pour G1",
        begin_datetime: new Date(),
        end_datetime: new Date(),
        course: courseMock1,
        planner: manager1Mock
    },
    {
        id: "event2_id",
        type: "COURSE",
        title: "WEB 2",
        description: "Web 2 pour G1",
        begin_datetime: new Date(),
        end_datetime: new Date(),
        course: courseMock1,
        planner: manager1Mock
    }
]

export const eventParticipantsMock: EventParticipant[] = [
    {
        id: "event_participant1_id",
        first_name: student1Mock.first_name,
        last_name: student1Mock.last_name,
        ref:student1Mock.ref,
        event_status: "PRESENT",
        group_name: "G1",
    }
]

export const eventparticipant1mock = eventParticipantsMock[0];

export const event1mock = eventsMock[0]