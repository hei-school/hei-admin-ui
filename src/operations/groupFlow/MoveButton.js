import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useRecordContext } from 'react-admin'
import { GroupFlowMoveTypeEnum } from '../../gen/haClient'
import { useToggle } from '../../hooks/useToggle'
import GroupFlowCreate from './GroupFlowCreate'

const MoveButton = ({ moveType, canCreate }) => {
  const [isOpen, setIsOpen, toggle] = useToggle()
  const record = useRecordContext()

  const studentId = record.id
  const isJoinMoveType = moveType === GroupFlowMoveTypeEnum.Join
  const label = isJoinMoveType ? 'Créer' : 'Migrer'

  return (
    <div>
      <Button onClick={toggle} color='primary' size='small' startIcon={isJoinMoveType && <Add />}>
        {label}
      </Button>
      <GroupFlowCreate canCreate={canCreate} open={isOpen} handleClose={toggle} moveType={moveType} studentId={studentId || undefined} setIsOpen={setIsOpen} />
    </div>
  )
}

export default MoveButton
