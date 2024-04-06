import { Marker, GeoJSON, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { LEIPZIG_RED, LEIPZIG_YELLOW, LEIPZIG_PURPLE } from "./Color";

import htwk_north from "./Assets/VehicleIcons/HTWK_North.png";
import htwk_east from "./Assets/VehicleIcons/HTWK_East.png";
import connewitz_south from "./Assets/VehicleIcons/Connewitz_South.png";
import connewitz_west from "./Assets/VehicleIcons/Bus89.png";

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

function publicTransportStop(
  position: L.LatLng, 
  iconUrl: string, 
  iconSize: [number, number], 
  iconAnchor: [number, number], 
  zoom: number){
  return (
    <Marker
      position={position}
      icon={
        new L.Icon({
          iconUrl: iconUrl,
          iconSize: iconSize,
          iconAnchor: iconAnchor,
        })
      }
      opacity={OPACITY_ZOOM_LEVEL <= zoom ? 1 : 0}
    />
  );
}

export const PublicTransport: React.FC<PublicTransportProps> = ({ zoom }) => {
  return (
    <div>
      {publicTransportStop(
        new L.LatLng(51.31535, 12.37335),
        htwk_north,
        [40, 84],
        [20, 42],
        zoom
      )}
      {publicTransportStop(
        new L.LatLng(51.31488, 12.3741),
        htwk_east,
        [84, 40],
        [42, 20],
        zoom
      )}
      {publicTransportStop(
        new L.LatLng(51.3114, 12.37323),
        connewitz_south,
        [40, 172],
        [20, 20],
        zoom
      )}
      {publicTransportStop(
        new L.LatLng(51.31165, 12.3727),
        connewitz_west,
        [40, 40],
        [20, 20],
        zoom
      )}

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