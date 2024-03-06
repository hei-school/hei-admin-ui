import {ShowButton, TextField} from "react-admin";
import {FileType} from "@haapi/typescript-client";
import {AddOutlined} from "@mui/icons-material";
import {DocCreateDialog} from "./DocCreateDialog";
import {HaList} from "../../../ui/haList";
import {ButtonBase} from "../../../ui/haToolbar";
import {CustomDateField} from "../../utils";
import {useToggle} from "../../../hooks";
import {useRole} from "../../../security/hooks";
import {OwnerType} from "../types";

const getTitle = (owner, type) => {
  if (owner == OwnerType.SCHOOL) {
    return "Liste des documents chez HEI";
  }
  if (owner == OwnerType.STUDENT) {
    switch (type) {
      case FileType.TRANSCRIPT:
        return "Liste des bulletins";
      case FileType.OTHER:
        return "Liste des autres documents étudiant";
      default:
        return "Liste des documents";
    }
  }
  return "Liste des documents";
};

const ListAction = ({type, owner}) => {
  const [isOpen, _set, toggle] = useToggle();

  return (
    <>
      <ButtonBase
        icon={<AddOutlined />}
        closeAction={false}
        onClick={toggle}
        label="Créer"
      />
      <DocCreateDialog
        type={type}
        owner={owner}
        isOpen={isOpen}
        toggle={toggle}
      />
    </>
  );
};

export const DocList = ({
  owner,
  type,
  studentId,
  datagridProps,
  studentRef,
}) => {
  const {isManager} = useRole();
  const title =
    getTitle(owner, type, studentRef) + (studentRef ? ` de ${studentRef}` : "");

  return (
    <HaList
      title={title}
      resource="docs"
      listProps={{queryOptions: {meta: {owner, type, studentId}}}}
      datagridProps={datagridProps}
      actions={isManager() && <ListAction type={type} owner={owner} />}
    >
      <TextField source="name" label="Nom du fichier" />
      <CustomDateField source="creation_datetime" label="Date de création" />
      <ShowButton redirect={datagridProps?.rowClick} />
    </HaList>
  );
};
