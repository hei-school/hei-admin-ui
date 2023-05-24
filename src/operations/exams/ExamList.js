import { List } from "@react-admin/ra-rbac";
import { Datagrid, TextField, TopToolbar, CreateButton } from "react-admin";
import { CustomDateField } from "../utils";
import { WhoamiRoleEnum } from "../../gen/haClient";
import authProvider from "../../providers/authProvider";

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + "/create"} resource={resource} />
  </TopToolbar>
);

const ExamList = ({ courseId }) => {
  const role = authProvider.getCachedRole();
  return (
    <List
      title="Examens"
      resource={"exams"}
      hasCreate={role === WhoamiRoleEnum.Manager}
      actions={
        role === WhoamiRoleEnum.Manager && (
          <Actions basePath={`/courses/${courseId}/exams`} />
        )
      }
      pagination={false}
      sort={{ field: "examination_date", order: "DESC" }}
    >
      <Datagrid
        bulkActionButtons={false}
        rowClick={(examId) => `/courses/${courseId}/exams/${examId}/show`}
      >
        <TextField source="title" label="Détails" />
        <CustomDateField
          source="examination_date"
          label="Date"
          showTime={false}
        />
        <TextField source="coefficient" label="Coefficient" />
      </Datagrid>
    </List>
  );
};

export default ExamList;
