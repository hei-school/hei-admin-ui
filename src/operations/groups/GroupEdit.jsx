import {SimpleForm, TextInput} from "react-admin";
import {Edit} from "../common/components";
import {EditToolBar} from "../utils";

const GroupEdit = () => {
  return (
    <Edit resource="groups" title="Groupe">
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput source="ref" label="Référence" required fullWidth />
        <TextInput source="name" label="Nom du groupe" required fullWidth />
      </SimpleForm>
    </Edit>
  );
};
export default GroupEdit;
