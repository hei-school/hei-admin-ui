import {
  CrupdateSmsContactGroup,
  SmsContactGroupDetail,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaMeta} from "./HaDataProviderType";
import {smsApi} from "./api";

interface SmsContactGroupFilter {
  search?: string;
}

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    id?: string;
  };
};

// la liste et les mutations renvoient des SmsContactGroup, getOne le détail
// avec les membres
const smsContactGroupsProvider: HaDataProviderType<
  SmsContactGroupDetail,
  SmsContactGroupFilter,
  HaMeta,
  CrupdateSmsContactGroup[],
  Params
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: SmsContactGroupFilter = {}
  ) => {
    const {data} = await smsApi().getSmsContactGroups(
      page,
      perPage,
      filter.search
    );
    return {data};
  },
  getOne: async (id: string) => {
    const {data} = await smsApi().getSmsContactGroupById(id);
    return data;
  },
  saveOrUpdate: async (
    payload: Array<CrupdateSmsContactGroup>,
    {meta}: Params
  ) => {
    if (meta.method === "UPDATE" && meta.id) {
      return smsApi()
        .updateSmsContactGroup(meta.id, payload[0])
        .then((result) => [result.data]);
    }
    return smsApi()
      .createSmsContactGroup(payload[0])
      .then((result) => [result.data]);
  },
  delete: async (id: string) => {
    return smsApi()
      .deleteSmsContactGroup(id)
      .then((response) => response.data);
  },
};

export default smsContactGroupsProvider;
