import {
  Complaint,
  ComplaintStatusHistory,
} from "@haapi-3d601c85/typescript-client";

export const complaintMock: Complaint[] = [
  {
    id: "COMPLAINT001",
    type: "ACADEMIC",
    title: "Note de contrôle continu erronée",
    description: "La note affichée ne correspond pas à ma copie corrigée.",
    status: "CREATED",
    student: {
      id: "STD001",
      ref: "STD000001",
      first_name: "Rabe",
      last_name: "Rakoto",
      email: "rabe.rakoto@example.com",
    },
    assignees: [],
    created_at: new Date("2025-10-02T08:44:57.554Z"),
  },
  {
    id: "COMPLAINT002",
    type: "FINANCIAL",
    title: "Frais de scolarité déjà payés",
    description: "Un rappel de paiement a été envoyé alors que j'ai déjà payé.",
    status: "IN_PROGRESS",
    student: {
      id: "STD002",
      ref: "STD000002",
      first_name: "Fara",
      last_name: "Andrianina",
      email: "fara.andrianina@example.com",
    },
    assignees: [
      {
        id: "STAFF001",
        ref: "STAFF000001",
        first_name: "Jean",
        last_name: "Rakotondrabe",
        email: "jean.rakotondrabe@example.com",
      },
    ],
    created_at: new Date("2025-10-03T09:00:00.000Z"),
  },
];

export const complaintStatusHistoryMock: ComplaintStatusHistory[] = [
  {
    status: "CREATED",
    comment: undefined,
    changed_by: {
      id: "STD001",
      first_name: "Rabe",
      last_name: "Rakoto",
    },
    datetime: new Date("2025-10-02T08:44:57.554Z"),
  },
  {
    status: "IN_PROGRESS",
    comment: "Prise en charge par le service académique.",
    changed_by: {
      id: "STAFF001",
      first_name: "Jean",
      last_name: "Rakotondrabe",
    },
    datetime: new Date("2025-10-03T10:00:00.000Z"),
  },
];
