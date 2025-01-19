import {
  CreateGroup,
  Group,
  GroupFlow,
  GroupFlowMoveTypeEnum,
  Student,
} from "@haapi/typescript-client";
import {studentsMock} from "./students-mocks";

export const groupsMock: Required<Group>[] = [
  {
    id: "group_id1",
    name: "group_name1",
    ref: "group_ref1",
    size: 4,
    creation_datetime: new Date("2024-01-28"),
    attributed_color: "#ffffff",
  },
  {
    id: "group_id2",
    name: "group_name2",
    ref: "group_ref2",
    size: 4,
    creation_datetime: new Date("2023-02-28"),
    attributed_color: "#ffffff",
  },
  {
    id: "group_id3",
    name: "group_name3",
    size: 4,
    ref: "group_ref3",
    creation_datetime: new Date("2023-04-01"),
    attributed_color: "#ffffff",
  },
  {
    id: "group_id4",
    name: "group_name4",
    ref: "group_ref4",
    size: 4,
    creation_datetime: new Date("2023-04-01"),
    attributed_color: "#ffffff",
  },
];

export const group1Mock = groupsMock[0] as Required<Group>;

export const group1Students = studentsMock.slice(0, 3);

export const group1Student1Mock: Student = group1Students[0];

export const group2Mock = groupsMock[1];

export const leaveGroupFlow: GroupFlow[] = [
  {
    group_id: group1Mock.id,
    move_type: GroupFlowMoveTypeEnum.LEAVE,
    student_id: group1Student1Mock.id,
    id: "group_flow_1",
    flow_datetime: new Date("2023-04-01"),
  },
];

export const moveGroupFlow: GroupFlow[] = [
  {
    group_id: group1Mock.id,
    move_type: GroupFlowMoveTypeEnum.LEAVE,
    student_id: group1Student1Mock.id,
    id: "group_flow_2",
    flow_datetime: new Date("2023-04-01"),
  },
  {
    group_id: group2Mock.id,
    move_type: GroupFlowMoveTypeEnum.JOIN,
    student_id: group1Student1Mock.id,
    id: "group_flow_3",
    flow_datetime: new Date("2023-04-01"),
  },
];

export const groupCreate: CreateGroup = {
  creation_datetime: new Date("2023-04-01"),
  id: "group_3",
  name: "Nouveau groupe",
  ref: "new_group",
  students: group1Students.map((student) => student?.id!),
};
