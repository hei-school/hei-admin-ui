import {SmsContactOwnerRole} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {smsApi} from "./api";

const notImplemented = () => {
  throw new Error("Not implemented");
};

const smsContactsProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {contactGroupId?: string; ownerRole?: SmsContactOwnerRole} = {}
  ) => {
    const {data} = await smsApi().getSmsContacts(
      page,
      perPage,
      filter.contactGroupId,
      filter.ownerRole
    );
    return {data};
  },
  getOne: async (id: string) => {
    const {data} = await smsApi().getSmsContactById(id);
    return data;
  },
  saveOrUpdate: notImplemented,
  delete: async (id: string) => {
    return smsApi()
      .deleteSmsContact(id)
      .then((response) => response.data);
  },
};

export default smsContactsProvider;
