import {Event, EventParticipant} from "@haapi-b0fc7615/typescript-client";
import type {PublicStudent} from "../../../src/operations/badges/badgeApi";
import {courseMock1} from "./course-mocks";
import {manager1Mock} from "./managers-mocks";
import {student1Mock} from "./students-mocks";

const HOUR_MS = 60 * 60 * 1000;

export const badgePublicId = "0b9d3f9e-3c55-4a8e-9a43-1f2b3c4d5e6f";
export const unknownBadgePublicId = "11111111-2222-4333-8444-555555555555";

export const badgeLinkOf = (publicId: string) =>
  `https://preprod.admin.hei.school/public/students/${publicId}`;

export const validBadgeMock: PublicStudent = {
  id: badgePublicId,
  is_valid: true,
  academic_year: "2026 - 2027",
  expiration_datetime: new Date(Date.now() + 200 * 24 * HOUR_MS).toISOString(),
  ref: student1Mock.ref,
  first_name: student1Mock.first_name,
  last_name: student1Mock.last_name,
  status: "ENABLED",
  level: "L2",
  specialization_field: "EL",
  profile_picture:
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
};

export const expiredBadgeMock: PublicStudent = {
  ...validBadgeMock,
  is_valid: false,
  academic_year: "2025 - 2026",
  expiration_datetime: new Date(Date.now() - 24 * HOUR_MS).toISOString(),
  profile_picture: undefined,
};

export const revokedBadgeMock: PublicStudent = {
  ...validBadgeMock,
  is_valid: false,
  status: "SUSPENDED",
};

export const scannedParticipantMock: EventParticipant = {
  id: "event_participant1_id",
  first_name: student1Mock.first_name,
  last_name: student1Mock.last_name,
  ref: student1Mock.ref,
  student_id: student1Mock.id,
  event_status: "PRESENT",
  group_name: "G1",
};

const courseInProgress = (
  id: string,
  title: string,
  beganHoursAgo: number
): Event => ({
  id,
  type: "COURSE",
  title,
  description: `${title} pour G1`,
  begin_datetime: new Date(Date.now() - beganHoursAgo * HOUR_MS),
  end_datetime: new Date(Date.now() + HOUR_MS),
  course: courseMock1,
  planner: manager1Mock,
  groups: [{id: "group_id1", ref: "G1", name: "Groupe 1"}],
});

export const teacherCourseInProgressMock = courseInProgress(
  "event_in_progress1_id",
  "Prog 3",
  0.5
);

export const teacherOtherCourseInProgressMock = courseInProgress(
  "event_in_progress2_id",
  "WEB 2",
  1
);

export const finishedCourseMock: Event = {
  ...teacherCourseInProgressMock,
  id: "event_finished_id",
  end_datetime: new Date(Date.now() - HOUR_MS),
};
