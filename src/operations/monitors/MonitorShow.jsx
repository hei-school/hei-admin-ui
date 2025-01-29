import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {useRole} from "@/security/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {EditButton, useRecordContext} from "react-admin";

const ActionsOnShow = ({basePath, data, resource}) => {
  const monitor = useRecordContext();
  const role = useRole();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "end",
        gap: "0.2rem",
        position: "absolute",
        top: 15,
        right: 8,
        zIndex: 1,
      }}
    >
      {!role.isMonitor() && (
        <EditButton
          basePath={basePath}
          resource={resource}
          record={data}
          {...COMMON_OUTLINED_BUTTON_PROPS}
          data-testid="monitor-edit-button"
        />
      )}
    </div>
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
        isMonitorProfile
      />
    </Show>
  );
};

export default MonitorShow;
