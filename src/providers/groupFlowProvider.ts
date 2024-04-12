import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const groupFlowProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    throw new Error("Function not implemented.");
  },
  async getOne(id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    return await teachingApi()
      .moveOrDeleteStudentInGroup(payload[0].studentId, payload)
      .then((result) => [result.data]);
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default groupFlowProvider;
