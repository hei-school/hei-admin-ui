import { Datagrid, List, ShowButton, TextField, useGetRecordId, useRecordContext, useRedirect } from 'react-admin'
import { CustomDateField, PrevNextPagination } from '../utils'

const DocsList = ({ title, resource }) => {
  return (
    <List title={title} resource={resource} pagination={<PrevNextPagination />}>
      <Datagrid bulkActionButtons={false} rowClick={id => `/${resource}/${id}/show`}>
        <TextField source='fileName' label='Nom du fichier' />
        <CustomDateField source='createdAt' label='Date de création' />
        <ShowButton />
      </Datagrid>
    </List>
  )
}
export default DocsList
