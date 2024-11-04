import { useMemo, useState } from "react";
import { NumberInput, required, SimpleForm, TextInput, useGetList } from "react-admin";
import { Create } from "@/operations/common/components";
import { DateTimeField } from "@/operations/common/components/fields";
import { AutocompleteInput } from "@/ui/components/inputs";
import authProvider from "@/providers/authProvider";

export const ExamCreate = () => {
    const user = authProvider.getCachedWhoami();
    const userRole = user.role;

    const [selectedTeacherId, setSelectedTeacherId] = useState("");

    const { data: awardedCourses = [] } = useGetList(
        'awarded-courses',
        { filter: { teacherId: selectedTeacherId  } }
    );

    const { data: teacherAwarded = [] } = useGetList(
        'awarded-courses',
        { filter: { teacherId: user.id  } }
    );
    const teacherAwardedChoice = useMemo(() => {
        return teacherAwarded.map(({ id, course, group }) => ({
            id,
            courseName: `${course.code} - ${group.ref}`,
        }));
    }, [teacherAwarded]);

    const { data: teacher = [] } = useGetList('teachers');

    const courseChoice = useMemo(() => {
        return awardedCourses.map(({ id, course, group }) => ({
            id,
            courseName: `${course.code} - ${group.ref}`,
        }));
    }, [awardedCourses]);

    const teacherChoice = useMemo(() => {
        return teacher.map(({ id, first_name, last_name }) => ({
            id,
            teacherName: `${first_name} , ${last_name}`,
        }));
    }, [teacher]);

    const handleTeacherChange = (value: string) => {
        if (userRole !== 'teacher') {
            setSelectedTeacherId(value);
        }
    }

    return (
        <Create
            resource="exams"
            title="Création d'un examen"
        >
            <SimpleForm>
                {userRole == "MANAGER" ? (
                    <>
                    <AutocompleteInput
                        data-testId= "teacher-input"
                        source="teacher"
                        choices={teacherChoice}
                        label="Enseignant"
                        optionText="teacherName"
                        optionValue="id"
                        validate={required()}
                        onChange={handleTeacherChange}
                    />

                {selectedTeacherId &&
                    <AutocompleteInput
                        data-testId= "awarded-course-input"
                        source="awarded_course_id"
                        choices={courseChoice}
                        label="Cours associé à un groupe"
                        optionText="courseName"
                        optionValue="id"
                        validate={required()}
                    />
                } </>
                ) : (
                    <AutocompleteInput
                        source="awarded_course_id"
                        choices={teacherAwardedChoice}
                        label="Cours associé à un groupe"
                        optionText="courseName"
                        optionValue="id"
                        validate={required()}
                    />
                 )}

                <TextInput
                    data-testId="title-input"
                    source="title"
                    label="Titre"
                    fullWidth
                    validate={required()}
                />
                <NumberInput
                    data-testId="coefficient-input"
                    source="coefficient"
                    label="Coefficient"
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
}