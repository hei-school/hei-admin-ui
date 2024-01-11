import { EditButton, EmailField, FunctionField, ImageField, ImageInput, Show, SimpleForm, SimpleShowLayout, TextField, TopToolbar } from 'react-admin'

import { PhotoCamera } from '@mui/icons-material'
import { EnableStatus, Sex } from '@haapi/typescript-client'
import { Badge, Card, Dialog, DialogTitle, Grid, IconButton, Link, Typography, CardHeader, useMediaQuery } from '@mui/material'

import { useToggle } from '../../hooks'
import { PALETTE_COLORS } from '../../ui/constants'
import { CustomCreate } from '../utils/CustomCreate'
import { CustomDateField, unexpectedValue } from '../utils'
import authProvider from '../../providers/authProvider'

const EMPTY_TEXT = 'Non défini.e'

const COMMON_GRID_ATTRIBUTES = { gridTemplateRows: '2fr 1fr', direction: 'column', item: true }

const renderSex = ({ sex }) => {
  switch (sex) {
    case Sex.M:
      return 'Homme'
    case Sex.F:
      return 'Femme'
    case null:
      return EMPTY_TEXT
    default:
      return unexpectedValue
  }
}

const renderStatus = ({ status }) => {
  if (status === EnableStatus.ENABLED) return 'Actif·ve'
  if (status === EnableStatus.SUSPENDED) return 'Suspendu·e'
  if (status === EnableStatus.DISABLED) return 'Quitté.e'
  return unexpectedValue
}

const CardContainer = ({ children, style }) => {
  return (
    <Card sx={style}>
      <SimpleShowLayout sx={{ padding: 0 }}>{children}</SimpleShowLayout>
    </Card>
  )
}

const UploadPictureButton = () => {
  const [isOpen, , toggle] = useToggle()

  const id = authProvider?.getCachedWhoami()?.id

  return (
    <>
      <IconButton
        onClick={() => toggle()}
        sx={{ borderRadius: '50%', transform: 'translate(-15px, -15px)', bgcolor: PALETTE_COLORS.primary, height: 20, width: 20 }}
      >
        <PhotoCamera sx={{ height: 15, width: 15, color: PALETTE_COLORS.white }} />
      </IconButton>
      <Dialog open={isOpen} onClose={() => toggle()}>
        <DialogTitle color={PALETTE_COLORS.yellow} fontWeight='bold'>
          Modifier la photo de profil
        </DialogTitle>
        <CustomCreate title=' ' resource='profile-picture' transform={data => ({ rawFile: data?.profile_picture?.rawFile, id })}>
          <SimpleForm>
            <ImageInput source='profile_picture' label=' ' accept='image/png'>
              <ImageField source='src' title='title' />
            </ImageInput>
          </SimpleForm>
        </CustomCreate>
      </Dialog>
    </>
  )
}

const ProfileCardAvatar = () => (
  <>
    <Badge
      variant='contained'
      badgeContent={<UploadPictureButton />}
      sx={{ bgcolor: 'transparent' }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <FunctionField
        label=' '
        render={user => (
          <img
            src={user?.profile_picture ? user.profile_picture : './blank-profile-photo.png'}
            style={{ objectFit: 'cover', height: 80, width: 80, border: '1px solid #e0e0e0', borderRadius: '50%' }}
            alt='your profile picture'
          />
        )}
      />
    </Badge>
  </>
)

const Title = ({ children }) => (
  <Typography color={PALETTE_COLORS.yellow} fontWeight='bold' variant='h7'>
    {children}
  </Typography>
)

export const ProfileLayout = () => {
  const isSmall = useMediaQuery('(max-width:900px)')

  const CARD_STYLE = {
    padding: 0,
    boxShadow: 'none',
    borderRadius: '10px',
    minHeight: isSmall ? '0px' : '65vh',
    my: 3
  }

  return (
    <>
      <Grid container columns={{ xs: 6, sm: 8, md: 12 }} gridTemplateRows='repeat(2, 1fr)' justifyContent='space-evenly'>
        <Grid xs={5} {...COMMON_GRID_ATTRIBUTES}>
          <Card sx={CARD_STYLE}>
            <SimpleShowLayout sx={{ padding: 0 }}>
              <CardHeader
                avatar={<ProfileCardAvatar />}
                title={
                  <FunctionField
                    label=' '
                    render={({ first_name, last_name }) => (
                      <Typography variant='h5'>
                        {first_name} {last_name}
                      </Typography>
                    )}
                  />
                }
                sx={{ minHeight: '85px', border: '1px solid', borderColor: PALETTE_COLORS.grey, mx: 0, borderRadius: '10px' }}
              />
            </SimpleShowLayout>
            <SimpleShowLayout>
              <TextField source='ref' label='Référence' color={PALETTE_COLORS.yellow} />
              <TextField source='role' label='Rôle' />
              <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
              <FunctionField label='Statut' render={renderStatus} />
            </SimpleShowLayout>
          </Card>
        </Grid>
        <Grid xs={6} {...COMMON_GRID_ATTRIBUTES}>
          <Card sx={{ ...CARD_STYLE, border: '1px solid', borderColor: PALETTE_COLORS.grey }}>
            <SimpleShowLayout>
              <Title>Détails sur l'utilisateur</Title>
              <EmailField source='email' label='Email' />
              <FunctionField
                label='Téléphone'
                render={data => (data.phone ? <Link href={`tel:${data.phone}`}>{data.phone}</Link> : <span>{EMPTY_TEXT}</span>)}
              />
              <TextField source='address' label='Adresse' component='pre' EMPTY_TEXT={EMPTY_TEXT} />
              <FunctionField label='Sexe' render={renderSex} />
              <TextField source='nic' label='Numéro CIN' EMPTY_TEXT={EMPTY_TEXT} />
              <CustomDateField source='birth_date' label='Date de naissance' showTime={false} EMPTY_TEXT={EMPTY_TEXT} />
              <TextField source='birth_place' label='Lieu de naissance' EMPTY_TEXT={EMPTY_TEXT} />
            </SimpleShowLayout>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id
  return (
    <Show
      id={id}
      resource='profile'
      basePath='/profile'
      title='Mon profil'
      actions={
        <TopToolbar sx={{ padding: 0.5 }}>
          <EditButton to={`/profile/${id}/edit`} data-testid='profile-edit-button' />
        </TopToolbar>
      }
    >
      <ProfileLayout />
    </Show>
  )
}

export default ProfileShow
