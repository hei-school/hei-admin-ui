import { styled } from '@mui/styles'

export function HaToolbar({ leftAction, rightAction }) {
  const ActionContainer = styled('div')({
    display: 'flex',
    alignItems:'center',
    gap: 10,
  })

  const ToolbarContainer = styled('div')({
    width: '100%',
    padding: '10px 5px !important',
    minHeight:'0',
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
  })

  return (
    <ToolbarContainer>
      <ActionContainer>
        { leftAction }
      </ActionContainer>
      <ActionContainer>
        { rightAction }
      </ActionContainer>
    </ToolbarContainer>
  )
}
