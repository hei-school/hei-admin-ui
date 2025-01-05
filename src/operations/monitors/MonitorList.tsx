import {EditButton, TextField} from "react-admin";
import {GroupOutlined} from "@mui/icons-material";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {HaList} from "@/ui/haList";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
  transformUserData,
} from "../utils/userImportConf";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import monitorProvider from "@/providers/monitorProvider";

const MonitorList = () => (
  <HaList
    icon={<GroupOutlined />}
    title="Liste des moniteurs"
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

export default MonitorList;
