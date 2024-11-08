import {EditButton, Button} from "react-admin";
import {Download, Comment as CommentIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {GetCertificate} from "@/operations/students/components";
import {Show} from "@/operations/common/components/Show";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {StudentComments} from "@/operations/comments";
import {useRole} from "@/security/hooks";
import {useToggle} from "@/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import authProvider from "@/providers/authProvider";

const ProfileShow = () => {
  const {isStudent, isTeacher, isMonitor, role} = useRole();
  const {id} = authProvider.getCachedWhoami();
  const [showComments, , toogleShowComments] = useToggle(false);

  return (
    <Show
      id={id}
      resource="profile"
      basePath="/profile"
      title="Mon profil"
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
        role={role}
        isStudentProfile={isStudent()}
        isTeacherProfile={isTeacher()}
        actions={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {isStudent() ? (
              <GetCertificate
                studentId={id}
                variant="outlined"
                data-testid="get-certificate-btn"
              />
            ) : isMonitor() ? (
              ""
            ) : (
              <EditButton
                to={`/profile/${id}/edit`}
                data-testid="profile-edit-button"
                {...COMMON_OUTLINED_BUTTON_PROPS}
              />
            )}
            {showComments && (
              <StudentComments
                title="Liste des commentaires"
                studentId={id}
                open={showComments}
                onClose={toogleShowComments}
              />
            )}
          </div>
        }
      />
    </Show>
  );
};

export default ProfileShow;
