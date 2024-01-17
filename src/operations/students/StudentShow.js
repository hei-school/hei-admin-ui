import {Button, EditButton, Link, useRecordContext} from "react-admin";

import {AttachMoney} from "@mui/icons-material";

import {GetCertificate} from "./components";
import {useRole} from "../../security/hooks";
import {Show} from "../common/components/Show";
import {COMMON_BUTTON_PROPS} from "../../ui/constants/common_styles";
import {ProfileLayout} from "../common/components/ProfileLayout";

const ActionsOnShow = ({basePath, data, resource}) => {
  const student = useRecordContext();
  return (
    <div style={{display: "grid", gridTemplateColumns: "1fr 2fr", gap: 4}}>
      <EditButton
        basePath={basePath}
        resource={resource}
        record={data}
        {...COMMON_BUTTON_PROPS}
      />
      {student && (
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4}}>
          <Button
            aria-label="fees"
            component={Link}
            to={`/students/${student.id}/fees`}
            label="Frais"
            {...COMMON_BUTTON_PROPS}
          >
            <AttachMoney />
          </Button>
          <GetCertificate studentId={student.id} />
        </div>
      )}
    </div>
  );
};

const StudentShow = () => {
  const role = useRole();
  return (
    <Show title="Étudiants" actions={false}>
      <ProfileLayout
        actions={role.isManager() && <ActionsOnShow />}
        isStudent
      />
    </Show>
  );
};

export default StudentShow;