import {AnnouncementShow} from "./AnnoucementShow";
import {AnnouncementList} from "./AnnouncementList";
import {AnnouncementCreate} from "./AnnouncementCreate";

const announcements = {
  list: AnnouncementList,
  show: AnnouncementShow,
  create: AnnouncementCreate,
  options: {label: "Annonces"},
};

export default announcements;
