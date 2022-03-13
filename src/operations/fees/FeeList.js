import { useState, useEffect } from 'react'

import { List, Datagrid, TextField, DateField, FunctionField, ShowButton, useDataProvider } from 'react-admin'
import { mainTheme } from '../../haTheme'
import { prettyPrintMoney } from '../utils/money'

const FeeList = props => {
  const rowStyle = (record, index) => ({
    backgroundColor: record.status === 'PAID' ? mainTheme.palette.grey[300] : record.status === 'LATE' ? mainTheme.palette.error.light : 'inherit'
  })

  const studentId = props.match.params.studentId
  const [studentRef, setStudentRef] = useState()
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })

  return (
    <List
      {...props}
      title={`Frais de ${studentRef}`}
      resource='fees'
      basePath={`/students/${studentId}/fees`}
      label='Frais'
      filterDefaultValues={{ studentId: studentId }}
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
