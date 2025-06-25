import {EnableStatus, Monitor, Sex} from "@haapi/typescript-client";

export const monitorsMock: Monitor[] = [
  {
    id: "monitor1_id",
    ref: "MTR21001",
    first_name: "Monitor",
    last_name: "One",
    sex: Sex.M,
    nic: "",
    birth_place: "",
    birth_date: "2000-01-01",
    address: "Adr 1",
    phone: "0322411123",
    email: "test+monitor@hei.school",
    entrance_datetime: new Date("2021-11-08T00:00:00Z"),
    status: EnableStatus.ENABLED,
    coordinates: {
      longitude: -123.123,
      latitude: 123.0,
    },
  },
  {
    id: "f23f02b0-4d93-4603-a023-853b293b7e5f",
    ref: "MT00000",
    first_name: "test",
    last_name: "ikoto",
    email: "rakotonirinaonjaniaina8@gmail.com",
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

export const createdMonitor = {
  id: "monitor1_id_created",
  ref: "MTR210030A",
  first_name: "Monitor create",
  last_name: "One love",
  sex: Sex.M,
  nic: "121239494949",
  birth_place: "Analamahintsy",
  birth_date: "2000-01-01",
  address: "Adr 1",
  phone: "0322411123",
  email: "test+monitor1@hei.school",
  entrance_datetime: new Date("2021-11-08T00:00:00Z"),
  status: EnableStatus.ENABLED,
  coordinates: {
    longitude: -123.123,
    latitude: 123.0,
  },
} as Required<Monitor>;
export const monitor1Mock = monitorsMock[0] as Required<Monitor>;
