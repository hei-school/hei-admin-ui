import {UpdateEventParticipant} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {eventsApi} from "./api";

const eventParticipantProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
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
  async getOne(_id: string) {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: UpdateEventParticipant[], params: any) {
    return eventsApi()
      .updateEventParticipantsStatus(params.meta.eventId, payload)
      .then((response) => response.data);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default eventParticipantProvider;
