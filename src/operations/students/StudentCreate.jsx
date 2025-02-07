import {
  BooleanInput,
  DateInput,
  maxLength,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";

import {SelectSpecialization} from "./components";
import {createStudentApi} from "./utils/studentFactory";

import {useToggle} from "../../hooks";
import {Create} from "../common/components";
import {CreateGeoLocalisation} from "../common/components/GeoLocalisation";
import {FeeInputs} from "../fees/components";
import {SexRadioButton} from "../utils";

const StudentCreate = () => {
  const [canCreateFees, , toggleCanCreateFees] = useToggle(false);
  return (
    <Create title="Étudiants" resource="students" transform={createStudentApi}>
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton alwaysEnable />
          </Toolbar>
        }
      >
        <TextInput source="ref" label="Référence" fullWidth required />
        <TextInput source="first_name" label="Prénoms" fullWidth required />
        <TextInput source="last_name" label="Nom" fullWidth required />
        <SexRadioButton />
        <TextInput source="phone" label="Téléphone" fullWidth />
        <CreateGeoLocalisation />
        <SelectSpecialization ignoreRole={true} />
        <TextInput
          source="nic"
          label="Numéro CIN"
          fullWidth
          validate={maxLength(
            12,
            "Le numéro CIN ne doit pas dépasser 12 caractères."
          )}
        />
        <TextInput source="birth_place" label="Lieu de naissance" fullWidth />
        <DateInput source="birth_date" label="Date de naissance" fullWidth />
        <TextInput
          source="address"
          label="Adresse"
          fullWidth
          multiline
          data-testid="addressInput"
        />
        <TextInput source="email" label="Email" fullWidth required />
        <DateInput
          source="entrance_datetime"
          label="Date d'entrée chez HEI"
          fullWidth
          required
        />
        <TextInput
          source="high_school_origin"
          label="Lycée de provenance"
          fullWidth
        />
        <BooleanInput
          label="Activer la création des frais"
          name="canCreateFees"
          source="canCreateFees"
          defaultValue={false}
          onChange={toggleCanCreateFees}
        />
        {canCreateFees && <FeeInputs />}
      </SimpleForm>
    </Create>
  );
};
export default StudentCreate;
