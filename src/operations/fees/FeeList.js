import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { List } from '@react-admin/ra-rbac'
import { TextField, Datagrid, DateField, FunctionField, ShowButton, useDataProvider, TopToolbar, CreateButton } from 'react-admin'

import rowStyle from './byStatusRowStyle'
import { prettyPrintMoney } from '../utils/money'

import { maxPageSize } from '../../providers/dataProvider'
import authProvider from '../../providers/authProvider'
import { CustomDateField } from './ByStatusFeeList'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)

const FeeList = ({ studentId }) => {
  const params = useParams()
  const definedStudentId = studentId ? studentId : params.studentId
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  const role = authProvider.getCachedRole()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: definedStudentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
    // eslint-disable-next-line
  }, [definedStudentId])

  return (
    <List
      title={`Frais de ${studentRef}`}
      resource={'fees'}
      label='Frais'
      actions={<Actions basePath={`/students/${definedStudentId}/fees`} />}
      filterDefaultValues={{ studentId: definedStudentId }}
      pagination={false}
      perPage={maxPageSize}
    >
      <Datagrid rowClick={id => `/fees/${id}/show`} rowStyle={rowStyle}>
        <CustomDateField label='Date limite' source='due_datetime' />
        <TextField source='comment' label='Commentaire' />
        <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
        <CustomDateField label='Date de création' source='creation_datetime' />
        <ShowButton basePath='/fees' />
      </Datagrid>
    </List>
  )
}

export default FeeList
