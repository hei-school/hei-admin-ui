import {SmsLog, SmsMessageStatus} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {smsApi} from "./api";

interface SmsCampaignLogFilter {
  campaignId: string;
  status?: SmsMessageStatus;
}

const smsCampaignLogsProvider: HaDataProviderType<
  SmsLog,
  SmsCampaignLogFilter
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: SmsCampaignLogFilter
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
