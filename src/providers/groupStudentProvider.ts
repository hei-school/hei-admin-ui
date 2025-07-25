import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupStudentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    return await groupsApi()
      .getStudentsByGroupId(meta.groupId, page, perPage, filter.first_name)
      .then((result) => ({data: result.data}));
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
