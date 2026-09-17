import {
  Course,
  CourseResult,
  CourseResultStatus,
  RetakeExam,
  RetakeExamSession,
  RetakeExamStatus,
  StudentLevel,
  StudentRetakeExam,
  UserIdentifier,
} from "@haapi-b0fc7615/typescript-client";
import {courseMocks} from "./course-mocks";
import {studentsMock} from "./students-mocks";

export const retakeExamSession1Mock: RetakeExamSession = {
  id: "retake_exam_session1_id",
  title: "Session de rattrapage Janvier",
  date_from: new Date("2026-01-12T08:00:00.000Z"),
  date_to: new Date("2026-01-23T12:00:00.000Z"),
  student_levels: [StudentLevel.L1, StudentLevel.L2],
};

export const retakeExamSession2Mock: RetakeExamSession = {
  id: "retake_exam_session2_id",
  title: "Session de rattrapage Juin",
  date_from: new Date("2026-06-08T08:00:00.000Z"),
  date_to: new Date("2026-06-19T12:00:00.000Z"),
  student_levels: [StudentLevel.L3],
};

export const retakeExamSessionsMock: RetakeExamSession[] = [
  retakeExamSession1Mock,
  retakeExamSession2Mock,
];

export const createdRetakeExamSessionMock: RetakeExamSession = {
  id: "retake_exam_session3_id",
  title: "Session de rattrapage Septembre",
  date_from: new Date("2026-09-07T00:00:00.000Z"),
  date_to: new Date("2026-09-18T00:00:00.000Z"),
  student_levels: Object.values(StudentLevel),
};

export const retakeExamCoursesMock: Course[] = [courseMocks[0], courseMocks[1]];

const toUserIdentifier = (index: number): UserIdentifier => {
  const {id, ref, first_name, last_name, email} = studentsMock[index];
  return {id, ref, first_name, last_name, email};
};

export const registeredParticipantMock: StudentRetakeExam = {
  id: "retake_exam1_id",
  student_identifier: toUserIdentifier(0),
  course: courseMocks[0],
  session: retakeExamSession1Mock,
  registration_date: new Date("2026-01-05T09:00:00.000Z"),
  status: RetakeExamStatus.REGISTERED,
};

export const toCancelParticipantMock: StudentRetakeExam = {
  id: "retake_exam2_id",
  student_identifier: toUserIdentifier(1),
  course: courseMocks[0],
  session: retakeExamSession1Mock,
  registration_date: new Date("2026-01-06T09:00:00.000Z"),
  cancel_reason: "Hospitalisation pendant la session",
  status: RetakeExamStatus.TO_CANCEL,
};

export const validatedParticipantMock: StudentRetakeExam = {
  id: "retake_exam3_id",
  student_identifier: toUserIdentifier(2),
  course: courseMocks[0],
  session: retakeExamSession1Mock,
  registration_date: new Date("2026-01-07T09:00:00.000Z"),
  status: RetakeExamStatus.VALIDATE,
};

export const retakeExamParticipantsMock: StudentRetakeExam[] = [
  registeredParticipantMock,
  toCancelParticipantMock,
  validatedParticipantMock,
];

export const retakeExamsToCancelMock: StudentRetakeExam[] = [
  toCancelParticipantMock,
  {
    id: "retake_exam4_id",
    student_identifier: toUserIdentifier(2),
    course: courseMocks[1],
    session: retakeExamSession1Mock,
    registration_date: new Date("2026-01-08T09:00:00.000Z"),
    cancel_reason: "Chevauchement avec un stage",
    status: RetakeExamStatus.TO_CANCEL,
  },
];

export const studentNotRegisteredRetakeExamMock: RetakeExam = {
  id: "student_retake_exam1_id",
  course: courseMocks[0],
  session: retakeExamSession1Mock,
};

export const studentRegisteredRetakeExamMock: RetakeExam = {
  id: "student_retake_exam2_id",
  course: courseMocks[1],
  session: retakeExamSession1Mock,
  registration_date: new Date("2026-01-05T09:00:00.000Z"),
  status: RetakeExamStatus.REGISTERED,
};

export const studentRejectedRetakeExamMock: RetakeExam = {
  id: "student_retake_exam3_id",
  course: courseMocks[2],
  session: retakeExamSession1Mock,
  registration_date: new Date("2026-01-05T09:00:00.000Z"),
  cancel_reason: "Déplacement professionnel",
  rejection_reason: "Justificatif non recevable",
  status: RetakeExamStatus.REGISTERED,
};

export const studentRetakeExamsBySessionMock: RetakeExam[] = [
  studentNotRegisteredRetakeExamMock,
  studentRegisteredRetakeExamMock,
  studentRejectedRetakeExamMock,
];

export const studentIncompleteCourseResultsMock: CourseResult[] = [
  {
    id: "course_result1_id",
    course: courseMocks[0],
    weighted_average: 12.5,
    status: CourseResultStatus.INCOMPLETE,
  },
  {
    id: "course_result2_id",
    course: courseMocks[1],
    weighted_average: 8.75,
    status: CourseResultStatus.INCOMPLETE,
  },
  {
    id: "course_result3_id",
    course: courseMocks[2],
    weighted_average: 4,
    status: CourseResultStatus.INCOMPLETE,
  },
];
