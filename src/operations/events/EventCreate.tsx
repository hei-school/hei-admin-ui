import { 
  DateTimeInput, 
  SelectArrayInput, 
  SelectInput, 
  SimpleForm, 
  TextInput, 
  required, 
  useGetList 
} from "react-admin";
import {Box} from "@mui/material"
import {v4 as uuid} from "uuid";
import { CreateEvent, EventType, GroupIdentifier } from "@haapi/typescript-client";
import { Create } from "../common/components";
import { SelectCourse } from "./components/inputs/SelectCourse";
import { mapToChoices } from "@/utils";
import { EVENT_TYPE_VALUE } from "./utils/eventChoices";
import authProvider from "@/providers/authProvider";

export function EventCreate(){
  const userId = authProvider.getCachedWhoami().id;
  const {data: groups = [], isLoading: isGroupsLoading}= useGetList("groups");

  const GROUP_CHOICES = groups.map(group => ({label: group.ref, value: group.id}));
  
  return (
    <Create
      resource="events"
      title="Création d'un événement"
      transform={(event: CreateEvent & {groups: string[]}) => {
        return {
          ...event,
          id: uuid(), 
          groups: event.groups.map(group => ({id: group})),
          planner_id: userId!
        }
      }}
    >
      <SimpleForm>
        <TextInput label="Titre" source="title" fullWidth validate={required()}/>
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
        <TextInput label="Description" source="description" multiline fullWidth />
        <Box sx={{display: "flex", alignItems: "center", gap: 1, width: "100%"}}>
          <DateTimeInput label="Début" source="begin_datetime" fullWidth validate={required()} />
          <DateTimeInput label="Fin" source="end_datetime" fullWidth validate={required()} />
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
        <SelectArrayInput
          label="Groupes"
          source="groups"
          optionText="label"
          optionValue="value"
          choices={GROUP_CHOICES}
          isLoading={isGroupsLoading}
          validate={required()}
          fullWidth
        />
      </SimpleForm>
    </Create>
  )
}