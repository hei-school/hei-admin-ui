import { DocCreateDialog } from "../components/DocCreateDialog";
import { DocShow } from "../components/DocShow";
import { OwnerType } from "../types";
import { DocList as HeiDocList } from "./DocList";

const heiDocs = {
  list: HeiDocList,
  show: <DocShow owner={OwnerType.SCHOOL} />,
  create: DocCreateDialog,
  options: { label: "Document de HEI" },
};

export default heiDocs;
