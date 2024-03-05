import {Button, Link, useRecordContext} from "react-admin";
import {AttachMoney, Comment as CommentIcon} from "@mui/icons-material";
import {WhoamiRoleEnum} from "@haapi/typescript-client";

import {Show} from "../common/components/Show";
import {ProfileLayout} from "../common/components/ProfileLayout";
import {DocMenu} from "./components/DocMenu";
import {useRole} from "../../security/hooks";
import {COMMON_BUTTON_PROPS} from "../../ui/constants/common_styles";
import {useToggle} from "../../hooks";
import {StudentComments} from "../comments";

export const ActionsOnShow = ({basePath, data, resource}) => {
  const student = useRecordContext();
  const role = useRole();
  const [showComments, , toogleShowComments] = useToggle(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: 4,
      }}
    >
      <Button
        label="Comments"
        onClick={toogleShowComments}
        {...COMMON_BUTTON_PROPS}
      >
        <CommentIcon />
      </Button>
      {role.isManager() && student && (
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
          <DocMenu studentId={student.id} />
        </div>
      )}
      {showComments && (
        <StudentComments
          studentId={student.id}
          open={showComments}
          onClose={toogleShowComments}
        />
      )}
    </div>
  );
};

const StudentShow = () => (
  <Show title="Étudiants" actions={false}>
    <ProfileLayout
      role={WhoamiRoleEnum.STUDENT}
      actions={<ActionsOnShow />}
      isStudent
    />
  </Show>
);

export default StudentShow;
