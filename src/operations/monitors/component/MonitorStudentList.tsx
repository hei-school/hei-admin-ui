import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {CreateButton} from "@/ui/haToolbar";
import {Group} from "@haapi/typescript-client";
import {GroupOutlined} from "@mui/icons-material";
import {Avatar} from "@mui/material";
import {FunctionField, ShowButton, TextField} from "react-admin";

function MonitorStudentList() {
  const {id: monitorId} = authProvider.getCachedWhoami();

  return (
    <HaList
      resource="monitor-students"
      icon={<GroupOutlined />}
      title="Liste des étudiants"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={
        <CreateButton resource="monitor-students" data-testid="create-button" />
      }
      listProps={{
        queryOptions: {
          meta: {
            monitorId,
          },
        },
      }}
    >
      <FunctionField
        label="Profil"
        render={(record) => <Avatar src={record.profile_picture} />}
      />
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <FunctionField
        label="Groupe"
        render={(record) => {
          const groups = record?.groups;
          return groups && groups.length > 0 ? (
            <span>{groups.map((group: Group) => group.ref).join(", ")}</span>
          ) : (
            <span style={{color: PALETTE_COLORS.red}}>Aucun groupe</span>
          );
        }}
      />
      <ShowButton sx={{color: PALETTE_COLORS.yellow}} />
    </HaList>
  );
}

export default MonitorStudentList;
