import {EditButton, TextField} from "react-admin";
import {CreateButton, ImportButton} from "../../ui/haToolbar";
import {WorkOutlined, Download} from "@mui/icons-material";
import {HaList} from "../../ui/haList";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "../utils/userImportConf";
import teacherProvider from "../../providers/teacherProvider";
import {FileDownloader} from "../common/components";
import dataProvider from "@/providers/dataProvider";

const downloadFile = async () => {
  const {
    data: {file},
  } = await dataProvider.getOne("export-teachers", {
    id: null,
  });

  return {data: file};
};

function TeacherList() {
  return (
    <HaList
      icon={<WorkOutlined />}
      resource="teachers"
      title="Liste des enseignants"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={
        <>
          <CreateButton resource="teachers" />
          <FileDownloader
            downloadFunction={downloadFile}
            fileName="Liste des enseignants"
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
          <ImportButton
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
            provider={teacherProvider.saveOrUpdate}
            resource="professeurs"
            transformData={transformUserData}
            validateData={validateUserData}
          />
          <ProfileFilters resource="teachers" />
        </>
      }
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      <EditButton />
    </HaList>
  );
}

export default TeacherList;
