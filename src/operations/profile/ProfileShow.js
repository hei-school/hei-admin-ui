import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'
import {GoogleMap,Marker, withGoogleMap} from 'react-google-maps'
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
  const userLattitude = user => {
    return user.location.lattitude != null ? user.location.lattitude : unexpectedValue
  }
  const userLongitude = user => {
    return user.location.longitude != null ? user.location.longitude : unexpectedValue
  }
  const MapWithAMarker = withGoogleMap(props =>
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: -34.392, lng: 150.644 }}
    >
      <Marker
        position={{ lat: -34.397, lng: 150.644 }}
      />
    </GoogleMap>
  );
  
  
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
      <MapWithAMarker containerElement={<div style={{ height: `250px` }} />}
              mapElement={<div style={{ height: `100%` }} />}/>
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
