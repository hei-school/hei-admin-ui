import {required, SelectInput, TextInput} from "react-admin";
import {useWatch} from "react-hook-form";
import {CLASSROOM_CHOICES} from "../utils";

export const SelectClassroom = () => {
  const selectedClassroom = useWatch({
    name: "title",
    defaultValue: CLASSROOM_CHOICES[0].value,
  });

  return (
    <>
      <SelectInput
        fullWidth
        label="Salle"
        source="title"
        data-testid="event-title"
        optionText="label"
        optionValue="value"
        defaultValue={CLASSROOM_CHOICES[0].value}
        choices={CLASSROOM_CHOICES}
        validate={required()}
      />
      {selectedClassroom === "autre" && (
        <TextInput
          fullWidth
          label="Préciser la salle"
          source="customTitle"
          data-testid="event-title-custom"
          validate={required()}
        />
      )}
    </>
  );
};
