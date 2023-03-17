import { EmailField, FunctionField,SimpleShowLayout, Show, TextField } from 'react-admin'
//import { Link } from '@mui/material'
import { useState } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { Box } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Link, Button, Drawer } from '@mui/material'

import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'

export const ProfileLayout = () => {

  const MapViewer = ({ latitude, longitude }) => {
    const [viewport, setViewport] = useState({
      latitude: latitude,
      longitude: longitude,
      zoom: 19,
      bearing: 0,
      pitch: 60
    })
  
    const customMarkerProps = {
      bgcolor: 'rgba(255, 0, 0, 0.36)',
      style: { width: '5rem', height: '5rem' }
    }
  
    return (
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="95%"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken="YOUR_ACCESS_TOKEN"
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        <Marker
          latitude={latitude}
          longitude={longitude}
          offsetLeft={-25}
          offsetTop={-25}
        >
          <Box borderRadius='50%' {...customMarkerProps} />
        </Marker>
        <Popup
          latitude={latitude}
          longitude={longitude}
          closeButton={false}
          anchor="top"
        >
          <div>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>
        </Popup>
      </ReactMapGL>
    )
  } 

  const [openLocation, setOpenLocation] = useState(false)
  const handleOpenLocation = () => {
    setOpenLocation(!openLocation)
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
          <MapViewer latitude={user.latitude} longitude={user.longitude} />
        </Drawer>
      </>
    )
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
