import {Cor} from "@haapi-b0fc7615/typescript-client";
import {manager1Mock} from "./managers-mocks";
import {teacher1Mock} from "./teachers-mocks";

export const corMock: Cor[] = [
  {
    id: "COR001",
    description: "Absence répétée en cours",
    interview_date: new Date("2025-10-02T08:44:57.554Z"),
    concerned_student: {
      id: "STD001",
      ref: "STD000001",
      first_name: "Rabe",
      last_name: "Rakoto",
      email: "rabe.rakoto@example.com",
      nic: "123456789",
    },
    creation_datetime: new Date("2025-10-02T08:44:57.554Z"),
    interviewers: [teacher1Mock, manager1Mock],
    status: "IN_PROGRESS",
    comments: [
      {
        comment: "Étudiant convoqué pour absence répétée.",
        creation_date: new Date("2025-10-02T09:00:00.000Z"),
      },
    ],
  },
  {
    id: "COR002",
    description: "Comportement irrespectueux envers un enseignant",
    interview_date: new Date("2025-10-03T09:30:00.000Z"),
    concerned_student: {
      id: "STD002",
      ref: "STD000002",
      first_name: "Fara",
      last_name: "Andrianina",
      email: "fara.andrianina@example.com",
      nic: "987654321",
    },
    interviewers: [teacher1Mock, manager1Mock],

    creation_datetime: new Date("2025-10-03T09:00:00.000Z"),
    status: "LEAVE",
    comments: [
      {
        comment: "Signalement initial après le cours de mathématiques.",
        creation_date: new Date("2025-10-03T09:15:00.000Z"),
      },
    ],
  },
  {
    id: "COR003",
    description: "Retard fréquent aux cours",
    interview_date: new Date("2025-10-04T10:00:00.000Z"),
    concerned_student: {
      id: "STD003",
      ref: "STD000003",
      first_name: "Hery",
      last_name: "Randrianarivelo",
      email: "hery.randrianarivelo@example.com",
      nic: "192837465",
    },
    interviewers: [teacher1Mock, manager1Mock],
    creation_datetime: new Date("2025-10-04T08:30:00.000Z"),
    status: "CANCELED",
    comments: [
      {
        comment: "L'étudiant a justifié ses retards.",
        creation_date: new Date("2025-10-04T11:00:00.000Z"),
      },
    ],
  },
  {
    id: "COR004",
    description: "Non-respect du règlement intérieur",
    interview_date: new Date("2025-10-05T14:00:00.000Z"),
    concerned_student: {
      id: "STD004",
      ref: "STD000004",
      first_name: "Lova",
      last_name: "Rasolonjatovo",
      email: "lova.rasolonjatovo@example.com",
      nic: "564738291",
    },
    interviewers: [teacher1Mock, manager1Mock],
    creation_datetime: new Date("2025-10-05T12:15:00.000Z"),
    status: "NO_SHOW",
    comments: [
      {
        comment: "Cas signalé par le surveillant général.",
        creation_date: new Date("2025-10-05T12:30:00.000Z"),
      },
    ],
  },
  {
    id: "COR005",
    description: "Non remise de devoirs",
    interview_date: new Date("2025-10-06T15:00:00.000Z"),
    concerned_student: {
      id: "STD005",
      ref: "STD000005",
      first_name: "Tiana",
      last_name: "Randriamanana",
      email: "tiana.randriamanana@example.com",
      nic: "019283746",
    },
    interviewers: [teacher1Mock, manager1Mock],
    creation_datetime: new Date("2025-10-06T13:45:00.000Z"),
    status: "IN_PROGRESS",
    comments: [
      {
        comment:
          "Professeur de physique a signalé plusieurs devoirs manquants.",
        creation_date: new Date("2025-10-06T14:00:00.000Z"),
      },
    ],
  },
  {
    id: "COR006",
    description: "Mauvais comportement en classe",
    interview_date: new Date("2025-10-07T16:30:00.000Z"),
    concerned_student: {
      id: "STD006",
      ref: "STD000006",
      first_name: "Soa",
      last_name: "Andriambelo",
      email: "soa.andriambelo@example.com",
      nic: "675849302",
    },
    interviewers: [teacher1Mock, manager1Mock],
    creation_datetime: new Date("2025-10-07T15:00:00.000Z"),
    status: "STAY",
    comments: [
      {
        comment: "Le problème a été résolu après un entretien.",
        creation_date: new Date("2025-10-07T17:00:00.000Z"),
      },
    ],
  },
];

export const corMock1 = corMock[0] as Required<Cor>;
