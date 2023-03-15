import React from 'react'
import { MapContainer, TileLayer, Popup } from 'react-leaflet'
import { MarkerLayer, Marker } from 'react-leaflet-marker'
import { Box } from '@mui/material'
import 'leaflet/dist/leaflet.css'

const MapViewer = ({ latitude, longitude }) => {
  const position = { lat: latitude, lng: longitude }

  const customMarkerProps = {
    bgcolor: 'rgba(255, 0, 0, 0.36)',
    style: { width: '5rem', height: '5rem' }
  }
  return (
    <MapContainer center={position} zoom={20} style={{ height: '95%', width: 'min(100vw, 600px)' }} scrollWheelZoom={false}>
      <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <MarkerLayer>
        <Popup position={position} size={[70, 70]}>
          latitude: {latitude}, longitude: {longitude}
        </Popup>
        <Marker position={position} placement='center' size={[70, 70]}>
          <Box borderRadius='50%' {...customMarkerProps} />
        </Marker>
      </MarkerLayer>
    </MapContainer>
  )
}

export default MapViewer
