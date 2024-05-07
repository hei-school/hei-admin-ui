import {EditButton, ShowButton, TextField} from "react-admin";
import {SchoolOutlined, UploadFile} from "@mui/icons-material";
import {Box} from "@mui/material";
import {ProfileFilters} from "../profile/components/ProfileFilters";
import {CreateButton, ExportButton, ImportButton} from "../../ui/haToolbar";
import {HaList} from "../../ui/haList";
import {exportData, exportHeaders, importHeaders} from "../utils";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
} from "../utils/userImportConf";
import {transformStudentData} from "./importConf";
import {useRole} from "../../security/hooks";
import studentProvider from "../../providers/studentProvider";

const ListActions = () => {
  const {isManager} = useRole();
  return (
    <>
      {isManager() && (
        <Box>
          <CreateButton />
          <ExportButton
            onExport={() => exportData([], importHeaders, "template_students")}
            label="Template"
            icon={<UploadFile />}
          />
          <ImportButton
            validateData={validateUserData}
            resource="étudiants"
            provider={studentProvider.saveOrUpdate}
            transformData={transformStudentData}
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
          />
        </Box>
      )}
      <ExportButton
        onExport={(list) => exportData(list, exportHeaders, "students")}
      />
      <ProfileFilters resource="students" />
    </>
  );
};

function StudentList() {
  const {isManager} = useRole();

  return (
    <HaList
      icon={<SchoolOutlined />}
      title={"Liste des étudiants"}
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={<ListActions />}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      {isManager() ? <EditButton /> : <ShowButton />}
    </HaList>
  );
}

export default StudentList;
