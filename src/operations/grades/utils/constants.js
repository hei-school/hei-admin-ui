import {StudentLevel} from "@haapi/typescript-client";

export const GRADE_HEADERS = {
  minimal: [
    {id: 1, label: "Référence", value: "student_ref", disabled: true},
    {id: 2, label: "Note", value: "grade.score", disabled: true},
  ],
  optional: [],
};

export const COURSE_STATUS_LABELS = {
  VALIDATED: "Validé",
  IN_PROGRESS: "En cours",
  INCOMPLETE: "Incomplet",
  NOT_STARTED: "Non commencé",
};

export const getCourseStatusLabel = (status) => {
  return COURSE_STATUS_LABELS[status] || status;
};

export const levelChoices = [
  {id: StudentLevel.L1, name: "Licence 1"},
  {id: StudentLevel.L2, name: "Licence 2"},
  {id: StudentLevel.L3, name: "Licence 3"},
];
