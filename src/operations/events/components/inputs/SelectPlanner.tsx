import { EventType } from "@haapi/typescript-client";
import { SelectInput, required, useGetList } from "react-admin";
import { mapToChoices } from "@/utils";

export function SelectPlanner(){
  const {data: teacher, isLoading: isTeacherLoading} = useGetList("teachers");
  const {data: managers , isLoading: isManagerLoading} = useGetList("managers");

  return (
    <SelectInput
      label="Cours"
      source="course_id"
      optionText="label"
      optionValue="value"
      choices={}
      disabled={eventType !== EventType.COURSE}
      isLoading={isManagerLoading || isTeacherLoading}
      validate={required()}
      fullWidth
    />
  )
}