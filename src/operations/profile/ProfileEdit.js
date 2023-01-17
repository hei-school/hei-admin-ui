import { SimpleForm, TextInput, DateInput, RadioButtonGroupInput, Edit } from 'react-admin'
import EditToolbar from '../utils/EditToolBar'
import SexRadioButton from '../utils/SexRadioButton'
import { EnableStatus } from '../../gen/haClient'

const StatusRadioButton = () => (
  <RadioButtonGroupInput
    source='status'
    label='Statut'
    choices={[
      { id: EnableStatus.Enabled, name: 'Actif·ve' },
      { id: EnableStatus.Disabled, name: 'Inactif·ve' }
    ]}
  />
)

const ProfileEdit = () => (
  <Edit>
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source='ref' label='Référence' fullWidth={true} />
      <TextInput source='first_name' label='Prénom·s' fullWidth={true} />
      <TextInput source='last_name' label='Nom·s' fullWidth={true} />
      <TextInput source='email' fullWidth={true} />
      <TextInput multiline source='address' label='Adresse' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
      <StatusRadioButton />
    </SimpleForm>
  </Edit>
)

export default ProfileEdit
