import {EditButton, Button} from "react-admin";
import {Download, Comment as CommentIcon} from "@mui/icons-material";

import {Show} from "../common/components/Show";
import {GetCertificate} from "../students/components";
import {ProfileLayout} from "../common/components/ProfileLayout";
import {StudentComments} from "../comments";
import {useRole} from "../../security/hooks";
import {useToggle} from "../../hooks";
import {COMMON_BUTTON_PROPS_OUTLINED} from "../../ui/constants/common_styles";
import authProvider from "../../providers/authProvider";

const ProfileShow = () => {
  const {isStudent, role} = useRole();
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
        actions={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {isStudent() ? (
              <>
                <Button
                  label="Commentaires"
                  studentId={id}
                  onClick={toogleShowComments}
                  {...COMMON_BUTTON_PROPS_OUTLINED}
                >
                  <CommentIcon />
                </Button>
                <Button
                  label={<GetCertificate studentId={id} />}
                  data-testid="get-certificate-btn"
                  {...COMMON_BUTTON_PROPS_OUTLINED}
                >
                  <Download />
                </Button>
              </>
            ) : (
              <EditButton
                to={`/profile/${id}/edit`}
                data-testid="profile-edit-button"
                {...COMMON_BUTTON_PROPS_OUTLINED}
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
