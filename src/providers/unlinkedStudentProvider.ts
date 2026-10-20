import {
  MonitorStudentLink,
  UpdateMonitorStudentLinkStatusRequest,
} from "@haapi-3d601c85/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  HaMeta,
  notImplemented,
} from "./HaDataProviderType";
import {monitoringApi} from "./api";

const unlikedStudentProvider: HaDataProviderType<
  MonitorStudentLink,
  HaFilter,
  HaMeta,
  UpdateMonitorStudentLinkStatusRequest[]
> = {
  getList: async (page: number, perPage: number) => {
    return monitoringApi()
      .getLinkStudentRequests(page, perPage)
      .then((response) => ({data: response.data}));
  },
  getOne: notImplemented,
  saveOrUpdate: async (resources: UpdateMonitorStudentLinkStatusRequest[]) => {
    return monitoringApi()
      .updateMonitorStudentLinkStatus(resources[0])
      .then((response) => response.data);
  },
  delete: notImplemented,
};

export default unlikedStudentProvider;
