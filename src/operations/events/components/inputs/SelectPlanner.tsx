import {BooleanInput, required, useGetList} from "react-admin";
import {Teacher} from "@haapi/typescript-client";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {AutocompleteInput} from "@/ui/components/ra-inputs";
import {useWatch} from "react-hook-form";
import authProvider from "@/providers/authProvider";

function SelectUserPlanner() {
  const userId = authProvider.getCachedWhoami().id;
  const {data: teachers = [], isLoading} = useGetList<Required<Teacher>>(
    "teachers",
    {
      pagination: {
        page: 1,
        perPage: MAX_ITEM_PER_PAGE - 1,
      },
    }
  );

  const PLANNER_CHOICES = [...teachers]
    .filter((user) => user.id !== userId!)
    .map((user) => ({
      label: `${user.ref}: ${user.first_name || user.last_name}`,
      value: user.id,
    }));

  return (
    <AutocompleteInput
      label="Planner"
      source="planner_id"
      optionText="label"
      optionValue="value"
      choices={PLANNER_CHOICES}
      isLoading={isLoading}
      validate={required()}
      fullWidth
    />
  );
}

function SelectUserPlannerWrapper() {
  const isPlannedByMe = useWatch({name: "isPlannedByMe"});
  return isPlannedByMe ? null : <SelectUserPlanner />;
}

export function SelectPlanner() {
  return (
    <>
      <BooleanInput
        defaultValue={true}
        source="isPlannedByMe"
        label="Planifié par moi"
      />
      <SelectUserPlannerWrapper />
    </>
  );
}
