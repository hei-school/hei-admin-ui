import {Create} from "@/operations/common/components";
import {DateTimeField} from "@/operations/common/components/fields";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {AutocompleteInput} from "@/ui/components/inputs";
import {Box} from "@mui/material";
import {useMemo, useState} from "react";
import {
  NumberInput,
  required,
  SimpleForm,
  TextInput,
  useGetList,
} from "react-admin";

// TODO: Transform this into a Dialog
export const ExamCreate = () => {
  const {role: userRole, id: userId} = authProvider.getCachedWhoami();
  const {isTeacher, isManager, isAdmin} = useRole();

  const isPrivileged = isTeacher() || isManager() || isAdmin();

  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const {data: teachers = []} = useGetList("teachers");
  const {data: awardedCourses = []} = useGetList("awarded-courses", {
    filter: {teacherId: selectedTeacherId},
  });
  const {data: teacherAwarded = []} = useGetList("awarded-courses", {
    filter: {teacherId: userId},
  });

  const teacherChoices = useMemo(
    () =>
      teachers.map(({id, first_name, last_name}) => ({
        id,
        teacherName: `${first_name}, ${last_name}`,
      })),
    [teachers]
  );

  const courseChoices = useMemo(
    () =>
      awardedCourses.map(({id, course, group}) => ({
        id,
        courseName: `${course.code} - ${group.ref}`,
      })),
    [awardedCourses]
  );

  const teacherAwardedChoices = useMemo(
    () =>
      teacherAwarded.map(({id, course, group}) => ({
        id,
        courseName: `${course.code} - ${group.ref}`,
      })),
    [teacherAwarded]
  );

  const handleTeacherChange = (value: string) => {
    if (userRole !== "teacher") {
      setSelectedTeacherId(value);
    }
  };

  return (
    <Create resource="exams" title="Création d'un examen">
      <SimpleForm>
        {isPrivileged ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <AutocompleteInput
              data-testId="teacher-input"
              source="teacher"
              label="Enseignant"
              choices={teacherChoices}
              optionText="teacherName"
              optionValue="id"
              validate={required()}
              onChange={handleTeacherChange}
            />
            {selectedTeacherId && (
              <AutocompleteInput
                data-testId="awarded-course-input"
                source="awarded_course_id"
                label="Cours associé à un groupe"
                choices={courseChoices}
                optionText="courseName"
                optionValue="id"
                validate={required()}
              />
            )}
          </Box>
        ) : (
          <AutocompleteInput
            source="awarded_course_id"
            label="Cours associé à un groupe"
            choices={teacherAwardedChoices}
            optionText="courseName"
            optionValue="id"
            validate={required()}
          />
        )}

        <TextInput
          source="title"
          label="Titre"
          data-testId="title-input"
          fullWidth
          validate={required()}
        />
        <NumberInput
          source="coefficient"
          label="Coefficient"
          data-testId="coefficient-input"
          fullWidth
          validate={required()}
        />
        <DateTimeField
          source="examination_date"
          label="Date de l'examen"
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};
