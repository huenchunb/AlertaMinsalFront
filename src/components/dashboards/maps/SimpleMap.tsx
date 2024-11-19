import React from 'react';
import 'leaflet/dist/leaflet.css';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

const SimpleMap = () => (
    <MapContainer center={[51.505, -0.09]} zoom={13}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[51.505, -0.09]}>
            <Popup>¡Aquí está tu marcador!</Popup>
        </Marker>
    </MapContainer>
);

export default SimpleMap;