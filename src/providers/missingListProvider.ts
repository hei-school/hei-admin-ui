import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const missingListProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    return eventsApi()
      .getAllEventParticipants(
        page,
        perPage,
        filter.from,
        filter.to,
        filter.attendanceStatus,
        filter.groupRef,
        filter.studentRef,
        filter.studentName
      )
      .then((result) => ({
        data: result.data.map((item) => ({
          id: item.event?.id,
          ...item,
        })),
      }));
  },
  async getOne(_id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate() {
    throw new Error("Not implemented");
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default missingListProvider;
