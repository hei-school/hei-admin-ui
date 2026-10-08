import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {HaList, HaListProps} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {
  FileType,
  WhoamiRoleEnum,
  WorkDocumentInfo,
} from "@haapi-b0fc7615/typescript-client";
import {AddOutlined, RemoveRedEye} from "@mui/icons-material";
import {Button, Chip} from "@mui/material";
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

type DocListActionProps = {
  type: FileType;
  owner: WhoamiRoleEnum;
  userId: string;
};

export const DocListAction = ({
  type,
  owner,
  userId,
}: Readonly<DocListActionProps>) => {
  const [isOpen, , toggle] = useToggle();
  const refresh = useRefresh();

  return (
    <>
      <ButtonBase
        icon={<AddOutlined />}
        closeAction={false}
        onClick={toggle}
        label="Créer"
      >
        {null}
      </ButtonBase>
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
  haListProps: HaListProps;
  title: string;
};

export const DocList = ({
  owner,
  type,
  userId,
  datagridProps,
  haListProps,
  title,
}: Readonly<DocListProps>) => {
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
