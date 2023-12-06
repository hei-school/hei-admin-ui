import { useEffect } from 'react'
import { WhoamiRoleEnum } from '@haapi/typescript-client'
import { FunctionField, ShowButton } from 'react-admin'
import { WarningOutlined } from '@mui/icons-material'
import { useStudentRef } from '../../hooks/useStudentRef'
import { HaList } from '../../ui/haList/HaList'
import { CreateButton, ImportButton } from '../../ui/haToolbar'
import { commentFunctionRenderer, CustomDateField, prettyPrintMoney } from '../utils'
import { rowStyle } from './utils'
import authProvider from '../../providers/authProvider'
import feeProvider from '../../providers/feeProvider'
import { minimalFeesHeaders, optionalFeesHeaders, valideFeesData } from './importConf'
import { transformStudentData } from '../students/importConf'

const FeeList = () => {
  const { studentRef, fetchRef, studentId } = useStudentRef ('studentId')
  const role = authProvider.getCachedRole()

  useEffect(() => {
    fetchRef()
  }, [studentId])

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={'fees'}
      actions={role === WhoamiRoleEnum.MANAGER &&  <FeesActions studentId={studentId} />}
      filterIndicator={false}
      listProps={{
        filterDefaultValues: { studentId }
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

function FeesActions({studentId}){
  return(
    <>
      <CreateButton resource={`students/${studentId}/fees`} />
      <ImportButton 
        resource='frais'
        provider={(data)=>feeProvider.saveOrUpdate(studentId, data)}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={transformStudentData}
      />
    </>
  )
}
