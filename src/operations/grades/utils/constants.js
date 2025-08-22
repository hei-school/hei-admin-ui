import {StudentLevel} from "@haapi-b0fc7615/typescript-client";

export const GRADE_HEADERS = {
  minimal: [
    {id: 1, label: "Référence", value: "student_ref", disabled: true},
    {id: 2, label: "Note", value: "grade.score", disabled: true},
  ],
  optional: [],
};

export const COURSE_STATUS_LABELS = {
  VALIDATED: "Validé",
  INVALIDATED: "Non validé",
  IN_PROGRESS: "En cours",
  INCOMPLETE: "Incomplet",
  NOT_STARTED: "Non commencé",
};

export const getCourseStatusLabel = (status) => {
  return COURSE_STATUS_LABELS[status] || status;
};

export const levelChoices = [
  {id: StudentLevel.L1, name: "L1"},
  {id: StudentLevel.L2, name: "L2"},
  {id: StudentLevel.L3, name: "L3"},
];
