import {HaDataProviderType} from "./HaDataProviderType";
import {monitoringApi} from "./api";
import authProvider from "./authProvider";

const monitorStudentProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number,
    _filter: any,
    {monitorId}: {monitorId: string}
  ) {
    const result = await monitoringApi().getLinkedStudentsByMonitorId(
      monitorId,
      page,
      perPage
    );

    return {data: result.data};
  },

  async getOne(id: string) {
    const monitorId = authProvider.getCachedWhoami().id;
    return monitoringApi()
      .getLinkedStudentByIdAndMonitorId(monitorId!, id)
      .then((response) => response.data);
  },

  async saveOrUpdate(students, {meta}) {
    return monitoringApi()
      .linkStudentsByMonitorId(meta.monitorId, students[0])
      .then((result) => result.data);
  },

  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default monitorStudentProvider;
