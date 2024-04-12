import { GroupFlowMoveTypeEnum } from "@haapi/typescript-client";
import { group1, group1Students, groups, student1 } from "./groups-api";

const group2 = groups[1];
export const createGroupFlow = (
  id: string,
  moveType: GroupFlowMoveTypeEnum,
  groupId: string,
  studentId: string,
) => ({
  id: id,
  MoveType: moveType,
  groupId: groupId,
  studentId: studentId,
});

export const leaveGroupFlow = [
  createGroupFlow(
    "groupflow_1",
    GroupFlowMoveTypeEnum.LEAVE,
    group1.id,
    group1Students[0]?.id!,
  ),
];
export const migrateGroupFlow = [
  createGroupFlow(
    "groupflow_2",
    GroupFlowMoveTypeEnum.LEAVE,
    group1.id,
    group1Students[0]?.id!,
  ),
  createGroupFlow(
    "groupflow_2",
    GroupFlowMoveTypeEnum.JOIN,
    group2.id,
    group1Students[0]?.id!,
  ),
];
export const addGroupFlow = [
  createGroupFlow(
    "groupflow_3",
    GroupFlowMoveTypeEnum.JOIN,
    group1.id,
    student1?.id!,
  ),
];
