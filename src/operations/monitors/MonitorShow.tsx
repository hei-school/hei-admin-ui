import {ProfileLayout} from "@/operations/common/components/ProfileLayout";
import {Show} from "@/operations/common/components/Show";
import {useRole} from "@/security/hooks";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {EditButton, RaRecord} from "react-admin";

interface ActionsOnShowProps {
  data?: RaRecord;
  resource?: string;
}

const ActionsOnShow = ({data, resource}: Readonly<ActionsOnShowProps>) => {
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
