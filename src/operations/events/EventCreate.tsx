import {
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useGetList,
} from "react-admin";
import {Box} from "@mui/material";
import {v4 as uuid} from "uuid";
import {EventType, GroupIdentifier} from "@haapi/typescript-client";
import {AutocompleteArrayInput} from "@/ui/components/inputs";
import {SelectCourse} from "./components";
import {Create} from "../common/components";
import {mapToChoices} from "@/utils";
import {EVENT_TYPE_VALUE} from "./utils";
import {SelectPlanner} from "./components";
import authProvider from "@/providers/authProvider";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {DateTimeField} from "@/operations/common/components/fields";
import {EventInput} from "@fullcalendar/react";

export function EventCreate() {
  const userId = authProvider.getCachedWhoami().id;
  const {data: groups = [], isLoading: isGroupsLoading} = useGetList("groups", {
    pagination: {
      page: 1,
      perPage: MAX_ITEM_PER_PAGE - 1,
    },
  });

  return (
    <Create
      resource="events"
      title=" "
      transform={(event: EventInput & {[key: string]: any}) => {
        const {isPlannedByMe, ...createEvent} = event;

        if (event.event_type !== EventType.COURSE) delete createEvent.course_id;
        type AcceptDate = Date | number | string;
        const parseDate = (date: AcceptDate) => new Date(date).toISOString();

        return {
          ...createEvent,
          id: uuid(),
          groups: event.groups?.map((group: GroupIdentifier) => ({id: group})),
          planner_id: isPlannedByMe ? userId : event.planner_id!,
          begin_datetime: parseDate(event.start as AcceptDate),
          end_datetime: parseDate(event.end as AcceptDate),
        };
      }}
    >
      <SimpleForm>
        <TextInput
          label="Titre"
          source="title"
          data-testid="event-title"
          fullWidth
          validate={required()}
        />
        <TextInput
          label="Description"
          source="description"
          data-testid="event-description"
          multiline
          fullWidth
        />
        <SelectPlanner />
        <Box
          sx={{display: "flex", alignItems: "center", gap: 1, width: "100%"}}
        >
          <DateTimeField label="Début" source="start" validate={required()} />
          <DateTimeField label="Fin" source="end" validate={required()} />
        </Box>
        <SelectInput
          fullWidth
          label="Types"
          source="event_type"
          data-testid="event-type"
          optionText="label"
          optionValue="value"
          defaultValue={EventType.COURSE}
          choices={mapToChoices(EVENT_TYPE_VALUE)}
          validate={required()}
        />
        <SelectCourse />

        <AutocompleteArrayInput
          label="Groupes"
          source="groups"
          data-testid="event-groups"
          optionText="ref"
          optionValue="id"
          choices={groups}
          isLoading={isGroupsLoading}
          validate={required()}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
}
