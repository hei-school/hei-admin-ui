import {UpdateMonitorStudentLinkStatusRequest} from "@haapi-3d601c85/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {monitoringApi} from "./api";

const unlikedStudentProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number) => {
    return monitoringApi()
      .getLinkStudentRequests(page, perPage)
      .then((response) => ({data: response.data}));
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: async (resources: UpdateMonitorStudentLinkStatusRequest[]) => {
    return monitoringApi()
      .updateMonitorStudentLinkStatus(resources[0])
      .then((response) => response.data);
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default unlikedStudentProvider;
