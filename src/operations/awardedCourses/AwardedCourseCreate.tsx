import { Create, required, SelectInput, SimpleForm, TextInput, useGetList } from "react-admin"
import {useParams} from "react-router-dom";
export const AwardedCoursesCreate = ({toggleShowCreate}: any) => {
    const params = useParams();
    const courseId = params.id;
    const {data: teachers} = useGetList("teachers");
    const {data: groups} = useGetList("groups");
    const teacherChoices = teachers ? teachers.map(teacher => ({ 
        id: teacher.id, name: `${teacher.first_name} ${teacher.last_name}` 
    })) : [];
    const groupChoices = groups ? groups.map(group => ({
        id: group.id, ref: group.ref
    })) : [];
    return (
        <Create 
            resource="awarded-courses"
            title=" "
            redirect= {() => `course/${courseId}/show`}
            mutationOptions={{
                onSuccess: () => {
                    toggleShowCreate();
                }
            }}
        >
            <SimpleForm>
                <TextInput
                    source="course_id" 
                    label="Course ID" 
                    defaultValue={courseId} 
                    disabled
                />
                <SelectInput 
                    source="main_teacher_id" 
                    label="Enseignant" 
                    choices={teacherChoices} 
                    optionValue="id"
                    optionText="name"
                    validate={[required()]}
                />
                <SelectInput 
                    source="group_id" 
                    label="Groupe" 
                    choices={groupChoices} 
                    optionValue="id"
                    optionText="ref"
                    validate={[required()]}
                />
            </SimpleForm>
        </Create>
    )
}
