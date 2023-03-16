import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'
import { Typography } from '@mui/material'

const user = {
  location:{
    longitude : -25.25555,
    lattitude : 42.233252
  }
}

const MapWithAMarker = withGoogleMap(() => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: user.location.lattitude, lng: user.location.longitude }}>
    <Marker position={{ lat: user.location.lattitude, lng: user.location.longitude }} />
  </GoogleMap>
))

export const MapField = () => {
  return (
    <>
      {typeof user.location !== 'undefined' ? (
        <MapWithAMarker containerElement={<div style={{ height: `100px`, width: `500px` }} />} mapElement={<div style={{ height: `100%` }} />} />
      ) : (
        <Typography>Adresse GPS Non spécifiée</Typography>
      )}
    </>
  )
}
