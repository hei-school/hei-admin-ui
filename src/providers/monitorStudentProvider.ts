import {HaDataProviderType} from "./HaDataProviderType";
import {monitoringApi} from "./api";
import authProvider from "./authProvider";

const monitorStudentProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    _filter,
    {monitorId}: {monitorId: string}
  ) => {
    return monitoringApi()
      .getLinkedStudentsByMonitorId(monitorId, page, perPage)
      .then((result) => ({data: result.data}));
  },

  getOne: async (id: string) => {
    const monitorId = authProvider.getCachedWhoami().id;
    return monitoringApi()
      .getLinkedStudentByIdAndMonitorId(monitorId!, id)
      .then((result) => result.data);
  },

  saveOrUpdate: async (students, {meta}) => {
    return monitoringApi()
      .linkStudentsByMonitorId(meta.monitorId, students[0])
      .then((result) => result.data);
  },

  delete: () => {
    throw new Error("Not implemented");
  },
};

export default monitorStudentProvider;
