import {DocCreateDialog} from "../components/DocCreateDialog";
import {TeacherDocList} from "./DocList";
import {TeacherDocShow} from "./DocShow";

const teachersDocs = {
  list: TeacherDocList,
  show: TeacherDocShow,
  create: DocCreateDialog,
};
export default teachersDocs;
