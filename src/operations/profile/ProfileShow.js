import { useState } from 'react'
import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link, Button, Drawer } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MapViewer from './MapViewer'

export const ProfileLayout = () => {
  const [openLocation, setOpenLocation] = useState(false)
  const handleOpenLocation = () => {
    setOpenLocation(!openLocation)
  }
  const sexRenderer = user => {
    if (user.sex === 'M') return 'Homme'
    if (user.sex === 'F') return 'Femme'
    return unexpectedValue
  }
  const statusRenderer = user => {
    if (user.status === 'ENABLED') return 'Actif·ve'
    if (user.status === 'DISABLED') return 'Suspendu·e'
    return unexpectedValue
  }
  const locationRenderer = user => {
    return (
      <>
        <Button color='secondary' size='small' startIcon={<VisibilityIcon />} onClick={handleOpenLocation}>
          Afficher
        </Button>
        <Drawer anchor='right' open={openLocation} onClose={handleOpenLocation}>
          <Button color='secondary' size='small' startIcon={<VisibilityOffIcon />} onClick={handleOpenLocation}>
            Cacher
          </Button>
          <MapViewer latitude={user.location.latitude} longitude={user.location.longitude} />
        </Drawer>
      </>
    )
  }
  const phoneRenderer = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <FunctionField label='Téléphone' render={phoneRenderer} />
      <CustomDateField source='birth_date' label='Date de naissance' showTime={false} />
      <TextField source='address' label='Adresse' component='pre' />
      <FunctionField label='localisation' render={locationRenderer} />
      <EmailField source='email' label='Email' />
      <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id
  return (
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout />
    </Show>
  )
}

export default ProfileShow
