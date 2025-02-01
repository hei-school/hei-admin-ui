import {useToggle} from "@/hooks";
import {StudentComments} from "@/operations/comments";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {GetCertificate} from "@/operations/students/components";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {ButtonBase} from "@/ui/haToolbar";
import {Grade as GradeIcon} from "@mui/icons-material";
import {EditButton} from "react-admin";
import {Link} from "react-router-dom";

const ProfileShow = () => {
  const {isStudent, isTeacher, isMonitor, isAdmin, role} = useRole();
  const {id} = authProvider.getCachedWhoami();
  const [showComments, , toogleShowComments] = useToggle(false);

  const actionButton = () => {
    if (isStudent()) {
      return (
        <>
          <GetCertificate
            studentId={id}
            variant="outlined"
            data-testid="get-certificate-btn"
          />
          <ButtonBase
            onClick={undefined}
            icon={<GradeIcon />}
            children={undefined}
            label="VOIR NOTES"
            component={Link}
            to={`/students/${id}/grades`}
            {...COMMON_OUTLINED_BUTTON_PROPS}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "0.2rem",
            }}
          />
        </>
      );
    } else if (!isMonitor()) {
      return (
        <EditButton
          to={`/profile/${id}/edit`}
          data-testid="profile-edit-button"
          {...(COMMON_OUTLINED_BUTTON_PROPS as any)}
        />
      );
    }
  };

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
        isAdminProfil={isAdmin()}
        actions={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {actionButton()}
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
