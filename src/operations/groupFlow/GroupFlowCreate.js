import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Button, useGetList, useNotify, useRecordContext } from 'react-admin'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { GroupFlowMoveTypeEnum } from '../../gen/haClient'
import { CustomAutoComplete } from '../utils/CustomAutoComplete'
import groupFlowProvider from '../../providers/groupFlowProvider'

const GroupFlowCreate = ({ moveType, canCreate, handleClose, open, setIsOpen }) => {
  const notify = useNotify()
  const params = useParams()
  const queryStudents = useGetList('students')
  const record = useRecordContext()
  const queryGroups = useGetList('groups')
  const { control, handleSubmit } = useForm({
    defaultValues: {
      student: { id: '', ref: '' },
      group: { id: '', ref: '' }
    }
  })

  const actualGroupId = params.id
  const studentId = record.id

  let students = queryStudents.data
  let groups = queryGroups.data

  if (students && groups) {
    !canCreate && (students = students.filter(student => student.id === studentId))
    groups = groups.filter(group => (canCreate ? group.id === actualGroupId : group.id !== actualGroupId))
  }
  // TODO: use custom hooks
  const notification = (message, type) => notify(message, { type: type, autoHideDuration: 1000 })

  const onSubmit = async data => {
    const payload = {
      MoveType: moveType,
      studentId: canCreate ? data.student.id : studentId,
      groupId: data.group.id,
      leftGroupId: canCreate ? '' : actualGroupId,
      canCreate: canCreate
    }

    const studentRef = students ? students.find(student => student.id === payload.studentId).ref : ''

    await groupFlowProvider
      .saveOrUpdate(payload)
      .then(() => notification(`L'étudiant ${studentRef} a été migré avec succès`, 'success'))
      .catch(() => notification("Une erreur s'est produite.", 'error'))
      .finally(() => setIsOpen(false))
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Migrer un étudiant</DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            gridTemplateColumns: "repeat('2fr')",
            width: '300px'
          }}
        >
          {moveType === GroupFlowMoveTypeEnum.Join && (
            <CustomAutoComplete
              control={control}
              name='student'
              data={students}
              label="Référence de l'étudiant"
              data-testid='students-autocomplete'
              fullWidth
            />
          )}
          <CustomAutoComplete control={control} name='group' data={groups} label='Référence du groupe' data-testid='groups-autocomplete' fullWidth />
        </DialogContent>
        <DialogActions>
          <Button type='submit' sx={{ margin: 'auto' }} size='medium' variant='contained' color='primary'>
            Envoyer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default GroupFlowCreate
