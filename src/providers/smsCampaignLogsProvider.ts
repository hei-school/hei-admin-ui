import {SmsMessageStatus} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {smsApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const smsCampaignLogsProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {campaignId: string; status?: SmsMessageStatus}
  ) => {
    const {data} = await smsApi().getSmsCampaignLogs(
      filter.campaignId,
      page,
      perPage,
      filter.status
    );
    return {data};
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default smsCampaignLogsProvider;
