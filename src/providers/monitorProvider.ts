import {usersApi, monitoringApi} from "@/providers/api";

const monitorProvider = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getMonitors(
      page,
      perPage,
      filter?.ref,
      filter?.first_name,
      filter?.last_name,
      filter?.status
    );

    return {
      data: result.data,
    };
  },

  async getOne(id: string) {
    const result = await usersApi().getMonitorById(id);
    return result.data;
  },

  async saveOrUpdate(monitors: any[], meta: {isUpdate: any}, students: any[]) {
    const isUpdate = meta?.isUpdate;
    const monitor = monitors[0];
    if (!monitor) {
      throw new Error("Monitor is required");
    }

    let monitorResult;

    if (isUpdate) {
      if (!monitor.id) {
        throw new Error("Monitor id is required for update");
      }
      monitorResult = await usersApi().updateMonitorById(monitor.id, monitor);
    } else {
      monitorResult = await usersApi().createOrUpdateMonitors(monitors);
    }

    let monitorId;
    if (Array.isArray(monitorResult.data)) {
      monitorId = monitorResult.data[0]?.id;
    } else {
      monitorId = monitorResult.data?.id;
    }

    if (!monitorId) {
      throw new Error("Monitor ID is missing after creation or update");
    }

    if (students?.length > 0) {
      await monitoringApi().linkStudentsByMonitorId(monitorId, {
        students_ids: students,
      });
    }

    return isUpdate ? [monitorResult.data] : monitorResult.data;
  },

  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default monitorProvider;
