import {ShowButton, TextField} from "react-admin";
import {HaList} from "../../../ui/haList";
import {CustomDateField} from "../../utils";

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

export const DocList = ({
  owner,
  type,
  studentId,
  datagridProps,
  studentRef,
}) => {
  const title = `${getTitle(owner, type, studentRef)} ${studentRef ? ` de ${studentRef}` : ""}`;

  return (
    <HaList
      title={title}
      resource="docs"
      listProps={{queryOptions: {meta: {owner, type, studentId}}}}
      datagridProps={datagridProps}
    >
      <TextField source="name" label="Nom du fichier" />
      <CustomDateField source="creation_datetime" label="Date de création" />
      <ShowButton redirect={() => datagridProps?.rowClick} />
    </HaList>
  );
};
