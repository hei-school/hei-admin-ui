import {monitoringApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import authProvider from "@/providers/authProvider";

const monitorStudentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, _filter: any) {
    const monitorId = authProvider.getCachedWhoami()?.id;

    if (!monitorId) {
      throw new Error("Monitor ID is required.");
    }
    const result = await monitoringApi().getLinkedStudentsByMonitorId(
      monitorId,
      page,
      perPage
    );

    return {
      data: result.data,
    };
  },

  // either student.getOne [ONLY for their student] or getStudentByMonitorId
  async getOne(id: string) {
    if (!id) {
      throw new Error("ID is required to fetch a single student.");
    }

    const monitorId = authProvider.getCachedWhoami().id;

    if (!monitorId) {
      throw new Error("Monitor ID is required.");
    }

    const result = await monitoringApi().getLinkedStudentsByMonitorId(
      monitorId,
      1,
      15
    );
    // what if linked students is over 100
    return result.data.find((student) => student.id === id);
  },

  async saveOrUpdate(_payload: any, _meta: any) {
    throw new Error("saveOrUpdate not supported for monitor-students");
  },

  async delete(_id: string) {
    throw new Error("delete not supported for monitor-students");
  },
};

export default monitorStudentProvider;
