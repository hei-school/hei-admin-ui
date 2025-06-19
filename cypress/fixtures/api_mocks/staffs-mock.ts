import {
  EnableStatus,
  Sex,
  StaffMember as Staff,
} from "@haapi/typescript-client";

export const staffMock: Staff[] = [
  {
    id: "STF1_id",
    ref: "ADM21001",
    first_name: "Staff",
    last_name: "One",
    sex: Sex.M,
    nic: "",
    birth_place: "",
    birth_date: "2000-01-01",
    address: "Adr 1",
    phone: "0322411123",
    email: "test+staff@hei.school",
    entrance_datetime: new Date("2021-11-08T00:00:00Z"),
    status: EnableStatus.ENABLED,
    coordinates: {
      longitude: -123.123,
      latitude: 123.0,
    },
    ending_service: new Date("2024-10-28T00:00:00Z"),
    cnaps: "string",
    ostie: "string",
    function: "string",
    degree: "string",
  },
  {
    id: "f23f02b0-4d93-4603-a023",
    ref: "STF00000",
    first_name: "test",
    last_name: "ikotoary",
    email: "staff1453@hei.school",
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
    ending_service: new Date("2024-10-28T00:00:00Z"),
    cnaps: "string",
    ostie: "string",
    function: "string",
    degree: "string",
  },
];

export const staff1Mock = staffMock[0] as Required<Staff>;
