import {Box} from "@mui/material";
import {FC, useMemo} from "react";
import {SelectInput, required, useGetList} from "react-admin";

export const SelectTeacher: FC<{isPrivileged: boolean}> = ({isPrivileged}) => {
  const {data: teachers = []} = useGetList(
    "teachers",
    {},
    {
      enabled: isPrivileged,
    }
  );

  const teacherChoices = useMemo(
    () =>
      teachers.map(({id, first_name, last_name}) => ({
        id,
        teacherName: `${first_name}, ${last_name}`,
      })),
    [teachers]
  );

  if (!teachers.length) return null;

  return (
    <Box sx={{width: "100%"}}>
      <SelectInput
        source="teacher"
        label="Enseignant"
        choices={teacherChoices}
        optionText="teacherName"
        optionValue="id"
        validate={required()}
        fullWidth
        data-testid="teacher-select"
      />
    </Box>
  );
};
