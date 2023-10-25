import { styled } from '@mui/styles'
import { palette } from '../../../constants'
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material'
import UserInfo from './UserInfo'
import { AccountCircleOutlined } from '@mui/icons-material'
import { HaMenuContent } from '../HaMenuContent'
import { SingleMenu } from './SingleMenu'
import { useSidebarState } from 'react-admin'

const Separator = styled('div')({
  backgroundColor: 'rgba(255,255,255,.2)',
  height: 1,
  display: 'block',
  width: '300%',
  transform: 'translateX(-50%)'
})

export function HaMenuBase({ sx = {} }) {
  const [open] = useSidebarState()

  const haMenuStyled = {
    width: '250px',
    height: '100%',
    boxSizing: 'border-box',
    paddingLeft: '20px',
    transition: 'all .3s linear',
    overflowX: 'hidden',
    bgcolor: palette.black,
    color: palette.white,
    top: 0
  }

  return (
    <Box sx={{ ...haMenuStyled, left: open ? 0 : '-250px', ...sx }} component='div' id='ha-menu'>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', py: 2.5, gap: 2 }}>
        <img src='/menu-logo.png' style={{ width: 40, height: 27 }} />
        <Typography variant='h1' sx={{ fontSize: '1.1em', color: palette.white, fontWeight: 400 }}>
          HEI Admin
        </Typography>
      </Box>
      <Separator />
      <UserInfo />
      <Separator />
      <SingleMenu label='Profile' to='/profile' icon={<AccountCircleOutlined />} sx={{ mt: 3 }} />
      <HaMenuContent />
    </Box>
  )
}

export function HaMenu() {
  const isSmall = useMediaQuery('(max-width:920px)')
  const [open, setOpen] = useSidebarState()

  return isSmall ? (
    <Drawer anchor='left' open={open} onClose={() => setOpen(false)}>
      <HaMenuBase />
    </Drawer>
  ) : (
    <HaMenuBase sx={{ position: 'fixed' }} />
  )
}
