import {DocCreateDialog} from "../components/DocCreateDialog";
import {DocList as StudentDocList} from "./DocList";
import {DocShow} from "./DocShow";

const studentDocs = {
  list: StudentDocList,
  show: DocShow,
  create: DocCreateDialog,
  options: {label: "Document de l'étudiant"},
};

export default studentDocs;
