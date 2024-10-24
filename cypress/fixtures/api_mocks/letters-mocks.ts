import {Letter, LetterStats, LetterStatus} from "@haapi/typescript-client";
import {student1Mock, studentsMock} from "./students-mocks";

export const newLetter: Letter = {
  id: "id_14",
  description: "M5 payment slip",
  creation_datetime: new Date("2024-07-01T08:00:00Z"),
  approval_datetime: new Date("2024-07-02T12:30:00Z"),
  ref: "ref_14",
  status: LetterStatus.RECEIVED,
  file_url: `https://www.example.com/path/to/test_file.pdf`,
  student: student1Mock,
  reason_for_refusal: "",
};

export const newLetter2: Required<Letter>[] = [
  {
    id: "id_14",
    description: "M5 payment slip",
    creation_datetime: new Date("2024-07-01T08:00:00Z"),
    approval_datetime: new Date("2024-07-02T12:30:00Z"),
    ref: "ref_14",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
];

export const student1LettersMocks: Required<Letter>[] = [
  {
    id: "id_1",
    description: "engagement letter",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
    approval_datetime: new Date("2024-02-01T00:00:00Z"),
    ref: "ref_1",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file_1.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_2",
    description: "scholarship slip document",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
    approval_datetime: new Date("2024-02-01T00:00:00Z"),
    ref: "ref_2",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_2.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_3",
    description: "scholarship reimbursement request",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
    approval_datetime: new Date("2024-02-01T00:00:00Z"),
    ref: "ref_3",
    status: LetterStatus.REJECTED,
    file_url: `https://www.example.com/path/to/test_file_3.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "your request does not respect the rules",
  },
  {
    id: "id_4",
    description: "internship confirmation",
    creation_datetime: new Date("2024-02-10T10:30:00Z"),
    approval_datetime: new Date("2024-02-12T12:00:00Z"),
    ref: "ref_4",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_4.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_5",
    description: "graduation certificate",
    creation_datetime: new Date("2024-03-01T09:45:00Z"),
    approval_datetime: new Date("2024-03-02T15:30:00Z"),
    ref: "ref_5",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file_5.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_6",
    description: "study abroad approval letter",
    creation_datetime: new Date("2024-03-10T13:15:00Z"),
    approval_datetime: new Date("2024-03-11T11:20:00Z"),
    ref: "ref_6",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_6.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_7",
    description: "student exchange request",
    creation_datetime: new Date("2024-04-01T08:00:00Z"),
    approval_datetime: new Date("2024-04-05T16:40:00Z"),
    ref: "ref_7",
    status: LetterStatus.REJECTED,
    file_url: `https://www.example.com/path/to/test_file_7.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "insufficient academic performance",
  },
  {
    id: "id_8",
    description: "tuition fee waiver application",
    creation_datetime: new Date("2024-04-15T09:00:00Z"),
    approval_datetime: new Date("2024-04-16T14:30:00Z"),
    ref: "ref_8",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_8.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_9",
    description: "change of program request",
    creation_datetime: new Date("2024-05-01T11:25:00Z"),
    approval_datetime: new Date("2024-05-02T10:00:00Z"),
    ref: "ref_9",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file_9.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_10",
    description: "academic leave request",
    creation_datetime: new Date("2024-05-12T14:10:00Z"),
    approval_datetime: new Date("2024-05-13T09:45:00Z"),
    ref: "ref_10",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_10.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_11",
    description: "attendance confirmation",
    creation_datetime: new Date("2024-06-01T07:50:00Z"),
    approval_datetime: new Date("2024-06-02T12:30:00Z"),
    ref: "ref_11",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_11.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_12",
    description: "academic transcript request",
    creation_datetime: new Date("2024-06-20T15:05:00Z"),
    approval_datetime: new Date("2024-06-21T10:15:00Z"),
    ref: "ref_12",
    status: LetterStatus.REJECTED,
    file_url: `https://www.example.com/path/to/test_file_12.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "incomplete application form",
  },
];

export const statsMocks: LetterStats = {
  pending: 3,
  received: 5,
  rejected: 2,
};

export const firstLetterSelected = student1LettersMocks[0];

export const lettersMocks: Required<Letter>[] = [
  {
    id: "id_1",
    description: "engagement letter",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
    approval_datetime: new Date("2024-02-01T00:00:00Z"),
    ref: "ref_1",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file_1.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_2",
    description: "scholarship slip document",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
    approval_datetime: new Date("2024-02-01T00:00:00Z"),
    ref: "ref_2",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_2.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[1],
    reason_for_refusal: "",
  },
  {
    id: "id_3",
    description: "scholarship reimbursement request",
    creation_datetime: new Date("2024-02-01T00:00:00Z"),
    approval_datetime: new Date("2024-02-01T00:00:00Z"),
    ref: "ref_3",
    status: LetterStatus.REJECTED,
    file_url: `https://www.example.com/path/to/test_file_3.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[3],
    reason_for_refusal: "your request does not respect the rules",
  },
  {
    id: "id_4",
    description: "internship confirmation",
    creation_datetime: new Date("2024-02-10T10:30:00Z"),
    approval_datetime: new Date("2024-02-12T12:00:00Z"),
    ref: "ref_4",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_4.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[1],
    reason_for_refusal: "",
  },
  {
    id: "id_5",
    description: "graduation certificate",
    creation_datetime: new Date("2024-03-01T09:45:00Z"),
    approval_datetime: new Date("2024-03-02T15:30:00Z"),
    ref: "ref_5",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file_5.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[2],
    reason_for_refusal: "",
  },
  {
    id: "id_6",
    description: "study abroad approval letter",
    creation_datetime: new Date("2024-03-10T13:15:00Z"),
    approval_datetime: new Date("2024-03-11T11:20:00Z"),
    ref: "ref_6",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_6.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[1],
    reason_for_refusal: "",
  },
  {
    id: "id_7",
    description: "student exchange request",
    creation_datetime: new Date("2024-04-01T08:00:00Z"),
    approval_datetime: new Date("2024-04-05T16:40:00Z"),
    ref: "ref_7",
    status: LetterStatus.REJECTED,
    file_url: `https://www.example.com/path/to/test_file_7.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[0],
    reason_for_refusal: "insufficient academic performance",
  },
  {
    id: "id_8",
    description: "tuition fee waiver application",
    creation_datetime: new Date("2024-04-15T09:00:00Z"),
    approval_datetime: new Date("2024-04-16T14:30:00Z"),
    ref: "ref_8",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_8.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "",
  },
  {
    id: "id_9",
    description: "change of program request",
    creation_datetime: new Date("2024-05-01T11:25:00Z"),
    approval_datetime: new Date("2024-05-02T10:00:00Z"),
    ref: "ref_9",
    status: LetterStatus.PENDING,
    file_url: `https://www.example.com/path/to/test_file_9.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[2],
    reason_for_refusal: "",
  },
  {
    id: "id_10",
    description: "academic leave request",
    creation_datetime: new Date("2024-05-12T14:10:00Z"),
    approval_datetime: new Date("2024-05-13T09:45:00Z"),
    ref: "ref_10",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_10.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[0],
    reason_for_refusal: "",
  },
  {
    id: "id_11",
    description: "attendance confirmation",
    creation_datetime: new Date("2024-06-01T07:50:00Z"),
    approval_datetime: new Date("2024-06-02T12:30:00Z"),
    ref: "ref_11",
    status: LetterStatus.RECEIVED,
    file_url: `https://www.example.com/path/to/test_file_11.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: studentsMock[2],
    reason_for_refusal: "",
  },
  {
    id: "id_12",
    description: "academic transcript request",
    creation_datetime: new Date("2024-06-20T15:05:00Z"),
    approval_datetime: new Date("2024-06-21T10:15:00Z"),
    ref: "ref_12",
    status: LetterStatus.REJECTED,
    file_url: `https://www.example.com/path/to/test_file_12.pdf`,
    fee: {
      id: "string",
      comment: "string",
      amount: 0,
      type: "TUITION",
    },
    student: student1Mock,
    reason_for_refusal: "incomplete application form",
  },
];
