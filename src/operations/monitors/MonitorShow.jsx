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

const MonitorShow = () => {
  return (
    <Show
      sx={{
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      actions={false}
      title="Moniteurs"
    >
      <ProfileLayout
        role={WhoamiRoleEnum.MONITOR}
        actions={<ActionsOnShow />}
      />
    </Show>
  );
};

export default MonitorShow;
