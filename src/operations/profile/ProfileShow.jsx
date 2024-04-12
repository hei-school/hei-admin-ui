import {EditButton, Button} from "react-admin";
import {Download, Comment as CommentIcon} from "@mui/icons-material";

import {useRole} from "../../security/hooks";
import {Show} from "../common/components/Show";
import {GetCertificate} from "../students/components";
import {COMMON_BUTTON_PROPS} from "../../ui/constants/common_styles";
import {ProfileLayout} from "../common/components/ProfileLayout";
import {useToggle} from "../../hooks";
import {StudentComments} from "../comments";
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
    >
      <ProfileLayout
        role={role}
        actions={
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            {isStudent() ? (
              <>
                <Button
                  label="Commentaires"
                  studentId={id}
                  onClick={toogleShowComments}
                  {...COMMON_BUTTON_PROPS}
                >
                  <CommentIcon />
                </Button>
                <Button
                  label={<GetCertificate studentId={id} />}
                  data-testid="get-certificate-btn"
                  {...COMMON_BUTTON_PROPS}
                >
                  <Download />
                </Button>
              </>
            ) : (
              <EditButton
                to={`/profile/${id}/edit`}
                data-testid="profile-edit-button"
                {...COMMON_BUTTON_PROPS}
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
