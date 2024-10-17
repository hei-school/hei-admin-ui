import {required, SimpleForm, useGetList, useGetOne} from "react-admin";
import {Edit} from "@/operations/common/components";
import {FC} from "react";
import {useNotify} from "@/hooks";
import {Dialog} from "@/ui/components";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {AutocompleteArrayInput} from "@/ui/components/inputs";

const AddGroup = ({toggle, eventId}: {toggle: () => void; eventId: string}) => {
  const {data: event} = useGetOne("events", {id: eventId});

  const notify = useNotify();
  const {data: groups = [], isLoading: isGroupsLoading} = useGetList("groups", {
    pagination: {
      page: 1,
      perPage: MAX_ITEM_PER_PAGE - 1,
    },
  });
  return (
    <Edit
      resource="events"
      title=" "
      id={eventId}
      redirect={false}
      transform={(data: any) => {
        // FIXME: backend not handle null id (course_id)
        return {
          ...event,
          course_id: event.course?.id,
          planner_id: event.planner?.id,
          event_type: event.type,
          groups: data.groups?.map((group: string) => ({id: group})),
        };
      }}
      mutationOptions={{
        onSuccess: () => {
          notify("Groupe ajuter avec succès", {type: "success"});
          toggle();
        },
      }}
    >
      <SimpleForm>
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
    </Edit>
  );
};

export const AddGroupDialog: FC<{
  show: boolean;
  toggle: () => void;
  eventId: string;
}> = ({show, toggle, eventId}) => {
  return (
    <Dialog title="Ajout de nouveau groupe" open={show} onClose={toggle}>
      <AddGroup toggle={toggle} eventId={eventId!} />
    </Dialog>
  );
};
