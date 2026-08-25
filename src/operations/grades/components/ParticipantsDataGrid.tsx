import {DateField} from "@/operations/common/components/fields";
import {ExamGradeListActions} from "@/operations/grades/components";
import {HaList} from "@/ui/haList";
import {Grade, Student} from "@haapi-3d601c85/typescript-client";
import {Book} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";
import {GradeEditButton} from "./GradeEditButton";

export interface ExamGradeRecord {
  student: Student;
  grade?: Grade;
}

interface ParticipantsDataGridProps {
  examId: string;
  examName: string;
}

export const ParticipantsDataGrid = ({
  examId,
  examName,
}: ParticipantsDataGridProps) => {
  return (
    <HaList
      icon={<Book />}
      resource="exam-grades"
      title="Liste des participants"
      datagridProps={{rowClick: false}}
      mainSearch={{label: "Référence", source: "student_ref"}}
      listProps={{
        queryOptions: {meta: {examId}},
        title: "Notes des participants",
        className: "participants-list",
      }}
      actions={<ExamGradeListActions examName={examName} examId={examId} />}
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
      <FunctionField
        label="Actions"
        render={(record: ExamGradeRecord) => (
          <GradeEditButton examId={examId} record={record} />
        )}
      />
    </HaList>
  );
};
