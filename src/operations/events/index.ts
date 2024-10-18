import {EventCreate} from "./EventCreate";
import {EventList} from "./EventList";
import {EventParticipantList} from "./EventParticipantList";

const events = {
  list: EventList,
  create: EventCreate,
  participants: EventParticipantList,
};

export default events;
