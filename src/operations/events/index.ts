import {EventCreate} from "./EventCreate";
import {EventList} from "./EventList";
import {EventMissingList} from "./EventMissingList";
import {EventParticipantList} from "./EventParticipantList";

const events = {
  list: EventList,
  new: EventCreate,
  participants: EventParticipantList,
  missing: EventMissingList,
};

export default events;
