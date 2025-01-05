import {DocCreateDialog} from "../components/DocCreateDialog";
import {StaffDocList} from "./DockList";
import {StaffDocShow} from "./DocShow";

const staffDocs = {
  list: StaffDocList,
  show: StaffDocShow,
  create: DocCreateDialog,
};

export default staffDocs;
