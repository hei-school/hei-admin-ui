import { useEffect } from 'react'
import { WhoamiRoleEnum } from '@haapi/typescript-client'
import { FunctionField, ShowButton } from 'react-admin'
import { WarningOutlined } from '@mui/icons-material'
import { useStudentRef } from '../../hooks/useStudentRef'
import { HaList } from '../../ui/haList/HaList'
import { CreateButton } from '../../ui/haToolbar'
import { commentFunctionRenderer, CustomDateField, prettyPrintMoney } from '../utils'
import { rowStyle } from './utils'
import authProvider from '../../providers/authProvider'

const FeeList = ({ studentId }) => {
  const studentRefContext = useStudentRef('studentId')
  const { studentRef, fetchRef } = studentRefContext
  const definedStudentId = studentId ? studentId : studentRefContext.studentId
  const role = authProvider.getCachedRole()

  useEffect(() => {
    fetchRef()
  }, [definedStudentId])

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={'fees'}
      actions={role === WhoamiRoleEnum.MANAGER && <CreateButton resource={`students/${definedStudentId}/fees`} />}
      filterIndicator={false}
      listProps={{
        filterDefaultValues: { studentId: definedStudentId }
      }}
      datagridProps={{
        rowClick: id => `/fees/${id}/show`,
        rowStyle
      }}
    >
      <CustomDateField source='due_datetime' label='Date limite' showTime={false} />
      <FunctionField source='comment' render={commentFunctionRenderer} label='Commentaire' />
      <FunctionField label='Reste à payer' render={record => prettyPrintMoney(record.remaining_amount)} textAlign='right' />
      <CustomDateField source='creation_datetime' label='Date de création' showTime={false} />
      <ShowButton basePath='/fees' />
    </HaList>
  )
}

export default FeeList
