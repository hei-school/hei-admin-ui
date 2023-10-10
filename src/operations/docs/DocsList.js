import { Datagrid, List, ShowButton, TextField, useRedirect } from 'react-admin'
import { CustomDateField, PrevNextPagination } from '../utils'

const DocsList = ({ title, resource }) => {
  const redirect = useRedirect()
  const onShow = () => redirect('/hei-docs/1/show')
  return (
    <List title={title} resource={resource} pagination={<PrevNextPagination />}>
      <Datagrid bulkActionButtons={false} rowClick={onShow}>
        <TextField source='fileName' label='Nom du fichier' />
        <CustomDateField source='createdAt' label='Date de création' />
        <ShowButton />
      </Datagrid>
    </List>
  )
}
export default DocsList
