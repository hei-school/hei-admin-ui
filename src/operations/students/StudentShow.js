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
import {GetCertificate} from "./components";
import {useRole} from "../../security/hooks";

const ActionsOnShow = ({basePath, data, resource}) => {
  const student = useRecordContext();
  return (
    <TopToolbar disableGutters>
      <EditButton basePath={basePath} resource={resource} record={data} />
      {student && (
        <>
          <Button
            label="Frais"
            aria-label="fees"
            component={Link}
            to={`/students/${student.id}/fees`}
          >
            <AttachMoney />
          </Button>
          <GetCertificate studentId={student.id} />
        </>
      )}
    </TopToolbar>
  );
};

const StudentShow = () => {
  const role = useRole();
  return (
    <Show title="Étudiants" actions={role.isManager() && <ActionsOnShow />}>
      <ProfileLayout isStudent />
    </Show>
  );
};

export default StudentShow;
