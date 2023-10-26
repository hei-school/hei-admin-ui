import { useState } from 'react'
import { Delete } from '@mui/icons-material'
import {
  Button,
  Confirm,
  Datagrid,
  ExportButton,
  List,
  TextField,
  TopToolbar,
  useNotify,
  useRecordContext
} from 'react-admin'
import { useParams } from 'react-router-dom'
import { GroupFlowMoveTypeEnum, WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import groupFlowProvider from '../../providers/groupFlowProvider'
import MoveButton from '../groupFlow/MoveButton'
import { pageSize, PrevNextPagination } from '../utils'

const DeleteButton = ({ groupId }) => {
  const notify = useNotify()
  const notification = (message, type) => notify(message, { type: type, autoHideDuration: 1000 })
  const student = useRecordContext()
  const [open, setOpen] = useState(false)
  const payload = {
    studentId: student.id,
    groupId: groupId,
    MoveType: GroupFlowMoveTypeEnum.Leave,
    migrate: false
  }
  const handleConfirm = async () => {
    setOpen(false)
    await groupFlowProvider
      .saveOrUpdate(payload)
      .then(() => notification(`Etudiant ${student.ref} supprimé de ce groupe avec succès`, 'success'))
      .catch(() => notification(`Etudiant ${student.ref} n'a pas pu être supprimé de ce groupe`, 'error'))
  }
  return (
    <div>
      <Button onClick={() => setOpen(true)} startIcon={<Delete />} label='Supprimer' color='error' />
      <Confirm
        isOpen={open}
        title={`Supprimer l'étudiant ${student && student.id}`}
        content='Êtes-vous sûr de vouloir supprimer cet étudiant de ce groupe?'
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

const GroupStudentList = () => {
  const params = useParams()

  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager
  const groupId = params.id

  const { Join, Leave } = GroupFlowMoveTypeEnum

  const ListActions = () => (
    <TopToolbar>
      <MoveButton moveType={Join} create />
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
      <Datagrid bulkActionButtons={false} >
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        <MoveButton moveType={Leave} create={false} />
        <DeleteButton groupId={groupId} />
      </Datagrid>
    </List>
  )
}

export default GroupStudentList
