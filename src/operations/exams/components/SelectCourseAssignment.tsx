import {Course, Group} from "@haapi/typescript-client/dist/api";
import {Typography} from "@mui/material";
import {useMemo} from "react";
import {SelectInput, required, useGetList} from "react-admin";
import {useWatch} from "react-hook-form";

export const SelectCourseAssignment = ({
  defaultTeacherId,
}: {
  defaultTeacherId?: string;
}) => {
  const selectedTeacherId = useWatch({name: "teacher"}) || defaultTeacherId;

  const {data: teacherCoursesData = [], isLoading} = useGetList(
    "courses-assignements",
    {
      filter: {teacherId: selectedTeacherId},
    }
  );

  const courseChoices = useMemo(
    () =>
      teacherCoursesData.map(
        ({
          id,
          course,
          groups,
        }: {
          id: string;
          course: Course;
          groups: Group[];
        }) => ({
          id,
          courseName: `${course.code} - ${groups.map((g) => g.ref).join(", ")}`,
        })
      ),
    [teacherCoursesData]
  );

  if (isLoading && selectedTeacherId) {
    return <Typography variant="body2">Chargement des cours...</Typography>;
  }

  if (selectedTeacherId && courseChoices.length === 0) {
    return (
      <Typography
        variant="body2"
        color="error"
        style={{
          marginBottom: 20,
        }}
      >
        Aucun cours disponible pour cet enseignant.
      </Typography>
    );
  }

  if (!selectedTeacherId) return null;

  return (
    <SelectInput
      source="course_assignment_id"
      label="Cours associé à un groupe"
      choices={courseChoices}
      optionText="courseName"
      optionValue="id"
      validate={required()}
      fullWidth
      data-testid="course-select"
    />
  );
};
