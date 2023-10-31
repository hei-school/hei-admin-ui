import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Button, useGetList, useNotify, useRecordContext } from 'react-admin'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { GroupFlowMoveTypeEnum } from '../../gen/haClient'
import groupFlowProvider from '../../providers/groupFlowProvider'
import { CustomAutoComplete } from '../utils/CustomAutoComplete'

const GroupFlowCreate = ({ moveType, create, handleClose, open, setIsOpen }) => {
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
    create: create
  })
  const { control, handleSubmit } = useForm({
    defaultValues: {
      student: { id: '', ref: '' },
      group: { id: '', ref: '' }
    }
  })

  const actualGroupId = params.id
  const studentId = record.id

  let students = getStudents.data
  let groups = getGroups.data

  if (students && groups) {
    !create && (students = students.filter(student => student.id === studentId))
    groups = groups.filter(group => (create ? group.id === actualGroupId : group.id !== actualGroupId))
  }

  const notification = (message, type) => notify(message, { type: type, autoHideDuration: 1000 })

  const onSubmit = async data => {
    payload.studentId = create ? data.student.id : studentId
    payload.groupId = data.group.id
    !create && (payload.leftGroupId = actualGroupId)

    const studentRef = students ? students.find(student => student.id === payload.studentId).ref : ''

    await groupFlowProvider
      .saveOrUpdate(payload)
      .then(() => notification(`L'étudiant ${studentRef} a été migré avec succès`, 'success'))
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
            <CustomAutoComplete
              control={control}
              name='student'
              data={students}
              label="Référence de l'étudiant"
              fullWidth
              data-testid='students-autocomplete'
            />
          )}
          <CustomAutoComplete control={control} name='group' data={groups} label='Référence du groupe' fullWidth data-testid='groups-autocomplete' />
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
