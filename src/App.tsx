import React, { useState } from "react";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  useMapEvents
} from "react-leaflet";
import L, { Map } from "leaflet";
import { PublicTransport } from "./PublicTransport";
import { Building } from "./Building";

const START_ZOOM = 17 as const;
const MAX_ZOOM = 18 as const;
const MIN_ZOOM = 13 as const;
const CENTER_OF_MAP: L.LatLngExpression = L.latLng(51.313, 12.374);
const MAX_BOUNDS: L.LatLngBoundsExpression = L.latLngBounds(
  L.latLng(51.39666318732199, 12.250913752241985),
  L.latLng(51.26015055350072, 12.565081562966043)
);

function App() {
  const [zoom, setZoom] = useState<number>(START_ZOOM);

  const mapRef: React.RefObject<L.Map> = React.useRef<Map>(null);

  const MapEvents = () => {
    const map = useMapEvents({
      zoomend: () => {
        setZoom(map.getZoom());
        console.log("Zoom: " + zoom);
      },
    });
    return null;
  };

  return (
    <MapContainer
      id="MapContainer"
      center={CENTER_OF_MAP}
      zoom={START_ZOOM}
      maxZoom={MAX_ZOOM}
      minZoom={MIN_ZOOM}
      ref={mapRef}
      maxBounds={MAX_BOUNDS}
      zoomSnap={0.1}
    >
      <MapEvents />
      <PublicTransport zoom={zoom} />
      <Building key={zoom} zoom={zoom} mapRef={mapRef} />

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
