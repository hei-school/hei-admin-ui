import {EventAttendance} from "@haapi-b0fc7615/typescript-client";
import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const missingListProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    return eventsApi()
      .getAllEventParticipants(
        filter.courseId,
        page,
        perPage,
        filter.from,
        filter.to,
        "MISSING",
        filter.groupRef,
        filter.studentRef,
        filter.studentName
      )
      .then((result) => ({
        data: result.data.map((item: EventAttendance) => ({
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
