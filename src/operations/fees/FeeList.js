// eslint-disable-next-line
import { useEffect, useState } from 'react'

import { CreateButton, TopToolbar, useDataProvider } from 'react-admin'
import { useParams } from 'react-router-dom'

import { List } from '@react-admin/ra-rbac'

import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { maxPageSize } from '../utils'
import { FeesListItems } from './utils'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={`${basePath}/create`} resource={resource} />
  </TopToolbar>
)

const FeeList = ({ studentId }) => {
  const params = useParams()
  const dataProvider = useDataProvider()

  const [studentRef, setStudentRef] = useState('...')

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: definedStudentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  }, [definedStudentId])

  const definedStudentId = studentId ?? params.studentId
  const role = authProvider.getCachedRole()
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
      <FeesListItems />
    </List>
  )
}

export default FeeList
