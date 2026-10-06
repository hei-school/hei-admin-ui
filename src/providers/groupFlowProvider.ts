import {CreateGroupFlow, GroupFlow} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaFilter, HaMeta} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupFlowProvider: HaDataProviderType<
  GroupFlow,
  HaFilter,
  HaMeta,
  CreateGroupFlow[],
  unknown,
  GroupFlow[][]
> = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async (payload) => {
    return await groupsApi()
      .moveOrDeleteStudentInGroup(payload[0].student_id!, payload)
      .then((result) => [result.data]);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default groupFlowProvider;
