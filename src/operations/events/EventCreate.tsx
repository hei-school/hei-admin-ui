import {
  DateTimeInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useGetList,
} from "react-admin";
import {Box} from "@mui/material";
import {v4 as uuid} from "uuid";
import {CreateEvent, EventType} from "@haapi/typescript-client";
import {AutocompleteArrayInput} from "@/ui/components/ra-inputs";
import {SelectCourse} from "./components/inputs/SelectCourse";
import {Create} from "../common/components";
import {mapToChoices} from "@/utils";
import {EVENT_TYPE_VALUE} from "./utils/eventChoices";
import {SelectPlanner} from "./components/inputs";
import authProvider from "@/providers/authProvider";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {create} from "domain";

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
      title="Création d'un événement"
      transform={(
        event: CreateEvent & {groups: string[]; isPlannedByMe: boolean}
      ) => {
        const {isPlannedByMe, ...createEvent} = event;

        if (event.event_type !== EventType.COURSE) delete createEvent.course_id;

        return {
          ...createEvent,
          id: uuid(),
          groups: event.groups.map((group) => ({id: group})),
          planner_id: isPlannedByMe ? userId : event.planner_id!,
        };
      }}
    >
      <SimpleForm>
        <TextInput
          label="Titre"
          source="title"
          fullWidth
          validate={required()}
        />
        <TextInput
          label="Description"
          source="description"
          multiline
          fullWidth
        />
        <SelectPlanner />
        <Box
          sx={{display: "flex", alignItems: "center", gap: 1, width: "100%"}}
        >
          <DateTimeInput
            label="Début"
            source="begin_datetime"
            fullWidth
            validate={required()}
          />
          <DateTimeInput
            label="Fin"
            source="end_datetime"
            fullWidth
            validate={required()}
          />
        </Box>
        <SelectInput
          fullWidth
          label="Types"
          source="event_type"
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
