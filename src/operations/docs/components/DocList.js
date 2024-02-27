import {ShowButton, TextField} from "react-admin";
import {CustomDateField} from "../../utils";
import {HaList} from "../../../ui/haList";

export const DocList = ({owner, type, datagridProps}) => {
  const getTitle = () => {
    if (owner == "SCHOOL") {
      return "Liste des documents chez HEI";
    } else if (owner == "STUDENT") {
      switch (type) {
        case "TRANSCRIPT":
          return "Liste des bulletins";
        case "OTHER":
          return "Liste des autres documents étudiant";
        default:
          break;
      }
    } else {
      console.error("Owner not known");
    }
  };

  return (
    <HaList
      title={getTitle()}
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
