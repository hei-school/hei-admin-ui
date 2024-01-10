import { Datagrid, List, ShowButton, TextField } from 'react-admin'
import { CustomDateField, PrevNextPagination } from '../utils'
import { HaList } from '../../ui/haList'

const DocsList = ({ title, resource }) => {
  return (
    <HaList
      title={title}
      resource={resource}
      datagridProps={{
        rowClick: id => `/${resource}/${id}/show`
      }}
    >
      <TextField source='fileName' label='Nom du fichier' />
      <CustomDateField source='createdAt' label='Date de création' />
      <ShowButton />
    </HaList>
  )
}
export default DocsList
