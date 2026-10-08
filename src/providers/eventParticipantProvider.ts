import {
  AttendanceStatus,
  EventParticipant,
  UpdateEventParticipant,
} from "@haapi-b0fc7615/typescript-client";
import {
  HaDataProviderType,
  HaSaveParams,
  notImplemented,
} from "./HaDataProviderType";
import {eventsApi} from "./api";

interface EventParticipantFilter {
  groupRef: string;
  studentRef: string;
  name: string;
  status: AttendanceStatus;
}

interface EventParticipantMeta {
  eventId: string;
}

type EventParticipantSaveParams = HaSaveParams<EventParticipantMeta> & {
  meta: EventParticipantMeta;
};

const eventParticipantProvider: HaDataProviderType<
  EventParticipant,
  EventParticipantFilter,
  EventParticipantMeta,
  UpdateEventParticipant[],
  EventParticipantSaveParams
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: EventParticipantFilter,
    meta: EventParticipantMeta
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
  getOne: notImplemented,
  saveOrUpdate: async (
    payload: UpdateEventParticipant[],
    params: EventParticipantSaveParams
  ) => {
    return eventsApi()
      .updateEventParticipantsStatus(params.meta.eventId, payload)
      .then((response) => response.data);
  },
  delete: notImplemented,
};

export default eventParticipantProvider;
