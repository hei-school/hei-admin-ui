import {FC, useEffect} from "react";
import {
  BooleanInput,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useGetList,
} from "react-admin";
import {Box} from "@mui/material";
import {useWatch, useFormContext} from "react-hook-form";
import {v4 as uuid} from "uuid";
import {EventType, Group, GroupIdentifier} from "@haapi/typescript-client";
import {AutocompleteArrayInput} from "@/ui/components/inputs";
import {SelectCourse} from "./components";
import {Create} from "../common/components";
import {mapToChoices} from "@/utils";
import {EVENT_TYPE_VALUE, RECURRENCE_TYPE_CHOICES} from "./utils";
import {SelectPlanner} from "./components";
import authProvider from "@/providers/authProvider";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {DateTimeField} from "@/operations/common/components/fields";
import {EventInput} from "@fullcalendar/react";
import {ColorInput} from "../common/components/ColorInput";
import {ToRaRecord} from "../common/utils/types";
import {stringifyObj} from "../common/utils/strinfigy-obj";
import {SelectClassroom} from "./components/SelectClassrroom";

export function EventCreate() {
  const userId = authProvider.getCachedWhoami().id;
  const {data: groups = [], isLoading: isGroupsLoading} = useGetList<
    ToRaRecord<Group>
  >("groups", {
    pagination: {
      page: 1,
      perPage: MAX_ITEM_PER_PAGE - 1,
    },
  });

  return (
    <Create
      resource="events"
      title="Créer un événement"
      transform={(event: EventInput & {[key: string]: any}) => {
        const {isPlannedByMe, customTitle, ...createEvent} = event;

        if (event.event_type !== EventType.COURSE) delete createEvent.course_id;
        type AcceptDate = Date | number | string;
        const parseDate = (date: AcceptDate) => new Date(date).toISOString();

        if (createEvent.title === "autre" && customTitle) {
          createEvent.title = customTitle;
        }

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
        <SelectClassroom />
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
          label="Type d'événement"
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
        <RecurrenceFields />
        <SelectEventColor groupList={groups} />
      </SimpleForm>
    </Create>
  );
}

export const SelectEventColor: FC<{groupList: Group[]}> = ({groupList}) => {
  const {setValue} = useFormContext();
  const eventType = useWatch({
    name: "event_type",
    defaultValue: EventType.COURSE,
  });
  const groups = useWatch({name: "groups", defaultValue: []});
  const useGeneratedColor = useWatch({
    name: "useGeneratedColor",
    defaultValue: true,
  });
  const colorSource = "color";

  useEffect(() => {
    if (eventType === "EXAM") {
      setValue(colorSource, "#d50100");
    } else if (eventType !== "COURSE" || groups.length > 1) {
      setValue(colorSource, "#f6bf26");
    } else if (groups.length === 1) {
      const groupValue = groupList.find((group) => group.id === groups[0]);
      setValue(colorSource, groupValue?.attributed_color);
    }
  }, [eventType, stringifyObj(groupList), stringifyObj(groups)]);

  return (
    <>
      <BooleanInput
        defaultValue={useGeneratedColor}
        label="Utiliser les couleurs générées"
        source="useGeneratedColor"
      />
      {useGeneratedColor === true ? (
        <TextInput
          type="color"
          fullWidth
          defaultValue={"#0000FF"}
          readOnly
          source="color"
        />
      ) : (
        <ColorInput
          inputProps={{defaultValue: "#0000FF"}}
          source="color"
          label="Couleur de l'événement"
        />
      )}
    </>
  );
};

const RecurrenceFields = () => {
  const {watch, setValue} = useFormContext();

  const isRecurrent = watch("meta.isRecurrent", false);

  useEffect(() => {
    const startDate = new Date(watch("start"));
    const endDate = new Date(watch("end"));

    if (isRecurrent) {
      setValue("recurrent.startTime", startDate.toTimeString().slice(0, 5));
      setValue("recurrent.endTime", endDate.toTimeString().slice(0, 5));
    }
  }, [isRecurrent, watch, setValue]);

  return (
    <>
      <BooleanInput
        label="Événement récurrent"
        source="meta.isRecurrent"
        defaultValue={false}
      />
      {isRecurrent && (
        <>
          <SelectInput
            source="recurrent.recurrenceType"
            label="Type de récurrence"
            choices={RECURRENCE_TYPE_CHOICES}
            optionText="label"
            optionValue="value"
            validate={required()}
            fullWidth
          />
          <NumberInput
            fullWidth
            source="recurrent.frequency"
            label="Fréquence"
            validate={required()}
            min={1}
            defaultValue={1}
          />
          <Box display="flex" gap="1vw" width="100%">
            <TextInput
              source="recurrent.startTime"
              label="Heure de début"
              type="time"
              validate={required()}
              sx={{
                flex: 1,
              }}
            />
            <TextInput
              source="recurrent.endTime"
              label="Heure de fin"
              type="time"
              validate={required()}
              sx={{
                flex: 1,
              }}
            />
          </Box>
        </>
      )}
    </>
  );
};
