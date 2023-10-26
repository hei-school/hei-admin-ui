import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Button, useGetList, useNotify, useRecordContext } from 'react-admin'
import { useForm } from 'react-hook-form'
import groupFlowProvider from '../../providers/groupFlowProvider'
import { useState } from 'react'
import { CustomAutoComplete } from '../utils/CustomAutoComplete'
import { GroupFlowMoveTypeEnum } from '../../gen/haClient'
import { useParams } from 'react-router-dom'

const GroupFlowCreate = ({ moveType, migrate, handleClose, open, setIsOpen }) => {
  const notify = useNotify()
  const params = useParams()
  const getStudents = useGetList('students')
  const record = useRecordContext()
  const getGroups = useGetList('groups')
  const [payload, _setPayload] = useState({
    MoveType: moveType,
    studentId: '',
    groupId: '',
    leftGroupId: '',
    migrate: migrate
  })
  const { control, handleSubmit } = useForm({
    defaultValues: {
      student: { id: '', ref: '' },
      group: { id: '', ref: '' }
    }
  })

  const leftGroupId = params.id
  const studentId = record.id
  const students = getStudents.data

  const groups = getGroups.data

  const notification = (message, type) => notify(message, { type: type, autoHideDuration: 1000 })

  const onSubmit = async data => {
    payload.studentId = studentId ? studentId : data.student.id
    payload.groupId = data.group.id
    payload.leftGroupId = leftGroupId

    await groupFlowProvider
      .saveOrUpdate(payload)
      .then(() => notification(`L'étudiant ${data.student.ref} a été migré avec succès`, 'success'))
      .then(() => setIsOpen(false))
      .catch(() => notification("Une erreur s'est produite.", 'error'))
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
            <CustomAutoComplete control={control} name='student' data={students} label="Référence de l'étudiant" fullWidth />
          )}
          <CustomAutoComplete control={control} name='group' data={groups} label='Référence du groupe' fullWidth />
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
