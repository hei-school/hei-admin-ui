import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {
  FileType,
  WhoamiRoleEnum,
  WorkDocumentInfo,
} from "@haapi/typescript-client";
import {AddOutlined, RemoveRedEye} from "@mui/icons-material";
import {Button, Chip} from "@mui/material";
import {FC} from "react";
import {
  DatagridProps,
  FunctionField,
  TextField,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {Link, useLocation} from "react-router-dom";
import {DateField} from "../../common/components/fields";
import {DocCreateDialog} from "./DocCreateDialog";
import {WORK_TYPE_VALUE} from "./SelectWorkType";

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
