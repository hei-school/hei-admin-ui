import {FC} from "react";
import {useLocation, Link} from "react-router-dom";
import {
  DatagridProps,
  FunctionField,
  TextField,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {Chip, Button} from "@mui/material";
import {AddOutlined, RemoveRedEye} from "@mui/icons-material";
import {
  FileType,
  WhoamiRoleEnum,
  WorkDocumentInfo,
} from "@haapi/typescript-client";
import {DocCreateDialog} from "./DocCreateDialog";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {useToggle} from "@/hooks";
import {DateField} from "../../common/components/fields";
import {WORK_TYPE_VALUE} from "./SelectWorkType";
import {PALETTE_COLORS} from "@/haTheme";

export const DocListAction: FC<{
  type: FileType;
  owner: WhoamiRoleEnum;
  userId: string;
}> = ({type, owner, userId}) => {
  const [isOpen, , toggle] = useToggle();
  const refresh = useRefresh();

  return (
    <>
      <ButtonBase
        icon={<AddOutlined />}
        closeAction={false}
        onClick={toggle}
        label="Créer"
        children={null}
      />
      <DocCreateDialog
        userId={userId}
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

  if (!record) return null;

  return (
    <Button
      startIcon={<RemoveRedEye />}
      component={Link}
      to={`${location.pathname}/${record.id}`}
    >
      Afficher
    </Button>
  );
};

export type DocListProps = {
  owner: WhoamiRoleEnum;
  type: string;
  userId: string;
  datagridProps?: DatagridProps;
  haListProps: any;
  title: string;
};

export const DocList: FC<DocListProps> = ({
  owner,
  type,
  userId,
  datagridProps,
  haListProps,
  title,
}) => {
  return (
    <HaList
      title={title}
      resource="docs"
      listProps={{queryOptions: {meta: {owner, type, userId}}}}
      datagridProps={datagridProps}
      {...haListProps}
    >
      <TextField source="name" label="Nom du fichier" />
      <DateField source="creation_datetime" label="Date de création" />
      {type == FileType.WORK_DOCUMENT && (
        <FunctionField
          label="Type d'expérience professionnelle"
          render={(doc: WorkDocumentInfo) => (
            <Chip
              label={WORK_TYPE_VALUE[doc.professional_experience!]}
              sx={{bgcolor: PALETTE_COLORS.yellow, color: "white"}}
            />
          )}
        />
      )}
      <ShowButton />
    </HaList>
  );
};
