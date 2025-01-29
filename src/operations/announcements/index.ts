import {AnnouncementCreate} from "./AnnouncementCreate";
import {AnnouncementList} from "./AnnouncementList";
import {AnnouncementShow} from "./AnnouncementShow";

const announcements = {
  list: AnnouncementList,
  show: AnnouncementShow,
  create: AnnouncementCreate,
  options: {label: "Annonces"},
};

export default announcements;
