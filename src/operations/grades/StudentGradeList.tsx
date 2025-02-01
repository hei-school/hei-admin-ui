import {Datagrid, List, ReferenceField, TextField} from "react-admin";
import {useParams} from "react-router-dom";

export const StudentGradeList = () => {
  const {studentId} = useParams();
  return (
    <List
      resource="student-grades"
      filter={{studentId: studentId}}
      data-testid="student-grade-list"
    >
      <Datagrid rowClick="edit">
        <ReferenceField source="main_teacher.id" reference="teachers">
          <TextField source="ref" />
        </ReferenceField>
        <TextField
          source="main_teacher.first_name"
          label="Teacher First Name"
        />
        <TextField source="main_teacher.last_name" label="Teacher Last Name" />

        <ReferenceField source="course.id" reference="courses">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="course.code" label="Course Code" />

        <ReferenceField source="group.id" reference="groups">
          <TextField source="name" />
        </ReferenceField>

        <TextField source="exams[0].grade.score" label="Grade" />
        <TextField
          source="exams[0].student.specialization_field"
          label="Field"
        />
      </Datagrid>
    </List>
  );
};
