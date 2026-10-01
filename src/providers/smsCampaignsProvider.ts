import {SmsCampaignStatus} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {smsApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const smsCampaignsProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {status?: SmsCampaignStatus} = {}
  ) => {
    const {data} = await smsApi().getSmsCampaigns(page, perPage, filter.status);
    return {data};
  },
  getOne: async (id: string) => {
    const {data} = await smsApi().getSmsCampaignById(id);
    return data;
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default smsCampaignsProvider;
