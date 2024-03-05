import {FunctionField, ShowButton, TextField} from "react-admin";
import {GroupsOutlined} from "@mui/icons-material";
import {HaList} from "../../ui/haList";
import {GroupFilters} from ".";

const GroupList = () => {
  return (
    <HaList
      listProps={{title: "Groupes"}}
      resource="groups"
      title="Liste de groupes"
      icon={<GroupsOutlined />}
      actions={<GroupFilters />}
      mainSearch={{source: "ref", label: "Référence"}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="name" label="Nom" />
      <FunctionField
        source="creation_datetime"
        render={(group) => parseInt(group.creation_datetime)}
        label="Année de création"
      />
      <ShowButton />
    </HaList>
  );
};

export default GroupList;
