import {Comment} from "@haapi/typescript-client";
import {manager1Mock, managersMock} from "./managers-mocks";
import {student1Mock, studentsMock} from "./students-mocks";
import {teacher1Mock, teachersMock} from "./teachers-mocks";

export const student1CommentMocks: Required<Comment>[] = [
  {
    id: "id_1",
    subject: student1Mock,
    observer: {...manager1Mock, role: "MANAGER"},
    content: "You were late for the class",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
  },
  {
    id: "id_2",
    subject: student1Mock,
    observer: {...teacher1Mock, role: "TEACHER"},
    content: "You were late again for the class",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_3",
    subject: student1Mock,
    observer: {...manager1Mock, role: "MANAGER"},
    content: "First time your are not late",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_4",
    subject: student1Mock,
    observer: {...teacher1Mock, role: "TEACHER"},
    content: "I'm so happy about you, you are so good at the class",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_5",
    subject: student1Mock,
    observer: {...teachersMock[1], role: "TEACHER"},
    content: "You are so good at the class",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
  },
  {
    id: "id_6",
    subject: student1Mock,
    observer: {...teacher1Mock, role: "TEACHER"},
    content: "You were late again for the class",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_7",
    subject: student1Mock,
    observer: {...manager1Mock, role: "MANAGER"},
    content: "First time your are not late",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_8",
    subject: student1Mock,
    observer: {...teacher1Mock, role: "TEACHER"},
    content: "I'm so happy about you, you are so good at the class",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_9",
    subject: student1Mock,
    observer: {...teacher1Mock, role: "TEACHER"},
    content: "I'm so happy about you, you are so good at the class",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_10",
    subject: student1Mock,
    observer: {...teachersMock[1], role: "TEACHER"},
    content: "You are so good at the class",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
  },
  {
    id: "id_11",
    subject: student1Mock,
    observer: {...teacher1Mock, role: "TEACHER"},
    content: "You were late again for the class",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
  {
    id: "id_12",
    subject: student1Mock,
    observer: {...manager1Mock, role: "MANAGER"},
    content: "First time your are not late",
    creation_datetime: new Date("2024-03-01T00:00:00Z"),
  },
];

export const student1CommentMock1 = student1CommentMocks[0];

export const commentMocks = [
  ...student1CommentMocks,
  {
    id: "id_3",
    subject: studentsMock[1],
    observer: {...managersMock[1], role: "MANAGER"},
    content: "You were late for the class",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
  },
];

export const commentMock1 = commentMocks[0];
