import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
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
      <FunctionField label='Coordonnées géographiques' render={data => <GeoLocationRenderer data={data} />} />
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

const GeoLocationRenderer = ({ data: { position } }) => {
  const geoLocationUrl = position => {
    const geoLocationBaseUrl = 'https://www.google.com/maps/search/?api=1';
    const data = { query: `${position.latitude},${position.longitude}` };

    return encodeURI(`${geoLocationBaseUrl}&query=${data.query}`);
  };

  return (
    <>
      {position ? (
        <Box>
          <Typography variant='body2'>Latitude: {position.latitude}</Typography>
          <Typography variant='body2'>Longitude: {position.longitude}</Typography>
          <Link href={geoLocationUrl(position)} target='_blank' underline='hover'>
            <Typography variant='body2'>
              <Map fontSize='small' /> View on Map
            </Typography>
          </Link>
        </Box>
      ) : (
        <Box>
          <Typography variant='body2'>This student's location is not yet available.</Typography>
        </Box>
      )}
    </>
  );
};

export default ProfileShow
