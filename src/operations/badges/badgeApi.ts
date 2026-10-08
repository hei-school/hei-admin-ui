import {getAxiosInstance} from "@/config/axios";
import {eventsApi, groupsApi} from "@/providers/api";
import authProvider from "@/providers/authProvider";
import {
  AttendanceStatus,
  EnableStatus,
  EventParticipant,
  Student,
} from "@haapi-b0fc7615/typescript-client";
import {decryptBadge} from "./badgeCipher";

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
  suspension_reason?: "LATE_FEES" | "OTHER";
  late_fees?: {label?: string; due_datetime?: string}[];
};

export type BadgeAttendance = {
  result?: "CHECKED" | "NO_COURSE_IN_PROGRESS" | "NOT_PARTICIPANT";
  event_title?: string;
  course_code?: string;
};

const API_URL = process.env.REACT_APP_API_URL;

const authHeaders = () => {
  const {bearer} = authProvider.getCachedWhoami();
  return bearer ? {Authorization: `Bearer ${bearer}`} : {};
};

const SCAN_REQUEST_TIMEOUT_MS = 10_000;

const badgeUrl = (publicId: string) =>
  `${API_URL}badges/${encodeURIComponent(publicId)}`;

const BADGE_PAGE_TIMEOUT_MS = 30_000;

const onceMoreWithoutAnswer = async <T>(call: () => Promise<T>) => {
  try {
    return await call();
  } catch (error) {
    const status = httpStatusOf(error);
    if (status !== undefined && status < 500) throw error;
    return call();
  }
};

export const getPublicStudent = (publicId: string) =>
  onceMoreWithoutAnswer(() =>
    getAxiosInstance().get<{payload: string}>(badgeUrl(publicId), {
      timeout: BADGE_PAGE_TIMEOUT_MS,
    })
  ).then(({data}) => decryptBadge<PublicStudent>(data.payload, publicId));

export const getBadgeOwner = (publicId: string) =>
  onceMoreWithoutAnswer(() =>
    getAxiosInstance().get<{id: string}>(`${badgeUrl(publicId)}/student`, {
      headers: authHeaders(),
      timeout: BADGE_PAGE_TIMEOUT_MS,
    })
  ).then((response) => response.data);

export const checkBadgeAttendance = (publicId: string) =>
  onceMoreWithoutAnswer(() =>
    getAxiosInstance().put<BadgeAttendance>(
      `${badgeUrl(publicId)}/attendance`,
      null,
      {headers: authHeaders(), timeout: BADGE_PAGE_TIMEOUT_MS}
    )
  ).then((response) => response.data);

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

const UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

const downloadBadgesOf = (studentIds: string[]) =>
  getAxiosInstance().get<ArrayBuffer>(`${API_URL}students/badges/raw`, {
    headers: {...authHeaders(), Accept: "application/pdf"},
    params: {student_ids: studentIds.join(",")},
    responseType: "arraybuffer",
  });

export const downloadStudentBadge = (studentId: string) =>
  downloadBadgesOf([studentId]);

export const saveBadgesPdf = (data: ArrayBuffer, fileName: string) => {
  const url = window.URL.createObjectURL(
    new Blob([data], {type: "application/pdf"})
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const BADGES_PER_FILE = 30;
const GROUP_STUDENTS_PAGE_SIZE = 100;

const byName = (a: Student, b: Student) =>
  `${a.last_name ?? ""} ${a.first_name ?? ""} ${a.ref ?? ""}`.localeCompare(
    `${b.last_name ?? ""} ${b.first_name ?? ""} ${b.ref ?? ""}`,
    "fr",
    {sensitivity: "base"}
  );

const groupStudentsOf = async (groupId: string) => {
  const students: Student[] = [];
  for (let page = 1; ; page++) {
    const {data} = await groupsApi().getStudentsByGroupId(
      groupId,
      page,
      GROUP_STUDENTS_PAGE_SIZE
    );
    students.push(...data);
    if (data.length < GROUP_STUDENTS_PAGE_SIZE) return students;
  }
};

export type GroupBadgesResult = {
  students: number;
  files: number;
};

export const downloadGroupBadges = async (
  groupId: string,
  groupRef: string
): Promise<GroupBadgesResult> => {
  // a student who left the school gets no badge any more
  const studentIds = (await groupStudentsOf(groupId))
    .filter((student) => student.status !== EnableStatus.DISABLED)
    .sort(byName)
    .map((student) => student.id!);
  const chunks: string[][] = [];
  for (let start = 0; start < studentIds.length; start += BADGES_PER_FILE) {
    chunks.push(studentIds.slice(start, start + BADGES_PER_FILE));
  }
  let files = 0;
  for (const [index, ids] of chunks.entries()) {
    try {
      const {data} = await downloadBadgesOf(ids);
      files++;
      const part = chunks.length === 1 ? "" : `-${index + 1}`;
      saveBadgesPdf(data, `badges-${groupRef}${part}.pdf`);
    } catch (error) {
      if (httpStatusOf(error) !== 400) throw error;
    }
  }
  return {students: studentIds.length, files};
};

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
const APP_PAGES_UNDER_BADGES = ["scan", "attendance"];
const BADGE_PUBLIC_ID_ITEM = "ha_badge_public_id";
const PUBLIC_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const segmentsOf = (pathname: string) =>
  pathname.replace(/\/+$/, "").split("/").slice(1);

export const isBadgePagePath = (pathname: string) => {
  const [first, second, ...others] = segmentsOf(pathname);
  return (
    first === "badges" &&
    others.length === 0 &&
    (second === undefined || !APP_PAGES_UNDER_BADGES.includes(second))
  );
};

export const publicIdOfBadgePath = (pathname: string): string | null => {
  const [, second] = segmentsOf(pathname);
  if (second === undefined) return null;
  return PUBLIC_ID.test(second) ? second.toLowerCase() : "";
};

export const rememberBadgePublicId = (publicId: string) =>
  sessionStorage.setItem(BADGE_PUBLIC_ID_ITEM, publicId);

export const badgePublicIdOfPage = (): string | null =>
  sessionStorage.getItem(BADGE_PUBLIC_ID_ITEM) || null;

export const parsePublicId = (scannedText: string): string | null => {
  const uuids = scannedText.trim().match(UUID_PATTERN);
  return uuids ? uuids[uuids.length - 1].toLowerCase() : null;
};

export const httpStatusOf = (error: unknown): number | undefined =>
  (error as {response?: {status?: number}})?.response?.status;
