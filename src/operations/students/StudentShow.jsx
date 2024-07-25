import {Button, EditButton, useRecordContext} from "react-admin";
import {
  AttachMoney,
  Comment as CommentIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {useRole} from "@/security/hooks";
import {COMMON_BUTTON_PROPS_OUTLINED} from "@/ui/constants/common_styles";
import {useToggle} from "@/hooks";

import {Show} from "../common/components/Show";
import {ProfileLayout} from "../common/components/ProfileLayout";
import {StudentComments} from "../comments";
import {DocMenu} from "./components/DocMenu";

export const ActionsOnShow = ({basePath, data, resource}) => {
  const student = useRecordContext();
  const id = student?.id;
  const role = useRole();
  const [showComments, , toogleShowComments] = useToggle(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "end",
        gap: "0.2rem",
        position: "absolute",
        top: 15,
        right: 8,
        zIndex: 1,
      }}
    >
      <Button
        label="Commentaires"
        onClick={toogleShowComments}
        {...COMMON_BUTTON_PROPS_OUTLINED}
      >
        <CommentIcon />
      </Button>
      {role.isManager() && student && (
        <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
          <EditButton
            to={`/students/${id}/edit`}
            data-testid="profile-edit-button"
            startIcon={<EditIcon />}
            variant="outlined"
            {...COMMON_BUTTON_PROPS_OUTLINED}
          />
          <DocMenu studentId={student.id} />
        </div>
      )}
      {showComments && (
        <StudentComments
          title="Liste des commentaires"
          studentId={student.id}
          open={showComments}
          onClose={toogleShowComments}
        />
      )}
    </div>
  );
};

const StudentShow = () => (
  <Show
    title="Étudiants"
    actions={false}
    sx={{
      "& .RaShow-card": {
        backgroundColor: "transparent",
        boxShadow: "none",
        zIndex: 999,
      },
    }}
  >
    <ProfileLayout
      role={WhoamiRoleEnum.STUDENT}
      actions={<ActionsOnShow />}
      isStudent
    />
  </Show>
);

export default StudentShow;
