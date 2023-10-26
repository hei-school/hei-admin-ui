import { Button } from '@mui/material'
import { useState } from 'react'
import GroupFlowCreate from './GroupFlowCreate'
import { GroupFlowMoveTypeEnum } from '../../gen/haClient'
import { useRecordContext } from 'react-admin'
import { Add } from '@mui/icons-material'

const MoveButton = ({ moveType, migrate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const record = useRecordContext()
  const studentId = record.id
  const handleClick = event => {
    setIsOpen(true)
  }
  const handleClose = () => setIsOpen(false)
  const join = moveType == GroupFlowMoveTypeEnum.Join
  const label = join ? 'Créer' : 'Migrer'

  return (
    <div>
      <Button onClick={handleClick} color='primary' size='small' startIcon={join && <Add />}>
        {label}
      </Button>
      <GroupFlowCreate migrate={migrate} open={isOpen} handleClose={handleClose} moveType={moveType} studentId={studentId || undefined} setIsOpen={setIsOpen} />
    </div>
  )
}

export default MoveButton
