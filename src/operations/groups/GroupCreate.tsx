import {Group} from "@haapi/typescript-client";
import {useState} from "react";
import {DateInput, SimpleForm, TextInput} from "react-admin";
import {Create, StudentListWithBulkActions} from "../common/components";
import {ColorInput} from "../common/components/ColorInput";
import {EditToolBar} from "../utils";

const GroupCreate = () => {
  const [students, setStudents] = useState([]);

  return (
    <Create
      resource="groups"
      title="Création de groupe"
      redirect="show"
      transform={(group: Group) => ({...group, students})}
    >
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
        <StudentListWithBulkActions setStudentsIds={setStudents} />
      </SimpleForm>
    </Create>
  );
};

export default GroupCreate;
