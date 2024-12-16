import {FC} from "react";
import {EditButton, TextField} from "react-admin";
import {Box} from "@mui/material";
import {AssignmentInd} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {useRole} from "@/security/hooks";
import {PALETTE_COLORS} from "@/haTheme";
import {CreateButton, ExportButton, ImportButton} from "@/ui/haToolbar";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import staffProvider from "@/providers/staffProvider";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "../utils/userImportConf";

const StaffList: FC = () => {
  const {isAdmin} = useRole();

  return (
    <Box>
      <HaList
        title="Liste des staffs de HEI"
        mainSearch={{label: "Prénom·s", source: "first_name"}}
        actions={
          <>
            <CreateButton resource="staffmembers" />
            <ExportButton />
            <ProfileFilters resource="staffmembers" />
            <ImportButton
              provider={staffProvider.saveOrUpdate}
              optionalHeaders={optionalUserHeaders}
              validateData={validateUserData}
              minimalHeaders={minimalUserHeaders}
              transformData={transformUserData}
              resource="staffmembers"
            />
          </>
        }
        resource="staffmembers"
        icon={<AssignmentInd />}
      >
        <TextField source="ref" label="Référence" />
        <TextField source="first_name" label="Prénom·s" />
        <TextField source="last_name" label="Nom·s" />
        <TextField source="function" label="Poste" />
        {isAdmin() && <EditButton sx={{color: PALETTE_COLORS.yellow}} />}
      </HaList>
    </Box>
  );
};

export default StaffList;
