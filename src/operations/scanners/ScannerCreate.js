import { SimpleForm, TextInput, DateInput } from 'react-admin'
import { SexRadioButton, TurnsStringIntoDate } from '../utils'
import { CustomCreate } from '../utils/CustomCreate'

const transformScanner = scanner => {
  scanner.entrance_datetime = TurnsStringIntoDate(scanner.entrance_datetime)
  return scanner
}

const ScannerCreate = () => (
  <CustomCreate title='Scanners' transform={transformScanner}>
    <SimpleForm>
      <TextInput source='ref' label ='Référence' fullWidth={true} />
      <TextInput source='first_name' label='Prénoms' fullWidth={true} />
      <TextInput source='last_name' label='Nom' fullWidth={true} />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth={true} />
      <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
      <TextInput multiline source='address' label='Adresse' fullWidth={true} />
      <TextInput source='email' label='Email' fullWidth={true} />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
    </SimpleForm>
  </CustomCreate>
)
export default ScannerCreate
