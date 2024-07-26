import {
  ChipField,
  FunctionField,
  ShowButton as RaShowButton,
  TextField,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {useLocation} from "react-router-dom";
import {FileType} from "@haapi/typescript-client";
import {Chip} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import {DocCreateDialog} from "./DocCreateDialog";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {DateField} from "../../common/components/fields";
import {WORK_TYPE_VALUE} from "./SelectWorkType";
import {OwnerType} from "../types";
import {PALETTE_COLORS} from "@/haTheme";

const getTitle = (owner, type) => {
  if (owner === OwnerType.SCHOOL) {
    return "Liste des documents chez HEI";
  }
  if (owner === OwnerType.STUDENT) {
    switch (type) {
      case FileType.TRANSCRIPT:
        return "Liste des bulletins";
      case FileType.OTHER:
        return "Liste des autres documents étudiant";
      case FileType.WORK_DOCUMENT:
        return "Liste des validations d'expériences professionnelles";
      default:
        return "Liste des documents";
    }
  }
  return "Liste des documents";
};

const ListAction = ({type, owner, refresh}) => {
  const [isOpen, , toggle] = useToggle();

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
        refresh={refresh}
      />
    </>
  );
};

const ShowButton = () => {
  const record = useRecordContext();
  const location = useLocation();

  if (!record) return;

  return <RaShowButton to={location.pathname + `/` + record.id} />;
};

export const DocList = ({
  owner,
  type,
  studentId,
  datagridProps,
  studentRef,
}) => {
  const {isManager} = useRole();
  const refresh = useRefresh();
  const title =
    getTitle(owner, type, studentRef) + (studentRef ? ` de ${studentRef}` : "");

  return (
    <HaList
      title={title}
      resource="docs"
      listProps={{queryOptions: {meta: {owner, type, studentId}}}}
      datagridProps={datagridProps}
      actions={
        isManager() && (
          <ListAction type={type} owner={owner} refresh={refresh} />
        )
      }
    >
      <TextField source="name" label="Nom du fichier" />
      <DateField source="creation_datetime" label="Date de création" />
      {type == FileType.WORK_DOCUMENT && (
        <FunctionField
          label="Type d'expérience professionnelle"
          render={(doc) => (
            <Chip
              label={WORK_TYPE_VALUE[doc.professional_experience]}
              sx={{bgcolor: PALETTE_COLORS.yellow, color: "white"}}
            />
          )}
        />
      )}
      <ShowButton />
    </HaList>
  );
};
