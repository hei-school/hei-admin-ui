import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupFlowProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(_id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    return await groupsApi()
      .moveOrDeleteStudentInGroup(payload[0].student_id, payload)
      .then((result) => [result.data]);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default groupFlowProvider;
