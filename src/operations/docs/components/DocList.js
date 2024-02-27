import {ShowButton, TextField} from "react-admin";
import {CustomDateField} from "../../utils";
import {HaList} from "../../../ui/haList";

const getTitle = (owner, type) => {
  if (owner == "SCHOOL") {
    return "Liste des documents chez HEI";
  }
  if (owner == "STUDENT") {
    switch (type) {
      case "TRANSCRIPT":
        return "Liste des bulletins";
      case "OTHER":
        return "Liste des autres documents étudiant";
      default:
        return "Liste des documents";
    }
  }
  return "Liste des documents";
};

export const DocList = ({owner, type, datagridProps}) => {
  return (
    <HaList
      title={getTitle(owner, type)}
      resource="docs"
      listProps={{queryOptions: {meta: {owner, type}}}}
      datagridProps={datagridProps}
    >
      <TextField source="name" label="Nom du fichier" />
      <CustomDateField source="creation_datetime" label="Date de création" />
      <ShowButton />
    </HaList>
  );
};
