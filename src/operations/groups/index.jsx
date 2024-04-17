import {Groups} from "@mui/icons-material";

import GroupList from "./GroupList";
import GroupShow from "./GroupShow";
import GroupCreate from "./GroupCreate";
import GroupEdit from "./GroupEdit";

const groups = {
  list: GroupList,
  show: GroupShow,
  create: GroupCreate,
  edit: GroupEdit,
  icon: Groups,
  options: {label: "Groupes"},
};

export default groups;
