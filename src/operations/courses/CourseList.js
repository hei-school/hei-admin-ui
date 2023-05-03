import { List } from '@react-admin/ra-rbac'
import { Datagrid, TextField, FunctionField, TopToolbar, CreateButton, EditButton, ShowButton } from 'react-admin'
import { prettyPrintMoney, CustomDateField, pageSize, PrevNextPagination } from '../utils'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { coursesFilters } from '.'

const Actions = ({ basePath, resource }) => (
  <TopToolbar disableGutters>
    <CreateButton to={basePath + '/create'} resource={resource} />
  </TopToolbar>
)

const CourseList = ({ userId }) => {
  const role = authProvider.getCachedRole()
  return (
    <List
      title='Liste des cours'
      resource={'courses'}
      hasCreate={role === WhoamiRoleEnum.Manager}
      filters={coursesFilters}
      //actions={(role === WhoamiRoleEnum.Manager || role === WhoamiRoleEnum.Teacher) && <Actions basePath={`/courses`} />}
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
        {role !== WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default CourseList
