import { Delete } from '@mui/icons-material'
import { Button, Confirm, Datagrid, ExportButton, List, TextField, TopToolbar, useNotify, useRecordContext } from 'react-admin'
import { useParams } from 'react-router-dom'
import { GroupFlowMoveTypeEnum, WhoamiRoleEnum } from '../../gen/haClient'
import { useToggle } from '../../hooks/useToggle'
import { pageSize, PrevNextPagination } from '../utils'
import authProvider from '../../providers/authProvider'
import groupFlowProvider from '../../providers/groupFlowProvider'
import MoveButton from '../groupFlow/MoveButton'

const DeleteGroupStudent = ({ groupId }) => {
  const notify = useNotify()
  const student = useRecordContext()
  const [isOpen, _setIsOpen, toggle] = useToggle()
  const payload = {
    studentId: student.id,
    groupId: groupId,
    MoveType: GroupFlowMoveTypeEnum.Leave,
    migrate: false
  }

  // TODO: use custom hooks
  const notification = (message, type) => notify(message, { type: type, autoHideDuration: 1000 })

  const addGroupFlow = async () => {
    toggle()
    await groupFlowProvider
      .saveOrUpdate(payload)
      .then(() => notification(`Etudiant ${student.ref} supprimé de ce groupe avec succès`, 'success'))
      .catch(() => notification(`Etudiant ${student.ref} n'a pas pu être supprimé de ce groupe`, 'error'))
  }
  return (
    <div>
      <Button onClick={toggle} startIcon={<Delete />} label='Supprimer' color='error' />
      <Confirm
        isOpen={isOpen}
        title={`Supprimer l'étudiant ${student && student.id}`}
        content='Êtes-vous sûr de vouloir supprimer cet étudiant de ce groupe?'
        onConfirm={addGroupFlow}
        onClose={toggle}
      />
    </div>
  )
}

const GroupStudentList = () => {
  const params = useParams()
  const role = authProvider.getCachedRole()

  const isManager = role === WhoamiRoleEnum.Manager
  const groupId = params.id

  const ListActions = () => (
    <TopToolbar>
      {isManager && <MoveButton moveType={GroupFlowMoveTypeEnum.Join} canCreate />}
      <ExportButton />
    </TopToolbar>
  )

  return (
    <List
      label='Étudiants'
      actions={<ListActions />}
      hasCreate={isManager}
      title=' '
      empty
      perPage={pageSize}
      pagination={<PrevNextPagination />}
      resource='group-students'
      queryOptions={{ meta: { groupId } }}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        {isManager && (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <MoveButton moveType={GroupFlowMoveTypeEnum.Leave} canCreate={false} />
            <DeleteGroupStudent groupId={groupId} />
          </div>
        )}
      </Datagrid>
    </List>
  )
}

export default GroupStudentList
