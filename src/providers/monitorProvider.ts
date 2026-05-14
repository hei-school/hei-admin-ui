import {usersApi} from "@/providers/api";
import {Monitor} from "@haapi-b0fc7615/typescript-client";

const monitorProvider = {
  getList: async (
    page: number,
    perPage: number,
    filter: {ref?: string; first_name?: string; last_name?: string}
  ) => {
    return usersApi()
      .getMonitors(
        page,
        perPage,
        filter?.ref,
        filter?.first_name,
        filter?.last_name
      )
      .then((result) => ({
        data: result.data,
      }));
  },

  getOne: async (id: string) => {
    return usersApi()
      .getMonitorById(id)
      .then((result) => result.data);
  },

  saveOrUpdate: async (
    monitors: Required<Monitor>[],
    meta?: {isUpdate?: boolean}
  ) => {
    if (meta?.isUpdate) {
      const [monitor] = monitors;
      return usersApi()
        .updateMonitorById(monitor.id, monitor)
        .then((result) => [result.data]);
    }
    return usersApi()
      .createOrUpdateMonitors(monitors)
      .then((result) => result.data);
  },

  delete: () => {
    throw new Error("Not implemented");
  },
};

export default monitorProvider;
