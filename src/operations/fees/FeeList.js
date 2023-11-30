import {  useEffect } from 'react'
import { List } from '@react-admin/ra-rbac'
import { TopToolbar, CreateButton } from 'react-admin'
import { maxPageSize } from '../../providers/dataProvider'
import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from 'haapi-Ts-client'
import { FeesListItems } from './utils'
import { useStudentRef } from '../../hooks/useStudentRef'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)

const FeeList = ({ studentId }) => {
  const studentRefContext = useStudentRef('studentId')
  const { studentRef, fetchRef } = studentRefContext
  const definedStudentId = studentId ? studentId : studentRefContext.studentId
  const role = authProvider.getCachedRole()

  useEffect(() => {
    fetchRef()
  }, [definedStudentId])

  return (
    <List
      title={`Frais de ${studentRef}`}
      resource={'fees'}
      label='Frais'
      actions={role === WhoamiRoleEnum.MANAGER && <Actions basePath={`/students/${definedStudentId}/fees`} />}
      filterDefaultValues={{ studentId: definedStudentId }}
      pagination={false}
      perPage={maxPageSize}
    >
      <FeesListItems />
    </List>
  )
}

export default FeeList
