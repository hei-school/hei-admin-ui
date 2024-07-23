import {CreateEvent} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {eventsApi} from "./api";

const eventProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return eventsApi()
      .getEvents(page, perPage, filter.from, filter.to, filter.event_type)
      .then((response) => response.data);
  },
  async getOne(id: string) {
    return eventsApi()
      .getEventById(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(events: CreateEvent[]) {
    return eventsApi()
      .crupdateEvents(events)
      .then((response) => response.data);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default eventProvider;
