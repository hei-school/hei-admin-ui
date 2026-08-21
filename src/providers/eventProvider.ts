import {
  CreateEvent,
  EventType,
  FrequencyScopeDay,
} from "@haapi-3d601c85/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {eventsApi} from "./api";

const eventProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
      from?: Date;
      to?: Date;
      event_type?: EventType;
      title?: string;
      group?: string;
      teacher_id?: string;
      group_ref?: [];
    }
  ) => {
    return eventsApi()
      .getEvents(
        page,
        perPage,
        filter.from,
        filter.to,
        filter.event_type,
        filter.title,
        filter.group,
        filter.teacher_id,
        filter.group_ref
      )
      .then((response) => ({data: response.data}));
  },
  getOne: async (id: string) => {
    return eventsApi()
      .getEventById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (
    events: Array<
      CreateEvent & {
        recurrent?: {
          recurrenceType: FrequencyScopeDay;
          frequency: number;
          startTime: string;
          endTime: string;
        };
      }
    >
  ) => {
    const {recurrent, ...event} = events[0];
    return eventsApi()
      .crupdateEvents(
        [event],
        recurrent?.recurrenceType,
        recurrent?.frequency,
        recurrent?.startTime,
        recurrent?.endTime
      )
      .then((response) => response.data);
  },
  delete: async (id: string) => {
    return eventsApi()
      .deleteEventById(id)
      .then((response) => response.data);
  },
};

export default eventProvider;
