import {DocShow} from "../components/DocShow";
import {DocList as HeiDocList} from "./DocList";

const heiDocs = {
  list: HeiDocList,
  show: <DocShow owner="SCHOOL" />,
  options: {label: "Document de HEI"},
};

export default heiDocs;
