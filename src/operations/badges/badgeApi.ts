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

export const parsePublicId = (scannedText: string): string | null => {
  const uuids = scannedText.trim().match(UUID_PATTERN);
  return uuids ? uuids[uuids.length - 1].toLowerCase() : null;
};

export const httpStatusOf = (error: unknown): number | undefined =>
  (error as {response?: {status?: number}})?.response?.status;
