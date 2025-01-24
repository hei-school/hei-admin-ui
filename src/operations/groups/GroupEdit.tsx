import {DateInput, SimpleForm, TextInput} from "react-admin";
import {Edit} from "../common/components";
import {EditToolBar} from "../utils";
import {ColorInput} from "../common/components/ColorInput";

const GroupEdit = () => {
  return (
    <Edit resource="groups" title="Groupe">
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput source="ref" label="Référence" required fullWidth />
        <TextInput source="name" label="Nom du groupe" required fullWidth />
        <DateInput
          source="creation_datetime"
          label="Date de création"
          required
          fullWidth
        />
        <ColorInput
          source="attributed_color"
          label="Code couleur groupe"
          inputProps={{
            size: "small",
            sx: {flex: 1},
          }}
          hexInputProps={{
            sx: {flex: 1},
          }}
          wrapperProps={{width: "100%"}}
        />
      </SimpleForm>
    </Edit>
  );
};
export default GroupEdit;
