import {TextField} from "react-admin";
import {MenuBook as BookIcon} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";

export const TeacherCourseList = () => {
  const {isTeacher} = useRole();
  const teacherId = isTeacher() ? authProvider.getCachedWhoami().id : null;
  return (
    <HaList
      icon={<BookIcon />}
      title="Cours"
      resource="awarded-courses"
      actions={""}
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
