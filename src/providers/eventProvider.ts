import {CreateEvent} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {eventsApi} from "./api";

const eventProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return eventsApi()
      .getEvents(
        page,
        perPage,
        filter.from,
        filter.to,
        filter.event_type,
        filter.title
      )
      .then((response) => ({data: response.data}));
  },
  async getOne(id: string) {
    return eventsApi()
      .getEventById(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(
    events: Array<CreateEvent & {recurrent: Record<string, any>}>
  ) {
    const {recurrent, ...event} = events[0];
    return eventsApi()
      .crupdateEvents(
        [event],
        recurrent?.recurrenceType,
        recurrent?.frequency,
        recurrent?.startTime,
        recurrent?.startTime
      )
      .then((response) => response.data);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default eventProvider;
