import {
  CourseResultStatus,
  ResultOverviewStatus,
  StudentLevel,
} from "@haapi-b0fc7615/typescript-client";

type CourseStatus = CourseResultStatus | ResultOverviewStatus;

export const GRADE_HEADERS = {
  minimal: [
    {id: 1, label: "student_ref", value: "student_ref", disabled: true},
    {id: 2, label: "score", value: "score"},
  ],
  optional: [{id: 3, label: "comment", value: "comment"}],
};

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  VALIDATED: "Validé",
  INVALIDATED: "Non validé",
  IN_PROGRESS: "En cours",
  INCOMPLETE: "Incomplet",
  NOT_STARTED: "Non commencé",
};

const isCourseStatus = (status: string): status is CourseStatus =>
  status in COURSE_STATUS_LABELS;

export const getCourseStatusLabel = (status?: string) => {
  if (status === undefined || !isCourseStatus(status)) return status;
  return COURSE_STATUS_LABELS[status] || status;
};

export const levelChoices = [
  {id: StudentLevel.L1, name: "L1"},
  {id: StudentLevel.L2, name: "L2"},
  {id: StudentLevel.L3, name: "L3"},
];

export const IMPORT_CHOICES = [
  {id: "IMPORT", name: "Nouvelles notes"},
  {id: "UPDATE", name: "Mettre à jours les notes"},
];
