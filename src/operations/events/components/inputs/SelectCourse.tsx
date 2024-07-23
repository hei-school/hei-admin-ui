import {SelectInput, required, useGetList} from "react-admin";
import {useWatch} from "react-hook-form";
import {EventType} from "@haapi/typescript-client";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";

export function SelectCourse() {
  const {data: courses = [], isLoading} = useGetList("course", {
    pagination: {
      page: 1,
      perPage: MAX_ITEM_PER_PAGE - 1,
    },
  });
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
