import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const groupProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, _filter: any) {
    return await teachingApi()
      .getGroups(page, perPage)
      .then((result) => result.data);
  },
  async getOne(id: string) {
    return await teachingApi()
      .getGroupById(id)
      .then((result) => result.data);
  },
  async saveOrUpdate(payload: any) {
    return await teachingApi()
      .createOrUpdateGroups(payload)
      .then((result) => result.data);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default groupProvider;
