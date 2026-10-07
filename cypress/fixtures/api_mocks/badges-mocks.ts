import {Event, EventParticipant} from "@haapi-b0fc7615/typescript-client";
import type {
  PublicStudent,
  StudentSituation,
} from "../../../src/operations/badges/badgeApi";
import {courseMock1} from "./course-mocks";
import {manager1Mock} from "./managers-mocks";
import {student1Mock} from "./students-mocks";

const HOUR_MS = 60 * 60 * 1000;

export const badgePublicId = "0b9d3f9e-3c55-4a8e-9a43-1f2b3c4d5e6f";
export const unknownBadgePublicId = "11111111-2222-4333-8444-555555555555";

export const badgeLinkOf = (publicId: string) =>
  `https://preprod.admin.hei.school/badges/${publicId}`;

export const badgePageOf = (publicId: string) => `/badges/${publicId}`;

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

export const permanentBadgeMock: PublicStudent = {
  ...validBadgeMock,
  level: "L3",
  expiration_datetime: undefined,
  profile_picture: undefined,
};

export const expiredBadgeMock: PublicStudent = {
  is_valid: false,
  invalidity: "EXPIRED",
};

export const revokedBadgeMock: PublicStudent = {
  is_valid: false,
  invalidity: "REVOKED",
};

export const enabledSituationMock: StudentSituation = {status: "ENABLED"};

export const lateFeesSituationMock: StudentSituation = {
  status: "SUSPENDED",
  suspension_reason: "LATE_FEES",
  late_fees: [
    {label: "Frais de scolarité octobre", due_datetime: "2026-10-15T00:00:00Z"},
    {label: "Assurance", due_datetime: "2026-09-30T00:00:00Z"},
  ],
};

export const otherSuspensionSituationMock: StudentSituation = {
  status: "SUSPENDED",
  suspension_reason: "OTHER",
  late_fees: [],
};

export const scannedParticipantMock: EventParticipant = {
  id: "event_participant1_id",
  first_name: student1Mock.first_name,
  last_name: student1Mock.last_name,
  ref: student1Mock.ref,
  student_id: student1Mock.id,
  event_status: "PRESENT",
  student_status: "ENABLED",
  group_name: "G1",
};

export const suspendedScannedParticipantMock: EventParticipant = {
  ...scannedParticipantMock,
  student_status: "SUSPENDED",
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

// The badge page of the front has the same path as the api: only the api calls are mocked.
export const badgeApiRoute = (publicId: string) => ({
  method: "GET",
  url: `**/badges/${publicId}`,
  resourceType: /xhr|fetch/,
});

export const badgeOwnerRoute = (publicId: string) => ({
  method: "GET",
  url: `**/badges/${publicId}/student`,
});

export const badgeSituationRoute = (publicId: string) => ({
  method: "GET",
  url: `**/badges/${publicId}/situation`,
});

export const badgeAttendanceRoute = (publicId: string, eventId: string) => ({
  method: "PUT",
  url: `**/badges/${publicId}/events/${eventId}/attendance`,
});
