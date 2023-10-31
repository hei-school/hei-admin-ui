import { useState } from 'react'
import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useRecordContext } from 'react-admin'
import { GroupFlowMoveTypeEnum } from '../../gen/haClient'
import GroupFlowCreate from './GroupFlowCreate'

const MoveButton = ({ moveType, create }) => {
  const [isOpen, setIsOpen] = useState(false)
  const record = useRecordContext()

  const studentId = record.id
  const join = moveType === GroupFlowMoveTypeEnum.Join
  const label = join ? 'Créer' : 'Migrer'

  const handleClick = event => {
    setIsOpen(true)
  }
  const handleClose = () => setIsOpen(false)

  return (
    <div>
      <Button onClick={handleClick} color='primary' size='small' startIcon={join && <Add />}>
        {label}
      </Button>
      <GroupFlowCreate create={create} open={isOpen} handleClose={handleClose} moveType={moveType} studentId={studentId || undefined} setIsOpen={setIsOpen} />
    </div>
  )
}

export default MoveButton
