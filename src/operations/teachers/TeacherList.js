import {EditButton, TextField} from "react-admin";
import {CreateButton, ExportButton, ImportButton} from "../../ui/haToolbar";
import {HaList} from "../../ui/haList";
import {WorkOutlined} from "@mui/icons-material";
import {ProfileFilters} from "../profile";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  transformUserData,
  validateUserData,
} from "../utils/userImportConf";
import teacherProvider from "../../providers/teacherProvider";

function TeacherList() {
  return (
    <HaList
      icon={<WorkOutlined />}
      title="Liste des enseignants"
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      actions={
        <>
          <CreateButton />
          <ExportButton />
          <ImportButton
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
            provider={teacherProvider.saveOrUpdate}
            resource="professeurs"
            transformData={transformUserData}
            validateData={validateUserData}
          />
          <ProfileFilters />
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
