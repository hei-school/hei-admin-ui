import {
  Button,
  Show,
  EditButton,
  TopToolbar,
  Link,
  useRecordContext,
} from "react-admin";

import {ProfileLayout} from "../profile/ProfileShow";
import {AttachMoney} from "@mui/icons-material";
import {GenCertificateButton} from "./components";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "../../providers/authProvider";

const ActionsOnShow = ({basePath, data, resource}) => {
  const record = useRecordContext();
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
      {record && (
        <>
          <Button
            label="Frais"
            aria-label="fees"
            component={Link}
            to={`/students/${record.id}/fees`}
          >
            <AttachMoney />
          </Button>
          <GenCertificateButton studentId={record.id} />
        </>
      )}
    </TopToolbar>
  );
};

const StudentShow = () => {
  const role = authProvider.getCachedRole();
  return (
    <Show
      title="Étudiants"
      actions={role === WhoamiRoleEnum.MANAGER && <ActionsOnShow />}
    >
      <ProfileLayout isStudent={true} />
    </Show>
  );
};

export default StudentShow;
