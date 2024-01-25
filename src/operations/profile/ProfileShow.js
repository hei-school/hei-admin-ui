import {EditButton} from "react-admin";

import {useRole} from "../../security/hooks";
import {Show} from "../common/components/Show";
import authProvider from "../../providers/authProvider";
import {GetCertificate} from "../students/components";
import {COMMON_BUTTON_PROPS} from "../../ui/constants/common_styles";
import {ProfileLayout} from "../common/components/ProfileLayout";

const ProfileShow = () => {
  const role = useRole();
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
        id={id}
        actions={
          <div
            style={{display: "flex", width: "100%", justifyContent: "flex-end"}}
          >
            <EditButton
              to={`/profile/${id}/edit`}
              data-testid="profile-edit-button"
              {...COMMON_BUTTON_PROPS}
            />
            {role.isStudent() && <GetCertificate studentId={id} />}
          </div>
        }
      />
    </Show>
  );
};

export default ProfileShow;
