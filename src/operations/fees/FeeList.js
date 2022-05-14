import { useState, useEffect } from 'react'

import { List, Datagrid, TextField, DateField, FunctionField, ShowButton, useDataProvider } from 'react-admin'

import { mainTheme } from '../../haTheme'
import { prettyPrintMoney } from '../utils/money'
import PermittedListActions from '../utils/PermittedListActions'

import { maxPageSize } from '../../providers/dataProvider'

const FeeList = ({ studentId, ...props }) => {
  const rowStyle = (record, _index) => {
    const lateColor = record.status === 'LATE' ? mainTheme.palette.error.light : 'inherit'
    return {
      backgroundColor: record.status === 'PAID' ? mainTheme.palette.grey[300] : lateColor
    }
  }

  const definedStudentId = studentId ? studentId : props.match.params.studentId
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
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
      {...props}
      title={`Frais de ${studentRef}`}
      resource='fees'
      basePath={`/students/${definedStudentId}/fees`}
      label='Frais'
      filterDefaultValues={{ studentId: definedStudentId }}
      actions={<PermittedListActions />}
      bulkActionButtons={false}
      pagination={false}
      perPage={maxPageSize}
    >
      <Datagrid rowClick={id => `/fees/${id}/show`} rowStyle={rowStyle}>
        <DateField source='due_datetime' label='Date limite' />
        <TextField source='comment' label='Commentaire' />
        <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
        <DateField source='creation_datetime' label='Date de création' />
        <ShowButton basePath='/fees' />
      </Datagrid>
    </List>
  )
}

export default FeeList
