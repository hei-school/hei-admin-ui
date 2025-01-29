import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {DocMenu} from "@/operations/students/components/DocMenu";
import {useRole} from "@/security/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {Edit as EditIcon} from "@mui/icons-material";
import {EditButton, useRecordContext} from "react-admin";

export const ActionsOnShow = ({basePath, data, resource}) => {
  const student = useRecordContext();
  const id = student?.id;
  const role = useRole();

  if (!student) return null;

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
      {(role.isManager() || role.isAdmin()) && (
        <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
          <EditButton
            to={`/students/${id}/edit`}
            data-testid="profile-edit-button"
            startIcon={<EditIcon />}
            variant="outlined"
            {...COMMON_OUTLINED_BUTTON_PROPS}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "0.2rem",
            }}
          />
          <DocMenu studentId={student.id} />
        </div>
      )}
      {role.isMonitor() && (
        <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
          <DocMenu studentId={student.id} />
        </div>
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
      isStudentProfile
    />
  </Show>
);

export default StudentShow;
