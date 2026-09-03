import {
  AttendanceStatus,
  UpdateEventParticipant,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {eventsApi} from "./api";

const eventParticipantProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
      groupRef: string;
      studentRef: string;
      name: string;
      status: AttendanceStatus;
    },
    meta: {eventId: string}
  ) => {
    return eventsApi()
      .getEventParticipants(
        meta.eventId,
        page,
        perPage,
        filter.groupRef,
        filter.studentRef,
        filter.name,
        filter.status
      )
      .then((response) => ({data: response.data}));
  },
  getOne: async () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (payload: UpdateEventParticipant[], params) => {
    return eventsApi()
      .updateEventParticipantsStatus(params.meta.eventId, payload)
      .then((response) => response.data);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default eventParticipantProvider;
