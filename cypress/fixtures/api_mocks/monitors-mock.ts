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
];

export const monitor1Mock = monitorsMock[0] as Required<Monitor>;
