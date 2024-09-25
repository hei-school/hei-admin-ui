import {monitoringApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import authProvider from "@/providers/authProvider";

const monitorStudentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, _filter: any) {
    const monitorId = authProvider.getCachedWhoami().id;

    if (!monitorId) {
      throw new Error("Monitor ID is required.");
    }

    const result = await monitoringApi().getLinkedStudentsByMonitorId(
      monitorId,
      page || 1,
      perPage || 15
    );
    return {
      data: result.data,
    };
  },

  async getOne(id: string) {
    if (!id) {
      throw new Error("ID is required to fetch a single student.");
    }

    const monitorId = authProvider.getCachedWhoami().id;

    if (!monitorId) {
      throw new Error("Monitor ID is required.");
    }

    try {
      const result = await monitoringApi().getLinkedStudentsByMonitorId(
        monitorId,
        1,
        15
      );
      return result.data.find((student) => student.id === id);
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  },

  async saveOrUpdate(_payload: any, _meta: any) {
    throw new Error("saveOrUpdate not supported for monitor-students");
  },

  async delete(_id: string) {
    throw new Error("delete not supported for monitor-students");
  },
};

export default monitorStudentProvider;
