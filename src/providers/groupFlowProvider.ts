import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupFlowProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Function not implemented.");
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async (payload) => {
    return await groupsApi()
      .moveOrDeleteStudentInGroup(payload[0].student_id, payload)
      .then((result) => [result.data]);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default groupFlowProvider;
