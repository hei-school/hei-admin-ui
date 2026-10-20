import {Promotion} from "@haapi-3d601c85/typescript-client";
import {groupsMock} from "./groups-mocks";

export const promotionsMock: Required<Promotion>[] = [
  {
    id: "promotion_id1",
    ref: "promotion_ref1",
    name: "promotion_name1",
    creation_datetime: new Date("2021-11-08T08:25:24Z"),
    groups: [groupsMock[0], groupsMock[1]],
    cycle: "BACHELOR",
    studentLevels: [],
    cycle_level: "BACHELOR",
  },
  {
    id: "promotion_id2",
    ref: "promotion_ref2",
    name: "promotion_name2",
    creation_datetime: new Date("2025-11-08T08:25:24Z"),
    groups: [groupsMock[2], groupsMock[3]],
    cycle: "BACHELOR",
    studentLevels: [],
    cycle_level: "BACHELOR",
  },
];

export const promotion1Mock = promotionsMock[0];
