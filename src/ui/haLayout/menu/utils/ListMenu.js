import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Collapse } from '@mui/material'
import { useState } from 'react'
import { palette } from '../../../constants'
import { SingleMenuBase } from './SingleMenu'

export function ListMenu({ children, label, icon, ...rest }) {
  const [showList, setShowList] = useState(false)

  return (
    <Box sx={{ width: '100%', color: palette.white }} component='div' {...rest}>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 2,
          mb: 2,
          width: '100%',
          ':hover': { color: palette.yellow }
        }}
        component='div'
        onClick={() => setShowList(!showList)}
      >
        <SingleMenuBase label={label} icon={icon} sx={{ mb: 0 }} />
        {showList ? <ArrowDropUp /> : <ArrowDropDown />}
      </Box>
      <Collapse in={showList} unmountOnExit sx={{ color: palette.white }}>
        {children}
      </Collapse>
    </Box>
  )
}
