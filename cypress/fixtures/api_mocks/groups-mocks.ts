import {Group} from "@haapi/typescript-client";

export const groupsMock: Required<Group>[] = [
  {
    id: "group_id1",
    name: "group_name1",
    ref: "group_ref1",
    creation_datetime: new Date("2024-01-28"),
  },
  {
    id: "group_id2",
    name: "group_name2",
    ref: "group_ref2",
    creation_datetime: new Date("2023-02-28"),
  },
  {
    id: "group_id3",
    name: "group_name3",
    ref: "group_ref3",
    creation_datetime: new Date("2023-04-01"),
  },
  {
    id: "group_id4",
    name: "group_name4",
    ref: "group_ref4",
    creation_datetime: new Date("2023-04-01"),
  },
];

export const group1Mock = groupsMock[0] as Required<Group>;
