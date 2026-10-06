import {toUTC} from "@/utils/date";
import {CreateGroup, Group} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";
import {groupsApi} from "./api";

interface GroupFilter {
  ref?: string;
  student_ref?: string;
}

type GroupPayload = Omit<CreateGroup, "creation_datetime"> & {
  creation_datetime: string | Date;
};

const groupProvider: HaDataProviderType<
  Group,
  GroupFilter,
  HaMeta,
  GroupPayload[]
> = {
  getList: async (page: number, perPage: number, filter: GroupFilter) => {
    return groupsApi()
      .getGroups(filter.ref, filter.student_ref, page, perPage)
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return groupsApi()
      .getGroupById(id)
      .then((result) => result.data);
  },
  saveOrUpdate: async (payload) => {
    const {creation_datetime, ...group} = payload[0];

    const createGroup = {
      creation_datetime: toUTC(new Date(creation_datetime)),
      ...group,
    };

    return groupsApi()
      .createOrUpdateGroups([createGroup])
      .then((result) => result.data);
  },
  delete: notImplemented,
};

export default groupProvider;
