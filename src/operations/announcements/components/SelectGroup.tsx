import {SelectArrayInput, useGetList} from "react-admin";

export const SelectGroup = () => {
  const {data: groups} = useGetList("groups");

  return (
    <SelectArrayInput
      source="target_group_list"
      label="Groupes cibles"
      choices={groups}
      optionText="ref"
      fullWidth
    />
  );
};
