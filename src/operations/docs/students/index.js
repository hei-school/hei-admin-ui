import {DocShow} from "../components/DocShow";
import {DocList as StudentDocList} from "./DocList";

const studentDocs = {
  list: StudentDocList,
  show: <DocShow owner="STUDENT" />,
  options: {label: "Document de l'étudiant"},
};

export default studentDocs;
