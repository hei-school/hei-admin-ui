import {Event} from "@haapi/typescript-client";
import {courseMock1} from "./course-mocks";
export const calendarMock: Event[] = [
  {
    id: "01d30489-1e8f-41f2-9b7b-b5c42f7e34dd",
    type: "INTEGRATION",
    title: "F",
    color: "#f6bf26",
    description: "",
    begin_datetime: (() => {
      const d = new Date();
      d.setHours(8, 0, 0, 0);
      return d;
    })(),
    end_datetime: (() => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      return d;
    })(),
    planner: {
      id: "manager1_id",
      ref: "MGR21001",
      first_name: "One",
      last_name: "Managers",
      email: "test+manager1@hei.school",
      nic: "117311034456",
    },
    course: courseMock1,
    groups: [
      {
        attributed_color: "",
        id: "e1d64863-9207-46ad-b829-cc0abf4fe25a",
        name: "nouveau groupe",
        ref: "new",
      },
    ],
    count: {
      missing: 0,
      present: 0,
      late: 0,
      total: 23,
    },
  },
  {
    id: "eedb8d3d-6818-4732-8b89-d96bee73ddf9",
    type: "COURSE",
    title: "Pi",
    color: "#0000FF",
    description: "",
    begin_datetime: (() => {
      const d = new Date();
      d.setHours(8, 0, 0, 0);
      return d;
    })(),
    end_datetime: (() => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      return d;
    })(),
    planner: {
      id: "manager1_id",
      ref: "MGR21001",
      first_name: "One",
      last_name: "Managers",
      email: "test+manager1@hei.school",
      nic: "117311034456",
    },
    course: {
      id: "32271a61-44b9-4eb9-a3c4-3fa2b925ee29",
      code: "PROG ",
      name: "Algorithme",
      credits: 5,
      total_hours: 4,
    },
    groups: [
      {
        attributed_color: "#0000FF",
        id: "5490d252-090f-40a4-9d93-fdc9403700be",
        name: "tests",
        ref: "K1",
      },
    ],
    count: {
      missing: 0,
      present: 0,
      late: 0,
      total: 0,
    },
  },
];

export const nextcalendarMock: Event[] = [
  {
    id: "01d30489-1e8f-41f2-9b7b-b5c42f7e34dd",
    type: "INTEGRATION",
    title: "F",
    color: "#f6bf26",
    description: "",
    begin_datetime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(8, 0, 0, 0);
      return d;
    })(),
    end_datetime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(12, 0, 0, 0);
      return d;
    })(),
    planner: {
      id: "manager1_id",
      ref: "MGR21001",
      first_name: "One",
      last_name: "Managers",
      email: "test+manager1@hei.school",
      nic: "117311034456",
    },
    course: courseMock1,
    groups: [
      {
        attributed_color: "",
        id: "e1d64863-9207-46ad-b829-cc0abf4fe25a",
        name: "nouveau groupe",
        ref: "new",
      },
    ],
    count: {
      missing: 0,
      present: 0,
      late: 0,
      total: 23,
    },
  },
  {
    id: "eedb8d3d-6818-4732-8b89-d96bee73ddf9",
    type: "COURSE",
    title: "Pi",
    color: "#0000FF",
    description: "",
    begin_datetime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(8, 0, 0, 0);
      return d;
    })(),
    end_datetime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(12, 0, 0, 0);
      return d;
    })(),
    planner: {
      id: "manager1_id",
      ref: "MGR21001",
      first_name: "One",
      last_name: "Managers",
      email: "test+manager1@hei.school",
      nic: "117311034456",
    },
    course: courseMock1,
    groups: [
      {
        attributed_color: "",
        id: "e1d64863-9207-46ad-b829-cc0abf4fe25a",
        name: "nouveau groupe",
        ref: "new",
      },
    ],
    count: {
      missing: 0,
      present: 0,
      late: 0,
      total: 23,
    },
  },
  {
    id: "eedb8d3d-6818-4732-8b89-d96bee73ddf9",
    type: "COURSE",
    title: "Pi",
    color: "#0000FF",
    description: "",
    begin_datetime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(8, 0, 0, 0);
      return d;
    })(),
    end_datetime: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(12, 0, 0, 0);
      return d;
    })(),
    planner: {
      id: "manager1_id",
      ref: "MGR21001",
      first_name: "One",
      last_name: "Managers",
      email: "test+manager1@hei.school",
      nic: "117311034456",
    },
    course: {
      id: "32271a61-44b9-4eb9-a3c4-3fa2b925ee29",
      code: "PROG ",
      name: "Algorithme",
      credits: 5,
      total_hours: 4,
    },
    groups: [
      {
        attributed_color: "#0000FF",
        id: "5490d252-090f-40a4-9d93-fdc9403700be",
        name: "tests",
        ref: "K1",
      },
    ],
    count: {
      missing: 0,
      present: 0,
      late: 0,
      total: 0,
    },
  },
];
