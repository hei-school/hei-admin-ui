import {
  SmsContact,
  SmsContactOwnerRole,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {smsApi} from "./api";

interface SmsContactFilter {
  contactGroupId?: string;
  ownerRole?: SmsContactOwnerRole;
  search?: string;
}

const notImplemented = () => {
  throw new Error("Not implemented");
};

const smsContactsProvider: HaDataProviderType<SmsContact, SmsContactFilter> = {
  getList: async (
    page: number,
    perPage: number,
    filter: SmsContactFilter = {}
  ) => {
    const {data} = await smsApi().getSmsContacts(
      page,
      perPage,
      filter.contactGroupId,
      filter.ownerRole,
      filter.search
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
