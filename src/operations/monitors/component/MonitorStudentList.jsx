import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {CreateButton} from "@/ui/haToolbar";
import {GroupOutlined} from "@mui/icons-material";
import {ShowButton, TextField} from "react-admin";

function MonitorStudentList() {
  const role = useRole();
  const {id: monitorId} = authProvider.getCachedWhoami();

  return (
    <HaList
      resource="monitor-students"
      icon={<GroupOutlined />}
      title="Liste des étudiants"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={<CreateButton data-testid="create-button" />}
      listProps={{
        queryOptions: {
          meta: {
            monitorId,
          },
        },
      }}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <ShowButton sx={{color: PALETTE_COLORS.yellow}} />
    </HaList>
  );
}

export default MonitorStudentList;
