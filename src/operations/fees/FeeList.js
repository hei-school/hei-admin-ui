import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { List } from '@react-admin/ra-rbac'
import { TextField, Datagrid, FunctionField, ShowButton, useDataProvider, TopToolbar, CreateButton } from 'react-admin'

import rowStyle from './byStatusRowStyle'
import { prettyPrintMoney, CustomDateField } from '../utils'

import { maxPageSize } from '../../providers/dataProvider'
import authProvider from '../../providers/authProvider'

import { WhoamiRoleEnum } from '../../gen/haClient'

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
      actions={role === WhoamiRoleEnum.Manager && <Actions basePath={`/students/${definedStudentId}/fees`} />}
      filterDefaultValues={{ studentId: definedStudentId }}
      pagination={false}
      perPage={maxPageSize}
    >
      <Datagrid bulkActionButtons={role === WhoamiRoleEnum.Manager} rowClick={id => `/fees/${id}/show`} rowStyle={rowStyle}>
        <CustomDateField source='due_datetime' label='Date limite' showTime={false} />
        <TextField source='comment' label='Commentaire' />
        <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
        <CustomDateField source='creation_datetime' label='Date de création' showTime={false} />
        <ShowButton basePath='/fees' />
      </Datagrid>
    </List>
  )
}

export default FeeList
