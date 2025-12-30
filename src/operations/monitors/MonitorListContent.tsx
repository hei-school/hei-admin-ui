import monitorProvider from "@/providers/monitorProvider";
import {HaList} from "@/ui/haList";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {EditButton, TextField} from "react-admin";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "../utils/userImportConf";

export const MonitorListContent = () => {
  return (
    <HaList
      icon={undefined}
      title={undefined}
      resource="monitors"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={
        <>
          <CreateButton data-testid="create-button" resource="monitors" />
          <ImportButton
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
            provider={monitorProvider.saveOrUpdate}
            resource="monitors"
            transformData={transformUserData}
            validateData={validateUserData}
          />
          <ProfileFilters resource="monitors" />
        </>
      }
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <EditButton />
    </HaList>
  );
};
