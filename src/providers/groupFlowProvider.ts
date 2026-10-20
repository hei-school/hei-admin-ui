import {CreateGroupFlow, GroupFlow} from "@haapi-3d601c85/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupFlowProvider: HaDataProviderType<
  GroupFlow,
  HaFilter,
  HaMeta,
  CreateGroupFlow[],
  unknown,
  GroupFlow[][]
> = {
  getList: notImplemented,
  getOne: notImplemented,
  saveOrUpdate: async (payload) => {
    return await groupsApi()
      .moveOrDeleteStudentInGroup(payload[0].student_id!, payload)
      .then((result) => [result.data]);
  },
  delete: notImplemented,
};

export default groupFlowProvider;
