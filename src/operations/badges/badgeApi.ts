import {getAxiosInstance} from "@/config/axios";
import {eventsApi} from "@/providers/api";
import authProvider from "@/providers/authProvider";
import {
  AttendanceStatus,
  EventParticipant,
} from "@haapi-b0fc7615/typescript-client";

export type BadgeInvalidity = "REVOKED" | "EXPIRED";

export type PublicStudent = {
  id?: string;
  is_valid?: boolean;
  invalidity?: BadgeInvalidity;
  academic_year?: string;
  expiration_datetime?: string;
  ref?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  level?: string;
  specialization_field?: string;
  profile_picture?: string;
};

export type StudentSituation = {
  status?: string;
  suspension_reason?: "LATE_FEES" | "OTHER";
  late_fees?: {label?: string; due_datetime?: string}[];
};

const API_URL = process.env.REACT_APP_API_URL;

const authHeaders = () => {
  const {bearer} = authProvider.getCachedWhoami();
  return bearer ? {Authorization: `Bearer ${bearer}`} : {};
};

const SCAN_REQUEST_TIMEOUT_MS = 10_000;

const badgeUrl = (publicId: string) =>
  `${API_URL}badges/${encodeURIComponent(publicId)}`;

export const getPublicStudent = (publicId: string) =>
  getAxiosInstance()
    .get<PublicStudent>(badgeUrl(publicId), {
      timeout: SCAN_REQUEST_TIMEOUT_MS,
    })
    .then((response) => response.data);

export const getBadgeOwner = (publicId: string) =>
  getAxiosInstance()
    .get<{id: string}>(`${badgeUrl(publicId)}/student`, {
      headers: authHeaders(),
      timeout: SCAN_REQUEST_TIMEOUT_MS,
    })
    .then((response) => response.data);

export const getBadgeSituation = (publicId: string) =>
  getAxiosInstance()
    .get<StudentSituation>(`${badgeUrl(publicId)}/situation`, {
      headers: authHeaders(),
      timeout: SCAN_REQUEST_TIMEOUT_MS,
    })
    .then((response) => response.data);

export const checkAttendanceByPublicId = (
  eventId: string,
  publicId: string,
  status?: AttendanceStatus
) =>
  getAxiosInstance()
    .put<EventParticipant>(
      `${badgeUrl(publicId)}/events/${encodeURIComponent(eventId)}/attendance`,
      null,
      {
        headers: authHeaders(),
        params: status ? {status} : {},
        timeout: SCAN_REQUEST_TIMEOUT_MS,
      }
    )
    .then((response) => response.data);

const ATTENDANCE_OPENS_BEFORE_BEGIN_MS = 15 * 60 * 1000;

export const getTeacherEventsInProgress = async (teacherId: string) => {
  const now = Date.now();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const {data: events} = await eventsApi().getEvents(
    1,
    100,
    startOfDay,
    new Date(now + ATTENDANCE_OPENS_BEFORE_BEGIN_MS),
    undefined,
    undefined,
    undefined,
    teacherId
  );
  return events
    .filter(
      (event) =>
        !!event.end_datetime && new Date(event.end_datetime).getTime() >= now
    )
    .sort(
      (a, b) =>
        new Date(b.begin_datetime ?? 0).getTime() -
        new Date(a.begin_datetime ?? 0).getTime()
    );
};

export const downloadGroupBadges = (groupId: string) =>
  getAxiosInstance().get<ArrayBuffer>(`${API_URL}students/badges/raw`, {
    headers: {...authHeaders(), Accept: "application/pdf"},
    params: {group_id: groupId},
    responseType: "arraybuffer",
  });

const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

export const downloadStudentBadge = (studentId: string) =>
  getAxiosInstance().get<ArrayBuffer>(`${API_URL}students/badges/raw`, {
    headers: {...authHeaders(), Accept: "application/pdf"},
    params: {student_ids: studentId},
    responseType: "arraybuffer",
  });

const studentBadgeUrl = (studentId: string) =>
  `${API_URL}students/${encodeURIComponent(studentId)}/badge`;

export const getStudentActiveBadge = (studentId: string) =>
  getAxiosInstance()
    .get<PublicStudent>(studentBadgeUrl(studentId), {headers: authHeaders()})
    .then((response) => response.data)
    .catch((error) => {
      if (httpStatusOf(error) === 404) return null;
      throw error;
    });

export const removeStudentBadge = (studentId: string) =>
  getAxiosInstance()
    .put<PublicStudent>(`${studentBadgeUrl(studentId)}/revocation`, null, {
      headers: authHeaders(),
    })
    .then((response) => response.data);

export const BADGE_PAGE_PATH = "/badges";
const BADGE_PUBLIC_ID_ITEM = "ha_badge_public_id";
const HASH_PUBLIC_ID =
  /^#([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export const hideBadgePublicId = () => {
  const {hash} = window.location;
  if (!hash) return;
  const match = HASH_PUBLIC_ID.exec(hash);
  sessionStorage.setItem(
    BADGE_PUBLIC_ID_ITEM,
    match ? match[1].toLowerCase() : ""
  );
  window.history.replaceState(window.history.state, "", BADGE_PAGE_PATH);
};

export const badgePublicIdOfPage = (): string | null =>
  sessionStorage.getItem(BADGE_PUBLIC_ID_ITEM) || null;

export const parsePublicId = (scannedText: string): string | null => {
  const uuids = scannedText.trim().match(UUID_PATTERN);
  return uuids ? uuids[uuids.length - 1].toLowerCase() : null;
};

export const httpStatusOf = (error: unknown): number | undefined =>
  (error as {response?: {status?: number}})?.response?.status;
