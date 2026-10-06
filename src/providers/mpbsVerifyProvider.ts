import {Mpbs} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaFilter, HaMeta} from "./HaDataProviderType";
import {payingApi} from "./api";

interface MpbsVerifyPayload {
  id: string;
  mpbsFile: {rawFile?: File};
}

// la réponse (un tableau de Mpbs) est étalée dans un objet avec l'id du payload
type VerifiedMpbs = {[index: number]: Mpbs; id: string};

const mpbsVerifyProvider: HaDataProviderType<
  VerifiedMpbs,
  HaFilter,
  HaMeta,
  MpbsVerifyPayload[]
> = {
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
