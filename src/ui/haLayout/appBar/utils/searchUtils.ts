import {
  EnableStatus,
  Monitor,
  Organizer,
  SearchResultsUser,
  StaffMember,
  Student,
  Teacher,
} from "@haapi-3d601c85/typescript-client";
export interface SearchUser {
  id?: string;
  ref?: string;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role: string;
  status: EnableStatus;
}
export type UserType = StaffMember | Student | Teacher | Organizer | Monitor;
export type NormalizedSearchResults = {
  students: Student[];
  teachers: Teacher[];
  organisers: Organizer[];
  monitors: Monitor[];
  staffMembers: StaffMember[];
};
type ApiUserIdentity = {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  avatar?: string;
  status?: EnableStatus;
};
export const adaptSearchResultsUser = (
  raw?: Partial<Record<string, UserType[]>>
): SearchResultsUser | undefined => {
  if (!raw) return undefined;
  const normalizeUser = <T extends UserType & ApiUserIdentity>(u: T) => ({
    ...u,
    first_name: u.firstName,
    last_name: u.lastName,
    profile_picture: u.profilePicture ?? u.avatar,
    status: u.status,
  });
  return {
    students: (raw.students ?? []).map(normalizeUser),
    teachers: (raw.teachers ?? []).map(normalizeUser),
    monitors: (raw.monitor ?? []).map(normalizeUser),
    staffMembers: (raw.staff ?? []).map(normalizeUser),
  } as SearchResultsUser;
};
const EMPTY_RESULTS: NormalizedSearchResults = {
  students: [],
  teachers: [],
  organisers: [],
  monitors: [],
  staffMembers: [],
};
export const normalizeSearchResults = (
  data?: SearchResultsUser
): NormalizedSearchResults =>
  data
    ? {
        students: data.students ?? [],
        teachers: data.teachers ?? [],
        organisers: data.organisers ?? [],
        monitors: data.monitors ?? [],
        staffMembers: data.staffMembers ?? [],
      }
    : EMPTY_RESULTS;
const mapUserToSearchUser = (
  user: UserType,
  role: SearchUser["role"]
): SearchUser => ({
  id: user.id,
  profile_picture: user.profile_picture,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  ref: user.ref,
  role,
  status: user.status ?? EnableStatus.ENABLED,
});

export const aggregateSearchResults = (
  results: NormalizedSearchResults
): SearchUser[] => [
  ...results.students.map((u) => mapUserToSearchUser(u, "STUDENT")),
  ...results.teachers.map((u) => mapUserToSearchUser(u, "TEACHER")),
  ...results.organisers.map((u) => mapUserToSearchUser(u, "ORGANIZER")),
  ...results.monitors.map((u) => mapUserToSearchUser(u, "MONITOR")),
  ...results.staffMembers.map((u) => mapUserToSearchUser(u, "STAFF")),
];
