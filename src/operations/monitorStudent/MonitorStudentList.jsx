import React from 'react'; 
import {TextField} from "react-admin";
import {GroupOutlined} from "@mui/icons-material"; 
import {HaList} from "@/ui/haList";

function MonitorStudentList() {
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
    </HaList>
  );
}

export default MonitorStudentList;
