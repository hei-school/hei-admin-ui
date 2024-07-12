import {toUTC} from "@/utils/date";
import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const groupProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return await teachingApi()
      .getGroups(filter.ref, filter.student_ref, page, perPage)
      .then((result) => result.data);
  },
  async getOne(id: string) {
    return await teachingApi()
      .getGroupById(id)
      .then((result) => result.data);
  },
  async saveOrUpdate(payload: any) {
    const {creation_datetime, ...group} = payload[0];

    const createGroup = {
      creation_datetime: toUTC(new Date(creation_datetime)),
      ...group,
    };

    return await teachingApi()
      .createOrUpdateGroups([createGroup])
      .then((result) => result.data);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default groupProvider;
