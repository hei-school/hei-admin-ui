import {
  LinkStudentsByMonitorIdRequest,
  Student,
} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaFilter,
  HaSaveParams,
  notImplemented,
} from "./HaDataProviderType";
import {monitoringApi} from "./api";
import authProvider from "./authProvider";

interface MonitorStudentMeta {
  monitorId: string;
}

type MonitorStudentSaveParams = HaSaveParams<MonitorStudentMeta> & {
  meta: MonitorStudentMeta;
};

const monitorStudentProvider: HaDataProviderType<
  Student,
  HaFilter,
  MonitorStudentMeta,
  LinkStudentsByMonitorIdRequest[],
  MonitorStudentSaveParams
> = {
  getList: async (
    page: number,
    perPage: number,
    _filter,
    {monitorId}: MonitorStudentMeta
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

  saveOrUpdate: async (students, {meta}: MonitorStudentSaveParams) => {
    return monitoringApi()
      .linkStudentsByMonitorId(meta.monitorId, students[0])
      .then((result) => result.data);
  },

  delete: notImplemented,
};

export default monitorStudentProvider;
