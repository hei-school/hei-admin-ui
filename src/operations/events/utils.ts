import {mapToChoices} from "@/utils";
import {Event, PlaceEnum, RoomEnum} from "@haapi-3d601c85/typescript-client";
import {FC} from "react";

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
  UNCHECKED: "Non défini",
  PRESENT: "Présent",
};

export const ATTENDANCE_STATUS = mapToChoices(
  ATTENDANCE_STATUS_VALUE,
  "id",
  "name"
);

export const ATTENDANCE_STATUS_COLOR = {
  MISSING: "error",
  UNCHECKED: "info",
  PRESENT: "success",
};

export const CLASSROOM_CHOICES = [
  {label: "Salle Pi", value: RoomEnum.PI},
  {label: " Salle Sigma", value: RoomEnum.SIGMA},
  {label: "Salle Algebre", value: RoomEnum.ALGEBRE},
  {label: "Salle B", value: RoomEnum.B},
  {label: "Salle NP", value: RoomEnum.NP},
  {label: "Autre", value: RoomEnum.UNKNOWN},
];

export const PLACE_CHOICES = [
  {label: "Ivandry", value: PlaceEnum.IVANDRY},
  {label: "Andraharo", value: PlaceEnum.ANDRAHARO},
  {label: "Autre", value: PlaceEnum.UNKNOWN},
];
export const RECURRENCE_TYPE_CHOICES = [
  {value: "MONDAY", label: "  Lundis"},
  {value: "TUESDAY", label: "Mardis"},
  {value: "WEDNESDAY", label: "Mercredis"},
  {value: "THURSDAY", label: "Jeudis"},
  {value: "FRIDAY", label: "Vendredis"},
  {value: "SATURDAY", label: "Samedis"},
];

export const EventTitle: FC<{event: Event}> = ({event}) => {
  return `
  [${
    event.groups?.length
      ? event.groups.map((group) => group.ref).join(", ")
      : EVENT_TYPE_VALUE[event.type!]
  }] ${
    event.location?.room && String(event.location.room).trim() !== ""
      ? event.location.room
      : event.title
  } ${
    event.type === "OTHER"
      ? (event.title ?? event.description)
      : (event.course?.code ?? event.title)
  }`;
};
