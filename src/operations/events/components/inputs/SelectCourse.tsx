import {SelectInput, required, useGetList} from "react-admin";
import {useWatch} from "react-hook-form";
import {EventType} from "@haapi/typescript-client";

export function SelectCourse() {
  const {data: courses = [], isLoading} = useGetList("course");
  const eventType = useWatch({name: "event_type"});

  const COURSE_CHOICES = courses.map((course) => ({
    label: course.name,
    value: course.id,
  }));

  return eventType === EventType.COURSE ? (
    <SelectInput
      label="Cours"
      source="course_id"
      optionText="label"
      optionValue="value"
      choices={COURSE_CHOICES}
      disabled={eventType !== EventType.COURSE}
      isLoading={isLoading}
      validate={required()}
      fullWidth
    />
  ) : null;
}
