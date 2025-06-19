import {EnableStatus, Organizer, Sex} from "@haapi/typescript-client";

export const organizerMock: Organizer[] = [
  {
    id: "organizer1_id",
    ref: "ORG21001",
    first_name: "Organizer",
    last_name: "One",
    sex: Sex.M,
    nic: "",
    birth_place: "",
    birth_date: "2000-01-01",
    address: "Adr 1",
    phone: "0322411123",
    email: "test+organizer@hei.school",
    entrance_datetime: new Date("2021-11-08T00:00:00Z"),
    status: EnableStatus.ENABLED,
    coordinates: {
      longitude: -123.123,
      latitude: 123.0,
    },
  },
  {
    id: "f23f02b0-4d93-4603-a023",
    ref: "ORG00000",
    first_name: "test",
    last_name: "ikotoary",
    email: "organizer1453@hei.school",
    nic: "454145416252",
    sex: Sex.F,
    birth_date: "2010-01-27",
    birth_place: "hfjhhhhvhk",
    address: "blalala",
    phone: "2123456778",
    entrance_datetime: new Date("2024-08-28T00:00:00Z"),
    coordinates: {
      longitude: 47.5211,
      latitude: 18.9185,
    },
  },
];

export const organizer1Mock = organizerMock[0] as Required<Organizer>;
