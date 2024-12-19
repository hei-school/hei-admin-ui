import {usersApi} from "@/providers/api";
import {Monitor} from "@haapi/typescript-client";

const monitorProvider = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getMonitors(
      page,
      perPage,
      filter?.ref,
      filter?.first_name,
      filter?.last_name
    );

    return {
      data: result.data,
    };
  },

  async getOne(id: string) {
    const result = await usersApi().getMonitorById(id);
    return result.data;
  },

  async saveOrUpdate(
    monitors: Required<Monitor>[],
    meta?: {isUpdate?: boolean}
  ) {
    if (meta?.isUpdate) {
      const [monitor] = monitors;
      const result = await usersApi().updateMonitorById(monitor.id, monitor);
      return [result.data];
    }
    const result = await usersApi().createOrUpdateMonitors(monitors);
    return result.data;
  },

  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default monitorProvider;
