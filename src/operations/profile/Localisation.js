import {MapContainer, TileLayer, Marker} from "react-leaflet";

const Localisation = () => (
<MapContainer center={[-18.860663, 47.542583]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[-18.860663, 47.542583]}>
        <Popup>
            Address <br /> Here
        </Popup>
    </Marker>
</MapContainer>
)
export default Localisation;