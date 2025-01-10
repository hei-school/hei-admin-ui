import {FC} from "react";
import {EditButton, TextField} from "react-admin";
import {Box} from "@mui/material";
import {AssignmentInd, Download} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {useRole} from "@/security/hooks";
import {PALETTE_COLORS} from "@/haTheme";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import staffProvider from "@/providers/staffProvider";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "../utils/userImportConf";
import dataProvider from "@/providers/dataProvider";
import {FileDownloader} from "../common/components";

const StaffList: FC = () => {
  const {isAdmin} = useRole();
  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("staffs-export", {
      undefined,
    });
    return {data: file};
  };
  return (
    <Box>
      <HaList
        title="Liste des staffs de HEI"
        mainSearch={{label: "Prénom·s", source: "first_name"}}
        actions={
          <>
            <CreateButton resource="staffmembers" />
            <FileDownloader
              downloadFunction={downloadFile}
              fileName="Liste des staffs"
              startIcon={<Download />}
              sx={{
                textTransform: "none",
                color: "inherit",
                opacity: "0.8",
                padding: "0.5rem 1.1rem",
                gap: "0.8rem",
              }}
              buttonText="Exporter"
              successMessage="Exportation en cours..."
              errorMessage="Erreur lors de l'exportation du fichier."
              fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
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
