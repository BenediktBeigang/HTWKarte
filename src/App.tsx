import React from "react";
import "./App.css";
import {
  MapContainer,
  TileLayer
} from "react-leaflet";
import L, { Map } from "leaflet";
import { PublicTransport } from "./PublicTransport";
import { Building } from "./Building";

const START_ZOOM = 17 as const;
const MAX_ZOOM = 18 as const;
const CENTER_OF_MAP: L.LatLngExpression = L.latLng(51.313, 12.374);

function App() {
  const mapRef = React.useRef<Map>(null);

  return (
    <MapContainer
      id="MapContainer"
      center={CENTER_OF_MAP}
      zoom={START_ZOOM}
      maxZoom={MAX_ZOOM}
      ref={mapRef}
    >

    <PublicTransport zoom={mapRef.current?.getZoom() ?? START_ZOOM} />
    <Building />

    <TileLayer
      attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      maxNativeZoom={MAX_ZOOM}
      maxZoom={MAX_ZOOM}
    />
    </MapContainer>
  );
}

export default App;
