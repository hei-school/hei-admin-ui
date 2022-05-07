import { useState, useEffect } from 'react'

import { List, Datagrid, TextField, DateField, FunctionField, ShowButton, useDataProvider } from 'react-admin'
import { useListContext, usePermissions, TopToolbar, CreateButton, ExportButton } from 'react-admin'

import { mainTheme } from '../../haTheme'
import { prettyPrintMoney } from '../utils/money'

const ListActions = props => {
  const { total, isLoading } = useListContext()
  const { permissions } = usePermissions()
  return (
    <TopToolbar>
      {permissions === 'MANAGER' && <CreateButton />}
      <ExportButton {...props} disabled={isLoading || total === 0} />
    </TopToolbar>
  )
}

const FeeList = ({ studentId, ...props }) => {
  const rowStyle = (record, _index) => {
    const lateColor = record.status === 'LATE' ? mainTheme.palette.error.light : 'inherit'
    return {
      backgroundColor: record.status === 'PAID' ? mainTheme.palette.grey[300] : lateColor
    }
  }

  const definedStudentId = studentId ? studentId : props.match.params.studentId
  const [studentRef, setStudentRef] = useState()
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: definedStudentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })

  return (
    <List
      {...props}
      title={`Frais de ${studentRef}`}
      resource='fees'
      basePath={`/students/${definedStudentId}/fees`}
      label='Frais'
      filterDefaultValues={{ studentId: definedStudentId }}
      actions={<ListActions />}
      bulkActionButtons={false}
      pagination={false}
    >
      <Datagrid rowClick='show' rowStyle={rowStyle}>
        <DateField source='due_datetime' label='Date limite' />
        <TextField source='comment' label='Commentaire' />
        <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
        <DateField source='creation_datetime' label='Date de création' />
        <ShowButton />
      </Datagrid>
    </List>
  )
}

export default FeeList
