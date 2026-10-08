import {Mpbs} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";
import {payingApi} from "./api";

interface MpbsVerifyPayload {
  id: string;
  mpbsFile: {rawFile?: File};
}

type VerifiedMpbs = {[index: number]: Mpbs; id: string};

const mpbsVerifyProvider: HaDataProviderType<
  VerifiedMpbs,
  HaFilter,
  HaMeta,
  MpbsVerifyPayload[]
> = {
  getList: notImplemented,
  getOne: notImplemented,
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
  delete: notImplemented,
};

export default mpbsVerifyProvider;
