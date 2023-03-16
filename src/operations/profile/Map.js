import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'
import { Typography } from '@mui/material'

const MapWithAMarker = withGoogleMap(user => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: user.location.lattitude, lng: user.location.longitude }}>
    <Marker position={{ lat: user.location.lattitude, lng: user.location.longitude }} />
  </GoogleMap>
))

export const MapField = data => {
  return (
    <>
      {typeof data.location !== 'undefined' ? (
        <MapWithAMarker containerElement={<div style={{ height: `120px`, width: `500px` }} />} mapElement={<div style={{ height: `100%` }} />} />
      ) : (
        <Typography>Adresse GPS Non spécifiée</Typography>
      )}
    </>
  )
}
