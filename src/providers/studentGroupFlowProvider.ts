import {UpdateGroupFlow} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi} from "./api";

const studentGroupFlowProvider: HaDataProviderType = {
  getList: async (page, perPage, filter) => {
    const studentId = filter.studentId as string;
    return groupsApi()
      .getGroupFlowsByStudentId(studentId)
      .then((response) => {
        const start = (page - 1) * perPage;
        return {data: response.data.slice(start, start + perPage)};
      });
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async (payload) => {
    const groupFlow = payload[0];
    const toUpdate: UpdateGroupFlow = {
      group_id: groupFlow.group_id,
      flow_datetime: groupFlow.flow_datetime,
    };
    return groupsApi()
      .updateGroupFlow(groupFlow.id, toUpdate)
      .then((response) => [response.data]);
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentGroupFlowProvider;
