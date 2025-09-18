import {RoomEnum} from "@haapi-b0fc7615/typescript-client";
import {required, SelectInput, TextInput} from "react-admin";
import {useWatch} from "react-hook-form";
import {CLASSROOM_CHOICES} from "../utils";

export const SelectClassroom = () => {
  const selectedClassroom = useWatch({
    name: "location.room",
    defaultValue: CLASSROOM_CHOICES[0].value,
  });

  return (
    <>
      <SelectInput
        fullWidth
        label="Salle"
        source="location.room"
        data-testid="event-location"
        optionText="label"
        optionValue="value"
        defaultValue={CLASSROOM_CHOICES[0].value}
        choices={CLASSROOM_CHOICES}
        validate={required()}
      />
      {selectedClassroom === RoomEnum.UNKNOWN && (
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
