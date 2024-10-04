import React from "react";
import {Box} from "@mui/material";
import {EditButton, TextField} from "react-admin";
import {GroupOutlined} from "@mui/icons-material";
import {CreateButton, ExportButton, ImportButton} from "@/ui/haToolbar";
import {HaList} from "@/ui/haList";
import {ProfileFilters} from "@/operations/profile/components/ProfileFilters";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "@/operations/utils/userImportConf";
import monitorProvider from "@/providers/monitorProvider";

function MonitorList() {
  return (
    <HaList
      icon={<GroupOutlined />}
      title="Liste des moniteurs"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={<CreateButton />}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <EditButton />
    </HaList>
  );
}

export default MonitorList;
