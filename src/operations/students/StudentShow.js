import { Button, Link, useRecordContext } from "react-admin";
import {
  AttachMoney,
  Comment as CommentIcon
} from "@mui/icons-material";
import { WhoamiRoleEnum } from "@haapi/typescript-client";
import { Show } from "../common/components/Show";
import { ProfileLayout } from "../common/components/ProfileLayout";
import { DocMenu } from "./components/DocMenu";
import { useRole } from "../../security/hooks";
import { COMMON_BUTTON_PROPS } from "../../ui/constants/common_styles";
import { useToggle } from "../../hooks";
import { StudentComments } from "../comments";

//TODO: add edit button for manager
const ActionsOnShow = ({ basePath, data, resource }) => {
  const student = useRecordContext();
  const [showComments, , toogleShowComments] = useToggle(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 4 }}>
      <Button
        startIcon={<CommentIcon />}
        label="Comment"
        onClick={toogleShowComments}
        {...COMMON_BUTTON_PROPS}
      />
      {student && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <Button
            aria-label="fees"
            component={Link}
            to={`/students/${student.id}/fees`}
            label="Frais"
            {...COMMON_BUTTON_PROPS}
          >
            <AttachMoney />
          </Button>
          <DocMenu studentId={student.id} />
        </div>
      )}
      {showComments && <StudentComments open={showComments} onClose={toogleShowComments} />}
    </div>
  );
};

const StudentShow = () => {
  const role = useRole();

  return (
    <Show title="Étudiants" actions={false}>
      <ProfileLayout
        role={WhoamiRoleEnum.STUDENT}
        actions={role.isManager() && <ActionsOnShow />}
        isStudent
      />
    </Show>
  );
};

export default StudentShow;
