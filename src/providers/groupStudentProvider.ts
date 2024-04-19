import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const groupStudentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    return await teachingApi()
      .getStudentsByGroupId(meta.groupId)
      .then((result) => {
        return result.data;
      });
  },
  async getOne(id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(payload: any) {
    throw new Error("Function not implemented.");
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default groupStudentProvider;
