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
    if (!payload) return null;

    return await teachingApi()
      .moveOrDeleteStudentInGroup(payload.studentId, payload)
      .then((result) => result.data);
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default groupFlowProvider;
