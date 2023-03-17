import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Box, Link, Typography } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'

export const ProfileLayout = () => {
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
      <EmailField source='email' label='Email' />
      <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
      <FunctionField label='Coordonnées géographiques' render={data => <GeoJsonRenderer data={data} />} />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const GeoJsonRenderer = ({ data: { location } }) => {
  const geoJsonUrl = location => {
    const geojsonBaseurl = 'https://geojson.io'
    const data = { coordinates: [location.longitude, location.latitude], type: location.type }

    return encodeURI(`${geojsonBaseurl}/#data=data:application/json,${JSON.stringify(data)}`)
  }

  return (
    <>
      {location ? (
        <Box>
          <Typography variant='body2'>longitude: {location.longitude}</Typography>
          <Typography variant='body2'>latitude: {location.latitude}</Typography>
          <Link href={geoJsonUrl(location)} target='_blank' underline='hover'>
            <Typography variant='body2'>
              <LocationOn fontSize='small' /> Voir sur la carte
            </Typography>
          </Link>
        </Box>
      ) : (
        <Box>
          <Typography variant='body2'>Les coordonnées géographique de cet étudiant ne sont pas encore renseigner.</Typography>
        </Box>
      )}
    </>
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
