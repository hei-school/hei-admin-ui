import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const groupStudentProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any, meta: any) {
    return await teachingApi()
      .getStudentsByGroupId(meta.groupId)
      .then((result) => {
        return result.data;
      });
  },
  async getOne(_id: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(_payload: any) {
    throw new Error("Function not implemented.");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default groupStudentProvider;
