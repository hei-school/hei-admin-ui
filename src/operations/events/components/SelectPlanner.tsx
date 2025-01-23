import {useEffect, useState} from "react";
import {BooleanInput, required} from "react-admin";
import {useWatch} from "react-hook-form";
import {Teacher} from "@haapi/typescript-client";
import {Box} from "@mui/material";
import {AutocompleteInput} from "@/ui/components/inputs";
import dataProvider, {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import authProvider from "@/providers/authProvider";

function SelectUserPlanner() {
  const userId = authProvider.getCachedWhoami().id;
  const [ref, setRef] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const doEffect = async () => {
      setIsLoading(true);
      await dataProvider
        .getList("teachers", {
          filter: {ref},
          pagination: {perPage: MAX_ITEM_PER_PAGE, page: 1},
        })
        .then(({data}) => {
          setTeachers(data);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    };
    doEffect();
  }, [ref]);

  const getRef = (_value: string, record: any) => {
    setRef(record.ref);
  };

  const PLANNER_CHOICES = [...teachers]
    .filter((user) => user.id !== userId!)
    .map((user) => ({
      label: `${user.ref}: ${user.first_name || user.last_name}`,
      ref: user.ref,
      value: user.id,
    }));

  return (
    <AutocompleteInput
      label="Planificateur"
      source="planner_id"
      optionText="label"
      optionValue="value"
      choices={PLANNER_CHOICES}
      isLoading={isLoading}
      validate={required()}
      onChange={getRef}
      fullWidth
    />
  );
}

export function SelectPlanner() {
  const isPlannedByMe = useWatch({name: "isPlannedByMe"}) ?? true;

  return (
    <Box width="100%">
      <BooleanInput
        defaultValue={true}
        source="isPlannedByMe"
        label="Planifié par moi"
      />
      {isPlannedByMe ? null : <SelectUserPlanner />}
    </Box>
  );
}
