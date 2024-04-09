import {FunctionField, ShowButton, TextField} from "react-admin";
import {HaList} from "../../ui/haList";
import {useRole} from "../../security/hooks";
import {GroupsOutlined} from "@mui/icons-material";
import {GroupFilters} from ".";

const GroupList = () => {
  const {isManager} = useRole();

  return (
    <HaList
      listProps={{title: "Groupes"}}
      resource="groups"
      title="Liste des groupes"
      icon={<GroupsOutlined />}
      actions={<GroupFilters isManager={isManager} />}
      mainSearch={{source: "ref", label: "Référence"}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="name" label="Nom" />
      <FunctionField
        source="creation_datetime"
        render={(group) => +group.creation_datetime}
        label="Année de création"
      />
      <ShowButton />
    </HaList>
  );
};

export default GroupList;
