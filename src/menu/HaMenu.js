import authProvider from '../providers/authProvider'
import StudentMenu from './StudentMenu'
import ManagerMenu from './ManagerMenu'
import TeacherMenu from './TeacherMenu'
import { WhoamiRoleEnum } from '../gen/haClient'
import { Box, Stack, IconButton, Avatar, Typography } from '@mui/material'
import { MultiLevelMenu as RaMenu, MenuItemCategory as Item } from '@react-admin/ra-navigation'
import { LogoutOutlined } from '@mui/icons-material'
import { Color } from '../utils/color'

const Logout = () => {
  const doLogout = async () => {
    await authProvider.logout()
    window.location.reload()
  }

  return (
    <IconButton
      onClick={doLogout}
      size='small'
      title='Se déconnecter'
      sx={{
        borderRadius: '4px',
        color: Color['500'],
        bgcolor: Color['100'],
        '&:hover': { bgcolor: Color['100'] }
      }}
    >
      <LogoutOutlined />
    </IconButton>
  )
}

const HaMenuHeader = () => (
  <Stack direction='row' alignItems='center' gap={1.5}>
    <Avatar variant='rounded' sx={{ bgcolor: Color['500'] }} />
    <Typography component='b' flex={1}>
      HEI Admin
    </Typography>
    <Logout />
  </Stack>
)

export const HaMenuListContainer = ({ children }) => (
  <RaMenu
    sx={{
      '& .RaMultiLevelMenu-list': {
        gap: '0.5rem'
      },
      '& .RaMenuItemCategory-container': {
        padding: '0 !important',
        bgcolor: 'transparent',
        '& span': {
          fontWeight: '500',
          fontSize: '14px'
        }
      },
      '& .RaMenuItemCategory-link': {
        flexDirection: 'row !important',
        gap: '1rem',
        p: '8px',
        borderRadius: '6px',
        width: '100%',
        '&.active, &:hover': {
          bgcolor: Color['100'],
          color: Color['500']
        }
      }
    }}
  >
    {children}
  </RaMenu>
)

const HaMenuWrapper = ({ children }) => (
  <Box
    sx={{
      height: '100vh',
      borderRadius: '8px',
      justifyContent: 'space-between',
      flexDirection: 'column',
      display: 'flex',
      width: '300px',
      flex: '1',
      p: 1
    }}
  >
    <Stack sx={{ height: '100%', p: 1.5, border: '1px solid #f7f7f7', borderRadius: 2, gap: 2, bgcolor: 'white' }}>
      <HaMenuHeader />
      {children}
    </Stack>
  </Box>
)

const Menu = ({ role }) => {
  switch (role) {
    case WhoamiRoleEnum.Student:
      return <StudentMenu />
    case WhoamiRoleEnum.Manager:
      return <ManagerMenu />
    case WhoamiRoleEnum.Teacher:
      return <TeacherMenu />
    default:
      throw new Error('Unexpected role ' + role)
  }
}

const HaMenu = () => (
  <HaMenuWrapper>
    <Box>
      <Menu role={authProvider.getCachedWhoami().role} />
    </Box>
  </HaMenuWrapper>
)

export default HaMenu
