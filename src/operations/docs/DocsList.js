import { Datagrid, List, ShowButton, TextField } from 'react-admin'
import { CustomDateField, PrevNextPagination } from '../utils';
const DocsList = () => {
  return (
    <List title='Documents' resource="docs" pagination={<PrevNextPagination />}>
      <Datagrid bulkActionButtons={false} rowClick="show" >
        <TextField source='fileName' label='Nom du fichier'/>
        <CustomDateField source='createdAt' label='Date de création' />
        <ShowButton />
      </Datagrid>
    </List>);
}
export default DocsList;
