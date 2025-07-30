import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {Group} from "@haapi/typescript-client";
import {MenuBook as BookIcon} from "@mui/icons-material";
import {FunctionField, TextField} from "react-admin";

export const TeacherCourseList = () => {
  const teacher = authProvider.getCachedWhoami();
  if (!teacher) return null;
  const teacherId = teacher.id;

  return (
    <HaList
      icon={<BookIcon />}
      title="Cours"
      resource="courses-assignements"
      actions={false}
      listProps={{
        filter: {teacherId: teacherId},
      }}
      datagridProps={{
        rowClick: false,
      }}
    >
      <TextField source="course.code" label="Code" />
      <TextField source="course.name" label="Nom" />
      <FunctionField
        label="Groupe"
        render={(record) =>
          record.groups.map((group: Group) => group.ref).join(", ")
        }
      />
    </HaList>
  );
};
