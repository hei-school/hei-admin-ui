import { Datagrid, EditButton, List, ShowButton, TextField } from 'react-admin'
import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'
import { useParams } from 'react-router-dom'

const TranscriptList = () => {
  const { studentId } = useParams()
  return (
    <List
      filters={profileFilters}
      pagination={<PrevNextPagination />}
      perPage={pageSize}
      resource={'transcripts'}
      filterDefaultValues={{ studentId: studentId }}
      title={'Relevés de notes'}
    >
      <Datagrid bulkActionButtons={false} rowClick={id => `/students/${studentId}/transcripts/${id}/show`}>
        <TextField source='semester' label='Semestre' />
        <TextField source='academic_year' label='Année académique' />
        <TextField source='creation_datetime' label='Date de création' />
        <ShowButton />
      </Datagrid>
    </List>
  )
}

export default TranscriptList
