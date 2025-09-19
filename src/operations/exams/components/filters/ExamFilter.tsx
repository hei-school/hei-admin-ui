import {useRole} from "@/security/hooks";
import {DateTimeFilter, FilterForm, SelectInputFilter} from "@/ui/haToolbar";
import {Box, Divider, Typography} from "@mui/material";
import {useMemo} from "react";
import {useGetList} from "react-admin";

export const ExamFilter = () => {
  const {data: groups = []} = useGetList("groups");
  const {data: courses = []} = useGetList("course");
  const {data: teachers = []} = useGetList("teachers");
  const {isAdmin, isManager} = useRole();

  const groupChoices = useMemo(() => {
    return groups.map(({ref = ""}) => ({
      id: ref,
      name: ref,
    }));
  }, [groups]);

  const courseChoices = useMemo(() => {
    return courses.map(({code = ""}) => ({
      id: code,
      name: code,
    }));
  }, [courses]);

  const teacherChoices = useMemo(() => {
    return teachers.map(({id = "", first_name = "", last_name = ""}) => ({
      id,
      name: first_name + " " + (last_name ?? ""),
    }));
  }, [teachers]);

  return (
    <Box>
      <FilterForm>
        {(isAdmin() || isManager()) && (
          <SelectInputFilter
            data-testid="teacher-filter"
            label="Enseignant"
            name="teacher_id"
            source="teacher_id"
            choices={teacherChoices}
          />
        )}
        <SelectInputFilter
          data-testid="group-filter"
          label="Groupe"
          name="ref"
          source="group_ref"
          choices={groupChoices}
        />
        <SelectInputFilter
          data-testid="course-filter"
          source="course_code"
          label="Cours"
          choices={courseChoices}
          optionValue="code"
          optionText="name"
          helperText={false}
          fullWidth
        />
        <Divider sx={{mt: 2, mb: 1}} />
        <Typography
          variant="body2"
          fontWeight="bold"
          color="#B4B5B7"
          sx={{mt: 2, mb: 1}}
        >
          Filtre par plage de date
        </Typography>
        <DateTimeFilter source="examination_date_from" label="De" fullWidth />
        <DateTimeFilter source="examination_date_to" label="À" fullWidth />
      </FilterForm>
    </Box>
  );
};
