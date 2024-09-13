import React from 'react';
import {EditButton, TextField} from "react-admin";
import {Box} from '@mui/material';
import {GroupOutlined} from "@mui/icons-material";
import {CreateButton, ExportButton, ImportButton} from "@/ui/haToolbar";
import {HaList} from "@/ui/haList";
import {ProfileFilters} from "@/operations/profile/components/ProfileFilters";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
} from "@/operations/utils/userImportConf";
import monitorStudentProvider from "@/providers/monitorStudentProvider";

function MonitorStudentList() {
  return (
    <HaList
      resource="monitor-students"
      icon={<GroupOutlined />}
      title="Liste des étudiants"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={
        <Box display="flex" gap={2}>
          <CreateButton />
          <ExportButton
            onExport={(data) => console.log("Exporting student data", data)}
          />
          <ImportButton
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
            provider={monitorStudentProvider.saveOrUpdate}
            resource="monitor-students"
            validateData={validateUserData}
          />
          <ProfileFilters resource="monitor-students" />
        </Box>
      }
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <EditButton />
    </HaList>
  );
}

export default MonitorStudentList;
