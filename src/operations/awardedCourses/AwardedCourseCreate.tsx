import {useNotify} from "@/hooks";
import {useMemo} from "react";
import {
  Create,
  required,
  SelectInput,
  SimpleForm,
  useGetList,
} from "react-admin";
import {useParams} from "react-router-dom";

export interface AwardedCoursesCreateProps {
  toggleShowCreate: () => void;
}

export const AwardedCoursesCreate = ({
  toggleShowCreate,
}: AwardedCoursesCreateProps) => {
  const {data: teachers = []} = useGetList("teachers");
  const {data: groups = []} = useGetList("groups");

  const params = useParams();
  const courseId = params.id;

  const notify = useNotify();

  const teacherChoices = useMemo(() => {
    return teachers.map(({id, first_name = "", last_name = ""}) => ({
      id,
      name: `${first_name} ${last_name}`,
    }));
  }, [teachers]);

  const groupChoices = useMemo(() => {
    return groups.map(({id, ref = ""}) => ({
      id,
      ref,
    }));
  }, [groups]);

  return (
    <Create
      resource="awarded-courses"
      title=" "
      redirect={() => `course/${courseId}/show`}
      mutationOptions={{
        onSuccess: () => {
          notify("Élément créer avec succès", {type: "success"});
          toggleShowCreate();
        },
      }}
    >
      <SimpleForm defaultValues={{course_id: courseId}}>
        <SelectInput
          data-testid="teacher-select"
          source="main_teacher_id"
          label="Enseignant"
          choices={teacherChoices}
          optionValue="id"
          optionText="name"
          validate={[required()]}
          style={{
            width: "100%",
          }}
        />
        <SelectInput
          data-testid="group-select"
          source="group_id"
          label="Groupe"
          choices={groupChoices}
          optionValue="id"
          optionText="ref"
          validate={[required()]}
          style={{
            width: "100%",
          }}
        />
      </SimpleForm>
    </Create>
  );
};
