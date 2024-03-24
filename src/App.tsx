import React from 'react';
import './App.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const MIN_ZOOM = 17.5 as const; 

function App() {
  const corner1 = L.latLng(51.3159159, 12.3714126);
  const corner2 = L.latLng(51.3115960, 12.3789587);
  const bounds = L.latLngBounds(corner1, corner2);

  return (
    <MapContainer
      id="MapContainer"
      center={[51.313, 12.375]}
      zoom={MIN_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={18}
      maxBounds={bounds}
      maxBoundsViscosity={3}
      >
      <TileLayer 
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
    </MapContainer>
  );
}

export default App;
