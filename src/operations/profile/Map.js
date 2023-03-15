import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'

const userLongitude = user.location.lattitude!=null ? user.location.lattitude : null
const userLattitude = user.location.lattitude!=null ? user.location.lattitude : null
 export const MapWithAMarker = withGoogleMap(user => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: user.location.lattitude , lng: user.location.longitude }}>
      <Marker position={{ lat: user.location.lattitude , lng: user.location.longitude  }} />
    </GoogleMap>
  ))