import {PALETTE_COLORS} from "@/haTheme";
import dataProvider from "@/providers/dataProvider";
import staffProvider from "@/providers/staffProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {NOOP_ID} from "@/utils/constants";
import {AssignmentInd, Download} from "@mui/icons-material";
import {FC} from "react";
import {EditButton, TextField} from "react-admin";
import {FileDownloader} from "../common/components";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "../utils/userImportConf";

const StaffList: FC = () => {
  const {isAdmin} = useRole();
  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("staffs-export", {
      id: NOOP_ID,
    });
    return {data: file};
  };
  return (
    <HaList
      icon={<AssignmentInd />}
      resource="staffmembers"
      title="Liste des staffs de HEI"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      listProps={{
        title: "Liste des staffs de HEI",
        className: "staff-list",
      }}
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
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <TextField source="function" label="Poste" />
      {isAdmin() && (
        <EditButton
          data-testid="edit-button"
          sx={{color: PALETTE_COLORS.yellow}}
        />
      )}
    </HaList>
  );
};

export default StaffList;
