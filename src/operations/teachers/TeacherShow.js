import {EditButton} from "react-admin";

import {Show} from "../common/components/Show";
import {COMMON_BUTTON_PROPS} from "../../ui/constants/common_styles";
import {ProfileLayout} from "../common/components/ProfileLayout";

const ActionsOnShow = ({basePath, data, resource}) => {
  return (
    <EditButton
      basePath={basePath}
      resource={resource}
      record={data}
      {...COMMON_BUTTON_PROPS}
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
      <ProfileLayout actions={<ActionsOnShow />} />
    </Show>
  );
};

export default TeacherShow;
