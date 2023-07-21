import { useEffect, useState } from 'react'

import { CreateButton, Datagrid, EditButton, FilterButton, FunctionField, ShowButton, TextField, TopToolbar } from 'react-admin'

import { List } from '@react-admin/ra-rbac'

import { coursesFilters } from '.'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { pageSize, PrevNextPagination } from '../utils'

const CourseList = ({ userId }) => {
  const [role, setRole] = useState(authProvider.getCachedRole())

  const getRole = () => {
    setRole(authProvider.getCachedRole())
  }

  const ListActions = () => (
    <TopToolbar>
      <FilterButton />
      {role === WhoamiRoleEnum.Manager && <CreateButton />}
    </TopToolbar>
  )

  useEffect(getRole, [role])

  return (
    <List
      title='Liste des cours'
      resource={'courses'}
      hasCreate={role === WhoamiRoleEnum.Manager}
      filters={coursesFilters}
      actions={<ListActions />}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
    >
      <Datagrid bulkActionButtons={false} rowClick='show'>
        <TextField source='code' label='Code' />
        <TextField source='name' label='Nom' />
        <TextField source='total_hours' label="Total d'heures" />
        <TextField source='credits' label='Coefficient' />
        {role === WhoamiRoleEnum.Manager && (
          <FunctionField label='Enseignant' render={record => `${record.main_teacher.ref} ${record.main_teacher.first_name}`} />
        )}
        {role === WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default CourseList
