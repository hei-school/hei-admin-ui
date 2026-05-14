import {toUTC} from "@/utils/date";
import {HaDataProviderType} from "./HaDataProviderType";
import {groupsApi} from "./api";

const groupProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {ref?: string; student_ref?: string}
  ) => {
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
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default groupProvider;
