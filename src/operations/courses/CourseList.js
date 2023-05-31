import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, FunctionField, TopToolbar, CreateButton, EditButton, ShowButton, FilterButton } from 'react-admin'
import { pageSize, PrevNextPagination } from '../utils'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { coursesFilters } from '.'
import { useEffect, useState } from 'react'

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
        <TextField source='total_hours' label='Heure total' />
        {role === WhoamiRoleEnum.Manager && false && (
          <FunctionField label="Référence de l'enseignant" render={record => record.main_teacher.ref} textAlign='right' />
        )}
        {role === WhoamiRoleEnum.Manager && false && (
          <FunctionField
            label="Nom de l'enseignant"
            render={record => record.main_teacher.last_name + ' ' + record.main_teacher.first_name}
            textAlign='right'
          />
        )}
        <TextField source='credits' label='Coefficient' />
        {role === WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default CourseList
