import {usersApi} from "@/providers/api";
import {
  HaDataProviderType,
  HaMeta,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {CrupdateMonitor, Monitor} from "@haapi-b0fc7615/typescript-client";

interface MonitorFilter {
  ref?: string;
  first_name?: string;
  last_name?: string;
}

const monitorProvider: HaDataProviderType<
  Monitor,
  MonitorFilter,
  HaMeta,
  CrupdateMonitor[]
> = {
  getList: async (page: number, perPage: number, filter: MonitorFilter) => {
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
    monitors: CrupdateMonitor[],
    meta?: {isUpdate?: boolean}
  ) => {
    if (meta?.isUpdate) {
      const [monitor] = monitors;
      return usersApi()
        .updateMonitorById(monitor.id!, monitor)
        .then((result) => [result.data]);
    }
    return usersApi()
      .createOrUpdateMonitors(monitors)
      .then((result) => result.data);
  },

  delete: notImplemented,
};

export default monitorProvider;
