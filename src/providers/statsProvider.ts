import {DEFAULT_ID} from "@/utils/constants";
import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const statsProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any) {
    throw new Error("Not implemented");
  },
  async getOne(_id: string) {
    return await teachingApi()
      .getGroups(1, 25)
      .then((result) => ({...result.data, id: DEFAULT_ID}));
  },
  async saveOrUpdate(_payload: any) {
    throw new Error("Not implemented");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default statsProvider;
