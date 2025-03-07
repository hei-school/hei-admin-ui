export const OwnerType = {
  SCHOOL: "SCHOOL",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  STAFF_MEMBER: "STAFF_MEMBER",
} as const;

export type OwnerType = (typeof OwnerType)[keyof typeof OwnerType];
