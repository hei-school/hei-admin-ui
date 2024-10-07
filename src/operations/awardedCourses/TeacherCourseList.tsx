import {TextField} from "react-admin";
import {MenuBook as BookIcon} from "@mui/icons-material";
import {HaList} from "@/ui/haList";

export const TeacherCourseList = () => {
  return (
    <HaList
      icon={<BookIcon />}
      title="Cours"
      resource="awarded-courses"
      actions={""}
      listProps={{
        filterDefaultValues: {},
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
