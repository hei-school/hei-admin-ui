import {FC} from "react";
import {
  Create,
  required,
  SelectInput,
  SimpleForm,
  useGetList,
} from "react-admin";
import {useParams} from "react-router-dom";

interface AwardedCoursesCreateProps {
  toggleShowCreate: () => void;
}

export const AwardedCoursesCreate: FC<AwardedCoursesCreateProps> = ({
  toggleShowCreate,
}) => {
  const {data: teachers} = useGetList("teachers");
  const {data: groups} = useGetList("groups");

  const params = useParams();
  const courseId = params.id;

  const teacherChoices = teachers
    ? teachers.map((teacher) => ({
        id: teacher.id,
        name: `${teacher.first_name} ${teacher.last_name}`,
      }))
    : [];

  const groupChoices = groups
    ? groups.map((group) => ({
        id: group.id,
        ref: group.ref,
      }))
    : [];

  return (
    <Create
      resource="awarded-courses"
      title=" "
      redirect={() => `course/${courseId}/show`}
      mutationOptions={{
        onSuccess: () => {
          toggleShowCreate();
        },
      }}
      transform={(data: any) => ({
        ...data,
        course_id: courseId,
      })}
    >
      <SimpleForm>
        <SelectInput
          data-testid="teacher-select"
          source="main_teacher_id"
          label="Enseignant"
          choices={teacherChoices}
          optionValue="id"
          optionText="name"
          validate={[required()]}
        />
        <SelectInput
          data-testid="group-select"
          source="group_id"
          label="Groupe"
          choices={groupChoices}
          optionValue="id"
          optionText="ref"
          validate={[required()]}
        />
      </SimpleForm>
    </Create>
  );
};
