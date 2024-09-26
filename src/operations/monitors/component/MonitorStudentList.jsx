import React from "react";
import {EditButton, ShowButton, TextField} from "react-admin";
import {GroupOutlined} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {useRole} from "@/security/hooks";
import {PALETTE_COLORS} from "@/haTheme";

function MonitorStudentList() {
  const role = useRole();
  return (
    <HaList
      resource="monitor-students"
      icon={<GroupOutlined />}
      title="Liste des étudiants"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      {role.isManager() ? (
        <EditButton sx={{color: PALETTE_COLORS.yellow}} />
      ) : (
        <ShowButton sx={{color: PALETTE_COLORS.yellow}} />
      )}
    </HaList>
  );
}

export default MonitorStudentList;
