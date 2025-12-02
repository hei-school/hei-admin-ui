import {BooleanInput} from "react-admin";

export const SelectIsOnline = () => {
  return (
    <BooleanInput
      resource="events"
      defaultValue={false}
      label="Événement en ligne"
      source="is_online"
    />
  );
};
