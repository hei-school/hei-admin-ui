import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { List } from '@react-admin/ra-rbac'
import { useDataProvider, TopToolbar, CreateButton } from 'react-admin'

import { maxPageSize } from '../../providers/dataProvider'
import authProvider from '../../providers/authProvider'

import { WhoamiRoleEnum } from '../../gen/haClient'
import { FeesListItems } from './utils'
import { TitledPage } from '../utils'

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
      resource={'fees'}
      label='Frais'
      actions={role === WhoamiRoleEnum.Manager && <Actions basePath={`/students/${definedStudentId}/fees`} />}
      filterDefaultValues={{ studentId: definedStudentId }}
      pagination={false}
      perPage={maxPageSize}
    >
      <TitledPage title={`Frais de ${studentRef}`}>
        <FeesListItems />
      </TitledPage>
    </List>
  )
}

export default FeeList
