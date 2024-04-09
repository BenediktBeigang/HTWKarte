import { Marker, GeoJSON, FeatureGroup, Popup } from "react-leaflet";
import L from "leaflet";
import { LEIPZIG_RED, LEIPZIG_YELLOW, LEIPZIG_PURPLE } from "./Color";
import "./PublicTransportation.css";
import { Tram9, Tram10, Tram11, Bus70, Bus89 } from "./VehicleIconFactory";
import React from "react";

const OPACITY_ZOOM_LEVEL : number = 16.5 as const;

type PublicTransportProps = {
  zoom: number;
};

function style(color: string, zoom: number) {
  const opacity = OPACITY_ZOOM_LEVEL <= zoom ? 1 : 0 as const;
  switch (color) {
    case "red":
      return { color: LEIPZIG_RED, opacity: opacity};
    case "yellow":
      return { color: LEIPZIG_YELLOW, opacity: opacity };
    case "purple":
      return { color: LEIPZIG_PURPLE, opacity: opacity };
    default:
      return { color: "#ffffff", opacity: opacity };
  }
}

const busAndTramStopIcon = new L.DivIcon({
  className: "busAndTramStopIcon",
  html: `
  <svg width="40" height="40" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg" style="background-color:transparent;">
    <circle cx="5.2917" cy="5.2917" r="5.0783" style="fill:#032c58;font-variation-settings:'wdth' 70, 'wght' 600;stroke-linecap:round;stroke-linejoin:round;stroke-width:.42677;stroke:#fbc10f"/>
    <circle cx="5.2917" cy="5.2917" r="3.9687" style="fill:#fbc10f;font-variation-settings:'wdth' 70, 'wght' 600"/>
    <text x="2.9137015" y="8.135664" style="fill:#032c58;font-family:'Noto Sans';font-size:7.9664px;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variation-settings:'wdth' 70, 'wght' 600;stroke-linecap:round;stroke-linejoin:round;stroke-width:.10285" xml:space="preserve"><tspan x="2.9137015" y="8.135664" style="fill:#032c58;font-family:'Noto Sans';font-size:7.9664px;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variation-settings:'wdth' 70, 'wght' 600;stroke-width:.10285">H</tspan></text>
  </svg>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function CreateBusAndTramMarker({
  name,
  location,
  vehicles,
  zoom,
  popupOffset,
}: {
  name: string;
  location: L.LatLng;
  vehicles: React.ReactNode[];
  zoom: number;
  popupOffset: L.Point;
}) {  
  return (
    <Marker
      position={location}
      icon={busAndTramStopIcon}
      opacity={zoom >= OPACITY_ZOOM_LEVEL ? 1 : 0}
      eventHandlers={{
        click: (e) => {
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.closePopup();
        },
        mouseover: (e) => {
          e.target.openPopup();
        }
      }}
    >
      <Popup className="popup" offset={popupOffset}>
        <div id={name} className="vehicle">
          {vehicles.map((vehicle, index) => (
            <div key={index}>{vehicle}</div>
          ))}
        </div>
      </Popup>
    </Marker>
  );
}

export const PublicTransport: React.FC<PublicTransportProps> = ({ zoom }) => {
  return (
    <div>
      {CreateBusAndTramMarker({
        name: "htwk_north",
        location: new L.LatLng(51.31535, 12.37335),
        vehicles: [<Tram10 />, <Tram11 />] as React.ReactNode[],
        zoom: zoom,
        popupOffset: new L.Point(80, 59),
      })}
      {CreateBusAndTramMarker({
        name: "htwk_east",
        location: new L.LatLng(51.31488, 12.3741),
        vehicles: [<Tram9 />, <Bus70 />] as React.ReactNode[],
        zoom: zoom,
        popupOffset: new L.Point(80, 59),
      })}
      {CreateBusAndTramMarker({
        name: "htwk_south",
        location: new L.LatLng(51.3114, 12.37323),
        vehicles: [
          <Tram9 />,
          <Tram10 />,
          <Tram11 />,
          <Bus70 />,
        ] as React.ReactNode[],
        zoom: zoom,
        popupOffset: new L.Point(0, 110),
      })}
      {CreateBusAndTramMarker({
        name: "htwk_west",
        location: new L.LatLng(51.31165, 12.3727),
        vehicles: [<Bus89 />] as React.ReactNode[],
        zoom: zoom,
        popupOffset: new L.Point(-50, 59),
      })}

      <FeatureGroup>
        <GeoJSON
          data={require("./Assets/Routes/Bus70_Route.js")}
          style={style("purple", zoom)}
        />
        <GeoJSON
          data={require("./Assets/Routes/Bus89_Route.js")}
          style={style("purple", zoom)}
        />
        <GeoJSON
          data={require("./Assets/Routes/Tram9_Route.js")}
          style={style("yellow", zoom)}
        />
        <GeoJSON
          data={require("./Assets/Routes/Tram10_Route.js")}
          style={style("red", zoom)}
        />
        <GeoJSON
          data={require("./Assets/Routes/Tram11_Route.js")}
          style={style("red", zoom)}
        />
      </FeatureGroup>
    </div>
  );
};