import {EventAttendance} from "@haapi-b0fc7615/typescript-client";
import {eventsApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

interface MissingListFilter {
  courseId?: string;
  from?: Date;
  to?: Date;
  groupRef?: string[];
  studentRef?: string;
  studentName?: string;
}

type MissingRecord = EventAttendance & {id?: string};

const missingListProvider: HaDataProviderType<
  MissingRecord,
  MissingListFilter
> = {
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
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default missingListProvider;
