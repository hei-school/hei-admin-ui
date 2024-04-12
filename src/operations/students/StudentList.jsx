import { EditButton, ShowButton, TextField } from "react-admin";
import { SchoolOutlined, UploadFile } from "@mui/icons-material";
import { CreateButton, ExportButton, ImportButton } from "../../ui/haToolbar";
import { HaList } from "../../ui/haList";
import { WhoamiRoleEnum } from "@haapi/typescript-client";
import authProvider from "../../providers/authProvider";
import studentProvider from "../../providers/studentProvider";
import { exporter, exportHeaders, importHeaders } from "../utils";
import { ProfileFilters } from "../profile";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
} from "../utils/userImportConf";
import { transformStudentData } from "./importConf";

const ListActions = ({ isManager }) => {
  return (
    <>
      {isManager && (
        <>
          <CreateButton />
          <ExportButton
            exportHandler={() =>
              exporter([], importHeaders, "template_students")
            }
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
        </>
      )}
      <ExportButton
        exportHandler={(list) => exporter(list, exportHeaders, "students")}
      />
      <ProfileFilters />
    </>
  );
};

function StudentList() {
  const role = authProvider.getCachedRole();
  const isManager = role === WhoamiRoleEnum.MANAGER;

  return (
    <HaList
      icon={<SchoolOutlined />}
      title={"Liste des étudiants"}
      mainSearch={{ label: "Prénom·s", source: "first_name" }}
      actions={<ListActions isManager={isManager} />}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      {isManager ? <EditButton /> : <ShowButton />}
    </HaList>
  );
}

export default StudentList;
