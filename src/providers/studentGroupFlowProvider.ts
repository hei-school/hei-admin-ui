import {GroupFlow, UpdateGroupFlow} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";
import {groupsApi} from "./api";

interface StudentGroupFlowFilter {
  studentId: string;
}

const studentGroupFlowProvider: HaDataProviderType<
  GroupFlow,
  StudentGroupFlowFilter,
  HaMeta,
  UpdateGroupFlow[]
> = {
  getList: async (page, perPage, filter) => {
    const studentId = filter.studentId;
    return groupsApi()
      .getGroupFlowsByStudentId(studentId)
      .then((response) => {
        const start = (page - 1) * perPage;
        return {data: response.data.slice(start, start + perPage)};
      });
  },
  getOne: notImplemented,
  saveOrUpdate: async (payload) => {
    const groupFlow = payload[0];
    const toUpdate: UpdateGroupFlow = {
      group_id: groupFlow.group_id,
      flow_datetime: groupFlow.flow_datetime,
    };
    return groupsApi()
      .updateGroupFlow(groupFlow.id!, toUpdate)
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default studentGroupFlowProvider;
