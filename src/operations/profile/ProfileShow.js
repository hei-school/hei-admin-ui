import { EditButton, EmailField, FunctionField, ImageField, ImageInput, Show, SimpleForm, SimpleShowLayout, TextField, TopToolbar } from 'react-admin'

import { PhotoCamera } from '@mui/icons-material'
import { EnableStatus, Sex } from '@haapi/typescript-client'
import { Badge, Card, Dialog, DialogTitle, Grid, IconButton, Link, Typography, CardHeader } from '@mui/material'

import { useToggle } from '../../hooks'
import { palette } from '../../ui/constants'
import { CustomCreate } from '../utils/CustomCreate'
import { CustomDateField, unexpectedValue } from '../utils'
import authProvider from '../../providers/authProvider'

export const ProfileLayout = () => {
  const emptyText = 'Non défini.e'

  const cardStyle = {
    minHeight: '310px',
    my: 3
  }

  const midCardStyle = {
    minHeight: '200px',
    my: 3
  }

  const commonGridAttribute = { gridTemplateRows: '2fr 1fr', direction: 'column', item: true }

  const sexRenderer = user => {
    switch (user.sex) {
      case Sex.M:
        return 'Homme'
      case Sex.F:
        return 'Femme'
      case null:
        return emptyText
      default:
        return unexpectedValue
    }
  }

  const statusRenderer = user => {
    if (user.status === EnableStatus.ENABLED) return 'Actif·ve'
    if (user.status === EnableStatus.SUSPENDED) return 'Suspendu·e'
    if (user.status === EnableStatus.DISABLED) return 'Quitté.e'
    return unexpectedValue
  }

  const phoneRenderer = data => (data.phone ? <Link href={`tel:${data.phone}`}>{data.phone}</Link> : <span>{emptyText}</span>)

  const ProfileImage = ({ src }) => <img src={src} style={{ height: 80, width: 80, border: '1px solid #e0e0e0', borderRadius: '50%' }} />

  const pictureRenderer = user => (user.profile_picture ? <ProfileImage src={user.profile_picture} /> : <ProfileImage src='/blank-profile-photo.png' />)

  const nameRenderer = user => (
    <Typography variant='h5'>
      {user.first_name} {user.last_name}
    </Typography>
  )

  const CardContainer = ({ children, style }) => {
    return (
      <Card sx={style}>
        <SimpleShowLayout>{children}</SimpleShowLayout>
      </Card>
    )
  }

  const UploadPictureButton = () => {
    const [isOpen, , toggle] = useToggle()

    const id = authProvider?.getCachedWhoami()?.id

    const savePicture = data => ({ rawFile: data?.profile_picture?.rawFile, id })

    return (
      <>
        <IconButton
          onClick={() => toggle()}
          sx={{ borderRadius: '50%', transform: 'translate(-15px, -15px)', bgcolor: palette.primary, height: 20, width: 20 }}
        >
          <PhotoCamera sx={{ height: 15, width: 15, color: palette.white }} />
        </IconButton>
        <Dialog open={isOpen} onClose={() => toggle()}>
          <DialogTitle>Modifier la photo de profil</DialogTitle>
          <CustomCreate title=' ' resource='profile-picture' transform={savePicture}>
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
        <FunctionField label=' ' render={pictureRenderer} />
      </Badge>
    </>
  )

  const Title = ({ children }) => (
    <Typography color={palette.yellow} fontWeight='bold' variant='h7'>
      {children}
    </Typography>
  )

  return (
    <>
      <Grid container gridTemplateColumns='repeat(2, 1fr)' justifyContent='space-evenly'>
        <Grid xs={5} {...commonGridAttribute}>
          <CardContainer style={cardStyle}>
            <CardHeader avatar={<ProfileCardAvatar />} sx={{ minHeight: '85px', bgcolor: '#e0e0e0' }} />
            <FunctionField label=' ' render={nameRenderer} />
            <TextField source='ref' label='Référence' color={palette.yellow} />
            <TextField source='role' label='Rôle' />
          </CardContainer>
          <CardContainer style={midCardStyle}>
            <Title>Contacts et Adresse</Title>
            <EmailField source='email' label='Email' />
            <FunctionField label='Téléphone' render={phoneRenderer} />
            <TextField source='address' label='Adresse' component='pre' emptyText={emptyText} />
          </CardContainer>
        </Grid>
        <Grid xs={6} {...commonGridAttribute}>
          <CardContainer style={cardStyle}>
            <Title>Détails sur l'utilisateur</Title>
            <FunctionField label='Sexe' render={sexRenderer} />
            <TextField source='nic' label='Numéro CIN' emptyText={emptyText} />
            <CustomDateField source='birth_date' label='Date de naissance' showTime={false} emptyText={emptyText} />
            <TextField source='birth_place' label='Lieu de naissance' emptyText={emptyText} />
          </CardContainer>
          <CardContainer style={midCardStyle}>
            <Title>Vos infos spécifiques à HEI</Title>
            <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
            <FunctionField label='Statut' render={statusRenderer} />
          </CardContainer>
        </Grid>
      </Grid>
    </>
  )
}

const Actions = ({ userId }) => (
  <TopToolbar variant='dense' sx={{ padding: 0.5 }}>
    <EditButton size='medium' to={`/profile/${userId}/edit`} data-testid='profile-edit-button' />
  </TopToolbar>
)

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id
  return (
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil' actions={<Actions userId={id} />}>
      <ProfileLayout />
    </Show>
  )
}

export default ProfileShow
