import {getAxiosInstance} from "@/config/axios";
import authProvider from "@/providers/authProvider";
import {
  AttendanceStatus,
  EventParticipant,
  Student,
} from "@haapi-b0fc7615/typescript-client";

export type PublicStudent = {
  id?: string;
  is_valid?: boolean;
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

const API_URL = process.env.REACT_APP_API_URL;

const authHeaders = () => {
  const {bearer} = authProvider.getCachedWhoami();
  return bearer ? {Authorization: `Bearer ${bearer}`} : {};
};

// A badge scan must answer quickly, or the scanner waits instead of reading the next badge.
const SCAN_REQUEST_TIMEOUT_MS = 10_000;

const publicStudentUrl = (publicId: string) =>
  `${API_URL}students/public/${encodeURIComponent(publicId)}`;

export const getPublicStudent = (publicId: string) =>
  getAxiosInstance()
    .get<PublicStudent>(publicStudentUrl(publicId), {
      timeout: SCAN_REQUEST_TIMEOUT_MS,
    })
    .then((response) => response.data);

export const getStudentByPublicId = (publicId: string) =>
  getAxiosInstance()
    .get<Student>(`${publicStudentUrl(publicId)}/student`, {
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
      `${API_URL}events/${encodeURIComponent(eventId)}/students/public/${encodeURIComponent(publicId)}/attendance`,
      null,
      {
        headers: authHeaders(),
        params: status ? {status} : {},
        timeout: SCAN_REQUEST_TIMEOUT_MS,
      }
    )
    .then((response) => response.data);

export const downloadGroupBadges = (groupId: string) =>
  getAxiosInstance().get<ArrayBuffer>(`${API_URL}students/badges/raw`, {
    headers: {...authHeaders(), Accept: "application/pdf"},
    params: {group_id: groupId},
    responseType: "arraybuffer",
  });

const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

/** PDF with the badge of one student only (from its profile). */
export const downloadStudentBadge = (studentId: string) =>
  getAxiosInstance().get<ArrayBuffer>(`${API_URL}students/badges/raw`, {
    headers: {...authHeaders(), Accept: "application/pdf"},
    params: {student_ids: studentId},
    responseType: "arraybuffer",
  });

const studentBadgeUrl = (studentId: string) =>
  `${API_URL}students/${encodeURIComponent(studentId)}/badge`;

/** The active badge of a student, null when it was never printed or has been removed. */
export const getStudentActiveBadge = (studentId: string) =>
  getAxiosInstance()
    .get<PublicStudent>(studentBadgeUrl(studentId), {headers: authHeaders()})
    .then((response) => response.data)
    .catch((error) => {
      if (httpStatusOf(error) === 404) return null;
      throw error;
    });

/** Its QR code stops working, a new one is generated on the next print. */
export const removeStudentBadge = (studentId: string) =>
  getAxiosInstance()
    .put<PublicStudent>(`${studentBadgeUrl(studentId)}/revocation`, null, {
      headers: authHeaders(),
    })
    .then((response) => response.data);

const ROOT_PUBLIC_ID_PATH =
  /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;

/**
 * Short badge link https://<site>/<public id>: the path is only the public id. No page of
 * the app has a uuid as first path segment, so there is no ambiguity.
 */
export const publicIdFromRootPath = (pathname: string): string | null => {
  const match = pathname.match(ROOT_PUBLIC_ID_PATH);
  return match ? match[1].toLowerCase() : null;
};

export const parsePublicId = (scannedText: string): string | null => {
  const uuids = scannedText.trim().match(UUID_PATTERN);
  return uuids ? uuids[uuids.length - 1].toLowerCase() : null;
};

/** A badge is valid for one academic year: new badges are printed every year. */
export const isBadgeExpired = (badge: PublicStudent) =>
  !!badge.expiration_datetime &&
  new Date(badge.expiration_datetime).getTime() <= Date.now();

export const httpStatusOf = (error: unknown): number | undefined =>
  (error as {response?: {status?: number}})?.response?.status;
