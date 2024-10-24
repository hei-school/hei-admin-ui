import {required, useGetList} from "react-admin";
import {useWatch} from "react-hook-form";
import {EventType} from "@haapi/typescript-client";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {AutocompleteInput} from "@/ui/components/inputs";

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
    <AutocompleteInput
      label="Cours"
      source="course_id"
      optionText="label"
      optionValue="value"
      data-testid="event-course"
      choices={COURSE_CHOICES}
      disabled={eventType !== EventType.COURSE}
      isLoading={isLoading}
      validate={required()}
      fullWidth
    />
  ) : null;
}
