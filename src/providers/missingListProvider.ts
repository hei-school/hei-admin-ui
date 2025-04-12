import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const missingListProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    const toDate = filter.to || new Date();
    return eventsApi()
      .getAllEventParticipants(page, perPage, filter.from, toDate)
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
