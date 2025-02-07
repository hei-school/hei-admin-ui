import {mapToChoices} from "@/utils";

export const EVENT_TYPE_VALUE = {
  COURSE: "Cours",
  INTEGRATION: "Intégration",
  SEMINAR: "Séminaire",
  SUPPORT_SESSION: "Entraide",
  OTHER: "Autre",
  EXAM: "Examen",
} as const;

export const ATTENDANCE_STATUS_VALUE = {
  MISSING: "Absent",
  LATE: "En retard",
  PRESENT: "Présent",
};

export const ATTENDANCE_STATUS = mapToChoices(
  ATTENDANCE_STATUS_VALUE,
  "id",
  "name"
);

export const ATTENDANCE_STATUS_COLOR = {
  MISSING: "error",
  LATE: "info",
  PRESENT: "success",
};

export const CLASSROOM_CHOICES = [
  {label: "Salle F", value: "F"},
  {label: "Salle R", value: "R"},
  {label: "Salle Pi", value: "Pi"},
  {label: " Salle Sigma", value: "Sigma"},
  {label: "Salle Algebre", value: "Algebre"},
  {label: "Salle B", value: "B"},
  {label: "Salle NP", value: "NP"},
  {label: "Autre", value: "autre"},
];

export const RECURRENCE_TYPE_CHOICES = [
  {value: "MONDAY", label: "  Lundis"},
  {value: "TUESDAY", label: "Mardis"},
  {value: "WEDNESDAY", label: "Mercredis"},
  {value: "THURSDAY", label: "Jeudis"},
  {value: "FRIDAY", label: "Vendredis"},
  {value: "SATURDAY", label: "Samedis"},
];
