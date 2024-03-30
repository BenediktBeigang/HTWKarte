import React, { useState } from "react";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Rectangle,
  Popup,
  Marker,
} from "react-leaflet";
import L, { Map } from "leaflet";
import { HTWK_YELLOW } from "./Color";
import { PublicTransport } from "./PublicTransport";
import nieper from "./Assets/Nieper.png";
import lipsius from "./Assets/Lipsius.png";

const START_ZOOM = 17 as const;
const MAX_ZOOM = 19 as const;
const CENTER_OF_MAP: L.LatLngExpression = L.latLng(51.313, 12.374);

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
    // text to every building that is always visible and is customizable
    // const popupContent = `<b>${feature.properties.Name}</b>`;
    // layer.bindPopup(popupContent);
  }

  const mapRef = React.useRef<Map>(null);

  return (
    <MapContainer
      id="MapContainer"
      center={CENTER_OF_MAP}
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

      <PublicTransport zoom={mapRef.current?.getZoom() ?? START_ZOOM} />
      <Marker
        position={new L.LatLng(51.313231581288704, 12.37287883331203)}
        icon={new L.Icon({ iconUrl: nieper, iconSize: [25, 25] })}
      ></Marker>
      <Marker
        position={new L.LatLng(51.31319879585476, 12.373778157922914)}
        icon={new L.Icon({ iconUrl: lipsius, iconSize: [25, 25] })}
      ></Marker>

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
