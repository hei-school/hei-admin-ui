import {EditButton} from "react-admin";

import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {Show} from "@/operations/common/components/Show";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout";

const ActionsOnShow = ({basePath, data, resource}) => {
  return (
    <EditButton
      basePath={basePath}
      resource={resource}
      record={data}
      {...COMMON_OUTLINED_BUTTON_PROPS}
    />
  );
};

const TeacherShow = () => {
  return (
    <Show
      sx={{
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      actions={false}
      title="Enseignants"
    >
      <ProfileLayout
        role={WhoamiRoleEnum.TEACHER}
        actions={<ActionsOnShow />}
        isTeacherProfile
      />
    </Show>
  );
};

export default TeacherShow;
