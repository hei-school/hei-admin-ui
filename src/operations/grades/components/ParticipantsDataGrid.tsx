import {DateField} from "@/operations/common/components/fields";
import {ExamGradeListActions} from "@/operations/grades/components";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {Grade, Student} from "@haapi-b0fc7615/typescript-client";
import {Book} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";
import {GradeEditButton} from "./GradeEditButton";

export interface ExamGradeRecord {
  student: Student;
  grade?: Grade;
}

export const ParticipantsDataGrid = ({examId}: {examId: string}) => {
  const {isTeacher, isAdmin} = useRole();

  return (
    <HaList
      icon={<Book />}
      resource="exam-grades"
      title="Liste des participants"
      datagridProps={{rowClick: false}}
      listProps={{
        queryOptions: {meta: {examId}},
        title: "Notes des participants",
        className: "participants-list",
      }}
      actions={
        (isTeacher() || isAdmin()) && <ExamGradeListActions examId={examId} />
      }
    >
      <TextField source="student.ref" label="Référence" />
      <TextField source="student.last_name" label="Nom" />
      <TextField source="student.first_name" label="Prénom(s)" />
      <FunctionField
        label="Note"
        render={(record: ExamGradeRecord) =>
          record?.grade?.score != null ? record.grade.score : "Non définie"
        }
      />
      <DateField source="grade.update_date" label="Mis à jour le" />
      {(isTeacher() || isAdmin()) && (
        <FunctionField
          label="Actions"
          render={(record: ExamGradeRecord) => (
            <GradeEditButton examId={examId} record={record} />
          )}
        />
      )}
    </HaList>
  );
};
