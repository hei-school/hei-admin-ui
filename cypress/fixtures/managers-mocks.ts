import {EnableStatus, Manager, Sex} from "@haapi/typescript-client";

export const managersMock: Manager[] = [
  {
    id: "manager1_id",
    ref: "MGR21001",
    first_name: "Lou",
    last_name: "Manager",
    sex: Sex.M,
    nic: "123456789101",
    birth_place: "A78 Ambohitrarahaba",
    birth_date: "1890-01-01",
    address: "A78 Ambohitrarahaba",
    phone: "0322411127",
    email: "test+manager1@hei.school",
    entrance_datetime: new Date("2021-09-08T08:25:29Z"),
    status: EnableStatus.ENABLED,
  },
];

export const manager1Mock = managersMock[0] as Required<Manager>;
export const editedManager1: Required<Manager> = {
  id: "manager1_id",
  ref: "MGR21001",
  first_name: manager1Mock.first_name,
  last_name: "Andria",
  sex: Sex.M,
  nic: "123456789101",
  birth_place: "A78 Ambohitrarahaba",
  birth_date: "1995-01-01",
  address: "A78 Ambohitrarahaba",
  phone: "0322411127",
  email: "test+manager1@hei.school",
  entrance_datetime: new Date("2021-09-08T08:25:29Z"),
  status: EnableStatus.ENABLED,
  coordinates: {latitude: 0, longitude: 0},
  high_school_origin: "",
  profile_picture: "",
};
