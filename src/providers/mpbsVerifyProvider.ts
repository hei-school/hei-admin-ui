import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

const mpbsVerifyProvider: HaDataProviderType = {
  getList: () => {
    throw new Error("Not implemented");
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (payload) => {
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
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default mpbsVerifyProvider;
