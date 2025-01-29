import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {MenuBook as BookIcon} from "@mui/icons-material";
import {TextField} from "react-admin";

export const TeacherCourseList = () => {
  const teacher = authProvider.getCachedWhoami();
  if (!teacher) return null;
  const teacherId = teacher.id;

  return (
    <HaList
      icon={<BookIcon />}
      title="Cours"
      resource="awarded-courses"
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
      <TextField source="group.ref" label="Groupe" />
    </HaList>
  );
};
