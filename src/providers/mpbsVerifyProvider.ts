import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

const mpbsVerifyProvider: HaDataProviderType = {
  async getList(_page: number, _perPage: number, _filter: any, _meta: any) {
    throw new Error("Not implemented");
  },
  async getOne(_id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: any, _params: any) {
    const {
      id,
      mpbsFile: {rawFile},
    } = payload[0];
    if (!rawFile) return [];
    return payingApi()
      .verifyMpbs(rawFile)
      .then((result) => {
        return [{...result.data, id}];
      });
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default mpbsVerifyProvider;
