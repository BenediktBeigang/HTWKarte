import React, { useState } from "react";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Rectangle,
  Popup,
} from "react-leaflet";
import L, { Map } from "leaflet";
import { HTWK_YELLOW } from "./Color";
import { PublicTransport } from "./PublicTransport";

const START_ZOOM = 17 as const;
const MAX_ZOOM = 19 as const;

const boundsOfTitle = L.latLngBounds([51.3147, 12.3744], [51.3138, 12.3765]);

function ZoomHandler({
  setFontSize,
}: {
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}) {
  const map = useMapEvents({
    zoomend: () => {
      const zoomLevel: number = map.getZoom();
      const calc = 50 - (START_ZOOM - zoomLevel) * 50;
      setFontSize(calc);
      console.log("Zoom Level: " + zoomLevel + " Font Size: " + calc);
    },
  });

  return null;
}

function App() {
  const [fontSize, setFontSize] = useState(50);

  function style() {
    return {
      color: HTWK_YELLOW,
    };
  }

  function onEachFeature(feature: any, layer: any) {
    layer.on({
      click: function (e: any) {
        console.log("You clicked Building: " + feature.properties.Name);
      },
    });
  }

  const mapRef = React.useRef<Map>(null);

  return (
    <MapContainer
      id="MapContainer"
      center={[51.3135, 12.374]}
      zoom={START_ZOOM}
      maxZoom={MAX_ZOOM}
      ref={mapRef}
    >
      <ZoomHandler setFontSize={setFontSize} />

      <GeoJSON
        data={require("./Assets/htwkBuildings.js")}
        style={style()}
        onEachFeature={onEachFeature}
      />

      <Rectangle bounds={boundsOfTitle} color={HTWK_YELLOW} weight={5}>
        <Popup>Hier steht text um zu zeigen dass hier was steht.</Popup>
      </Rectangle>

      <PublicTransport zoom={mapRef.current?.getZoom() ?? START_ZOOM} />

      {/* <SVGOverlay bounds={BoundsOfTitle}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#ffffff55" stroke={HTWK_YELLOW} strokeWidth={5}/>
          <rect></rect>
          <text x={20} y={60} fontSize={fontSize} stroke='white' fill='white'>
            HTWK Leipzig
          </text>
          <text x={20} y={150} fontSize={fontSize} stroke='white' fill='white'>
            Karl-Liebknecht
          </text>
          <text x={20} y={200} fontSize={fontSize} stroke='white' fill='white'>
            Campus
          </text>
        </svg>
      </SVGOverlay> */}

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
