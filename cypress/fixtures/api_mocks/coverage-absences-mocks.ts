import {
  AttendanceStatus,
  Event,
  EventAttendance,
  EventParticipant,
  EventType,
  Letter,
  LetterStatus,
  PlaceEnum,
  RoomEnum,
  StudentGlobalAttendance,
} from "@haapi-b0fc7615/typescript-client";
import {student1Mock} from "./students-mocks";

export const ABSENCE_PDF_URL = "https://files.hei.test/letters/absence.pdf";
export const ABSENCE_PDF_URL_2 = "https://files.hei.test/letters/other.pdf";

/**
 * Toute requete XHR/fetch qui n'est pas mockee explicitement repond 404 :
 * aucun appel reseau reel ne part pendant les tests. A declarer avant les
 * autres intercepts, qui restent prioritaires.
 */
export const blockUnmockedApi = () => {
  cy.intercept({resourceType: /xhr|fetch/}, {statusCode: 404, body: {}});
  cy.intercept({hostname: "files.hei.test"}, {statusCode: 404, body: ""});
};

/**
 * Navigue cote client (BrowserRouter) sans recharger l'application
 * instrumentee : un seul chargement de page par test.
 */
export const navigateInApp = (path: string) => {
  cy.getByTestid("main-content").should("exist");
  cy.window().then((win) => {
    win.history.pushState({}, "", path);
    win.dispatchEvent(new win.PopStateEvent("popstate", {state: {}}));
  });
  cy.location().should(({pathname, search}) => {
    expect(`${pathname}${search}`).to.eq(path);
  });
};

export const participationStudentId = student1Mock.id;

export const studentAttendanceMock: StudentGlobalAttendance[] = [
  {
    id: "att_1",
    attendance_status: AttendanceStatus.MISSING,
    title: "Algorithmique",
    description: "Cours magistral d'algorithmique",
    begin_datetime: new Date("2025-03-10T08:00:00Z"),
    end_datetime: new Date("2025-03-10T10:00:00Z"),
    event_type: EventType.COURSE,
    location: {room: RoomEnum.SIGMA, place: PlaceEnum.IVANDRY},
  },
  {
    id: "att_2",
    attendance_status: AttendanceStatus.LATE,
    title: "Examen final",
    begin_datetime: new Date("2025-03-11T08:00:00Z"),
    end_datetime: new Date("2025-03-13T10:00:00Z"),
    event_type: EventType.EXAM,
    location: {place: PlaceEnum.ANDRAHARO},
  },
  {
    id: "att_3",
    attendance_status: AttendanceStatus.PRESENT,
    title: "Seminaire IA",
    begin_datetime: new Date("2025-03-14T08:00:00Z"),
    end_datetime: new Date("2025-03-14T10:00:00Z"),
    event_type: EventType.SEMINAR,
  },
  {
    id: "att_4",
    attendance_status: AttendanceStatus.UNCHECKED,
    title: "Base de donnees",
    begin_datetime: new Date("2025-03-17T08:00:00Z"),
    end_datetime: new Date("2025-03-17T10:00:00Z"),
    event_type: EventType.COURSE,
    location: {},
  },
  {
    id: "att_5",
    attendance_status: AttendanceStatus.JUSTIFIED_ABSENCE,
    title: "Journee d'integration",
    begin_datetime: new Date("2025-03-18T08:00:00Z"),
    end_datetime: new Date("2025-03-18T10:00:00Z"),
    event_type: EventType.INTEGRATION,
  },
];

export const pendingLetterMock: Letter = {
  id: "absence_letter_1",
  ref: "ABS_REF_1",
  description: "Certificat medical",
  status: LetterStatus.PENDING,
  creation_datetime: new Date("2025-03-11T09:00:00Z"),
  file_url: ABSENCE_PDF_URL,
  user: {
    id: student1Mock.id,
    ref: student1Mock.ref,
    first_name: student1Mock.first_name,
    last_name: student1Mock.last_name,
    profile_picture: "https://files.hei.test/pictures/john.png",
  },
};

export const receivedLetterMock: Letter = {
  id: "absence_letter_2",
  ref: "ABS_REF_2",
  description: "Convocation administrative",
  status: LetterStatus.RECEIVED,
  creation_datetime: new Date("2025-03-12T09:00:00Z"),
  approval_datetime: new Date("2025-03-13T09:00:00Z"),
  user: {
    id: "student2_id",
    ref: "STD00025",
    first_name: "Twenty",
    last_name: "Student",
  },
};

export const rejectedLetterMock: Letter = {
  id: "absence_letter_3",
  ref: "ABS_REF_3",
  status: LetterStatus.REJECTED,
  creation_datetime: new Date("2025-03-12T10:00:00Z"),
  reason_for_refusal: "Document illisible",
  file_url: ABSENCE_PDF_URL_2,
};

export const absenceLettersMock: Letter[] = [
  pendingLetterMock,
  receivedLetterMock,
  rejectedLetterMock,
];

type ParticipantWithPicture = EventParticipant & {profile_picture?: string};

export type StaffAbsenceMock = EventAttendance & {
  id: string;
  event: Event;
  event_participant?: ParticipantWithPicture;
};

const staffEvent = (
  id: string,
  overrides: Partial<Event>
): Event & {id: string} => ({
  id,
  type: EventType.SEMINAR,
  title: `Evenement ${id}`,
  color: "#ee5733",
  begin_datetime: new Date("2025-04-10T08:00:00Z"),
  end_datetime: new Date("2025-04-10T10:00:00Z"),
  groups: [],
  ...overrides,
});

export const staffLateAbsence: StaffAbsenceMock = {
  id: "staff_event_1",
  event: staffEvent("staff_event_1", {
    type: EventType.COURSE,
    title: "Algorithmique avancee",
    course: {
      id: "course_algo",
      code: "PROG2",
      name: "Algorithmique",
      credits: 6,
      total_hours: 60,
    },
    location: {room: RoomEnum.SIGMA, place: PlaceEnum.IVANDRY},
    groups: [
      {id: "group_1", ref: "G1", name: "Groupe 1", attributed_color: "#fd7200"},
      {id: "group_2", ref: "G2", name: "Groupe 2", attributed_color: "#0072fd"},
    ],
  }),
  event_participant: {
    id: "staff_participant_1",
    ref: "STD_STAFF_1",
    first_name: "Alice",
    last_name: "Rakoto",
    email: "alice.rakoto@hei.school",
    event_status: AttendanceStatus.LATE,
    profile_picture: "https://files.hei.test/pictures/alice.png",
  },
};

export const staffMissingAbsence: StaffAbsenceMock = {
  id: "staff_event_2",
  event: staffEvent("staff_event_2", {
    type: EventType.EXAM,
    title: "Examen de reseau",
  }),
  event_participant: {
    id: "staff_participant_2",
    ref: "STD_STAFF_2",
    first_name: "Bob",
    last_name: "Rabe",
  },
};

export const staffPresentAbsence: StaffAbsenceMock = {
  id: "staff_event_3",
  event: staffEvent("staff_event_3", {
    title: "Seminaire cloud",
    location: {place: PlaceEnum.ANDRAHARO},
  }),
  event_participant: {
    id: "staff_participant_3",
    ref: "STD_STAFF_3",
    first_name: "Carla",
    last_name: "Randria",
    event_status: AttendanceStatus.PRESENT,
  },
};

export const staffUncheckedAbsence: StaffAbsenceMock = {
  id: "staff_event_4",
  event: staffEvent("staff_event_4", {
    type: EventType.OTHER,
    title: "Atelier libre",
    location: {room: RoomEnum.PI},
  }),
  event_participant: {
    id: "staff_participant_4",
    ref: "STD_STAFF_4",
    first_name: "David",
    last_name: "Rasoa",
    event_status: AttendanceStatus.UNCHECKED,
  },
};

export const staffJustifiedAbsence: StaffAbsenceMock = {
  id: "staff_event_5",
  event: staffEvent("staff_event_5", {
    type: EventType.INTEGRATION,
    title: "Integration L1",
  }),
  event_participant: {
    id: "staff_participant_5",
    ref: "STD_STAFF_5",
    first_name: "Emma",
    last_name: "Rajao",
    event_status: AttendanceStatus.JUSTIFIED_ABSENCE,
  },
};

export const staffNoIdAbsence: StaffAbsenceMock = {
  id: "staff_event_6",
  event: staffEvent("staff_event_6", {title: "Support sans id"}),
  event_participant: {
    ref: "STD_STAFF_6",
    first_name: "Fara",
    last_name: "Ravelo",
    event_status: AttendanceStatus.MISSING,
  },
};

export const staffNoParticipantAbsence: StaffAbsenceMock = {
  id: "staff_event_7",
  event: staffEvent("staff_event_7", {
    type: EventType.OTHER,
    title: "Sans participant",
  }),
};

export const staffAbsencesMock: StaffAbsenceMock[] = [
  staffLateAbsence,
  staffMissingAbsence,
  staffPresentAbsence,
  staffUncheckedAbsence,
  staffJustifiedAbsence,
  staffNoIdAbsence,
  staffNoParticipantAbsence,
];

export const importEventId = "event1_id";

export const IMPORT_PARTICIPANTS_PAGE_SIZE = 50;

export const importParticipantsMock: EventParticipant[] = Array.from(
  {length: IMPORT_PARTICIPANTS_PAGE_SIZE},
  (_, index) => ({
    id: `import_participant_${index + 1}`,
    student_id: `import_student_${index + 1}`,
    ref: `STD_IMP_${index + 1}`,
    first_name: `Prenom${index + 1}`,
    last_name: `Nom${index + 1}`,
    email: `etudiant${index + 1}@hei.school`,
    event_status: AttendanceStatus.UNCHECKED,
    group_name: "G1",
  })
);
