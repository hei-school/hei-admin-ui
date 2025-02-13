import {useToggle} from "@/hooks";
import {StudentComments} from "@/operations/comments";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {GenerateReceiptDialog} from "@/operations/profile/components/GenerateReceiptDialog";
import {GetCertificate} from "@/operations/students/components";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {CloudDownload} from "@mui/icons-material";
import {Box, Button} from "@mui/material";
import {useState} from "react";
import {EditButton} from "react-admin";

const ProfileShow = () => {
  const {
    isStudent,
    isTeacher,
    isMonitor,
    isManager,
    isAdmin,
    isOrganizer,
    role,
  } = useRole();
  const {id} = authProvider.getCachedWhoami();
  const [showComments, , toggleShowComments] = useToggle(false);
  const [openDialog, setOpenDialog] = useState(false);

  const actionButton = () => {
    if (isStudent()) {
      return (
        <GetCertificate
          studentId={id}
          variant="outlined"
          data-testid="get-certificate-btn"
        />
      );
    } else if (!isMonitor() && !isOrganizer()) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="1vh"
        >
          <EditButton
            to={`/profile/${id}/edit`}
            data-testid="profile-edit-button"
            {...(COMMON_OUTLINED_BUTTON_PROPS as any)}
          />
          {(isAdmin() || isManager()) && (
            <Button
              startIcon={<CloudDownload />}
              onClick={() => setOpenDialog(true)}
              {...(COMMON_OUTLINED_BUTTON_PROPS as any)}
            >
              Générer reçu
            </Button>
          )}
          {openDialog && (
            <GenerateReceiptDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
            />
          )}
        </Box>
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
                onClose={toggleShowComments}
              />
            )}
          </div>
        }
      />
    </Show>
  );
};

export default ProfileShow;
