import {DocList as StudentDocList} from "./DocList";
import {DocShow} from "./DocShow";

const studentDocs = {
  list: StudentDocList,
  show: DocShow,
  options: {label: "Document de l'étudiant"},
};

export default studentDocs;
