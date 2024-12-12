import {FC} from "react";
import {EditButton, TextField} from "react-admin";
import {Box} from "@mui/material";
import {AssignmentInd} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
<EditButton sx={{color: PALETTE_COLORS.yellow}} />;
import {useRole} from "@/security/hooks";
import {PALETTE_COLORS} from "@/haTheme";
import {CreateButton, ExportButton} from "@/ui/haToolbar";
import {ProfileFilters} from "../profile/components/ProfileFilters";

const StaffList: FC = () => {
  const {isAdmin} = useRole();

  return (
    <Box>
      <HaList
        title="Liste des staffs de HEI"
        actions={
          <>
            <CreateButton resource="staffmembers" />
            <ExportButton />
            <ProfileFilters resource="" />
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
