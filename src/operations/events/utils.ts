import {EventParticipant} from "@haapi/typescript-client";

export const EVENT_TYPE_VALUE = {
  COURSE: "Cours",
  INTEGRATION: "Intégration",
  SEMINAR: "Séminaire",
  SUPPORT_SESSION: "Entraide",
  OTHER: "Autre",
};

export const ATTENDANCE_STATUS_VALUE = {
  MISSING: "Absent",
  LATE: "En retard",
  PRESENT: "Présent",
};

export const ATTENDANCE_STATUS_COLOR = {
  MISSING: "error",
  LATE: "info",
  PRESENT: "success",
};

export const participantMapper = (participant: EventParticipant) => ({
  "Réf": participant.ref,
  "Prénom": participant.last_name,
  "Nom": participant.first_name,
  "Groupe": participant.group_name,
  "Status": ATTENDANCE_STATUS_VALUE[participant.event_status!],
  "A. Justifié":
    participant.event_status === "MISSING"
      ? participant.letter?.some((letter) => letter.status === "RECEIVED")
        ? "Oui"
        : "Non"
      : "",
});

export const participantHeaders = [
  "Réf",
  "Prénom",
  "Nom",
  "Groupe",
  "Status",
  "A. Justifé",
];
