import {monitoringApi, usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const monitorProvider: HaDataProviderType = {
  async getList(perPage: number, filter: any) {
    const monitorId = filter.monitorId;
    if (!monitorId) {
      throw new Error("Monitor ID is required to fetch students.");
    }
    const result = await monitoringApi().getLinkedStudentsByMonitorId(
      perPage,
      filter.monitorId
    );
    return result.data;
  },

  async getOne(id: string) {
    const result = await usersApi().getStudentById(id);
    return result.data;
  },

  async saveOrUpdate(_payload: any, _meta: any) {
    throw new Error("Operation not supported for monitors.");
  },

  async delete(_id: string) {
    throw new Error("Operation not supported for monitors.");
  },
};

export default monitorProvider;
