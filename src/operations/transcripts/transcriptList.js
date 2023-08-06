import { Datagrid, EditButton, List, ShowButton, TextField } from 'react-admin'
import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'
import { useParams } from 'react-router-dom'

const TranscriptList = () => {

  const params = useParams()
  const studentId = params.studentId
  return (
  <List filters={profileFilters} pagination={<PrevNextPagination />} perPage={pageSize} resource={'transcripts'} filterDefaultValues={{ studentId: studentId }}>
    <Datagrid bulkActionButtons={false} rowClick='show'>
      <TextField source='semester' label='Semestre' />
      <TextField source='academic_year' label='Année académique' />
      <TextField source='creation_datetime' label='Date de création' />
      <EditButton />
    </Datagrid>
  </List>
)}

export default TranscriptList