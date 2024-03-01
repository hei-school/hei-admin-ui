import {EditButton, Button} from "react-admin";
import {Download} from "@mui/icons-material";
import {useRole} from "../../security/hooks";
import {Show} from "../common/components/Show";
import authProvider from "../../providers/authProvider";
import {GetCertificate} from "../students/components";
import {COMMON_BUTTON_PROPS} from "../../ui/constants/common_styles";
import {ProfileLayout} from "../common/components/ProfileLayout";

const ProfileShow = () => {
  const {isStudent, role} = useRole();
  const {id} = authProvider.getCachedWhoami();
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
            style={{display: "flex", width: "100%", justifyContent: "flex-end"}}
          >
            {isStudent() ? (
              <Button
                startIcon={<Download />}
                label={<GetCertificate studentId={id} />}
                data-testid="get-certificate-btn"
                {...COMMON_BUTTON_PROPS}
              ></Button>
            ) : (
              <EditButton
                to={`/profile/${id}/edit`}
                data-testid="profile-edit-button"
                {...COMMON_BUTTON_PROPS}
              />
            )}
          </div>
        }
      />
    </Show>
  );
};

export default ProfileShow;
