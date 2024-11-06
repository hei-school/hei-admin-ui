import {EventCreate} from "./EventCreate";
import {EventList} from "./EventList";
import {EventParticipantList} from "./EventParticipantList";

const events = {
  list: EventList,
  new: EventCreate,
  participants: EventParticipantList,
};

export default events;
