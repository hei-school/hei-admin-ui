import {
  SmsCampaign,
  SmsCampaignStatus,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {smsApi} from "./api";

interface SmsCampaignFilter {
  status?: SmsCampaignStatus;
}

const smsCampaignsProvider: HaDataProviderType<SmsCampaign, SmsCampaignFilter> =
  {
    getList: async (
      page: number,
      perPage: number,
      filter: SmsCampaignFilter = {}
    ) => {
      const {data} = await smsApi().getSmsCampaigns(
        page,
        perPage,
        filter.status
      );
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
