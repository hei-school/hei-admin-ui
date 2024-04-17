import {ShowButton, TextField} from "react-admin";
import {HaList} from "../../ui/haList";
import {GroupsOutlined} from "@mui/icons-material";
import {DateField} from "../common/components/fields";
import {GroupFilters} from "./components/GroupFilters";

const GroupList = () => {
  return (
    <HaList
      listProps={{title: "Groupes"}}
      resource="groups"
      title="Liste des groupes"
      icon={<GroupsOutlined />}
      actions={<GroupFilters />}
      mainSearch={{source: "ref", label: "Référence"}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="name" label="Nom" />
      <DateField
        source="creation_datetime"
        label="Année de création"
        showTime={false}
      />
      <ShowButton />
    </HaList>
  );
};

export default GroupList;
