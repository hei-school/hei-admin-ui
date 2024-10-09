import {TextField} from "react-admin";
import {MenuBook as BookIcon} from "@mui/icons-material";
import {useRole} from "@/security/hooks";
import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";

export const TeacherCourseList = () => {
  const {isTeacher} = useRole();
  const teacherId = isTeacher() ? authProvider.getCachedWhoami().id : null;

  return (
    <HaList
      icon={<BookIcon />}
      title="Cours"
      resource="awarded-courses"
      actions={false}
      listProps={{
        filterDefaultValues: {teacherId: teacherId},
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
