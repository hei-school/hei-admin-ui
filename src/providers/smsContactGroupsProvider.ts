import {CrupdateSmsContactGroup} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {smsApi} from "./api";

type Params = {
  meta: {
    method: "CREATE" | "UPDATE";
    id?: string;
  };
};

const smsContactGroupsProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number) => {
    const {data} = await smsApi().getSmsContactGroups(page, perPage);
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
