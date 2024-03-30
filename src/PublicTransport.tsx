import { Marker } from "react-leaflet";
import L, { Path } from "leaflet";
import htwk_north from "./Assets/HTWK_North.png";
import htwk_east from "./Assets/HTWK_East.png";
import connewitz_south from "./Assets/Connewitz_South.png";
import connewitz_west from "./Assets/Bus89.png";

const OPACITY_ZOOM_LEVEL : number = 17 as const;

type PublicTransportProps = {
  zoom: number;
};

export const PublicTransport: React.FC<PublicTransportProps> = ({ zoom }) => {
  return (
    <div>
      <Marker
        position={new L.LatLng(51.31535, 12.37335)}
        icon={
          new L.Icon({
            iconUrl: htwk_north,
            iconSize: [40, 84],
            iconAnchor: [20, 42],
          })
        }
        opacity={OPACITY_ZOOM_LEVEL <= zoom ? 1 : 0}
      />
      <Marker
        position={new L.LatLng(51.31488, 12.3741)}
        icon={
          new L.Icon({
            iconUrl: htwk_east,
            iconSize: [84, 40],
            iconAnchor: [42, 20],
          })
        }
        opacity={OPACITY_ZOOM_LEVEL <= zoom ? 1 : 0}
      />
      <Marker
        position={new L.LatLng(51.3114, 12.37323)}
        icon={
          new L.Icon({
            iconUrl: connewitz_south,
            iconSize: [40, 172],
            iconAnchor: [20, 20],
          })
        }
        opacity={OPACITY_ZOOM_LEVEL <= zoom ? 1 : 0}
      />
      <Marker
        position={new L.LatLng(51.31165, 12.3727)}
        icon={
          new L.Icon({
            iconUrl: connewitz_west,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })
        }
        opacity={OPACITY_ZOOM_LEVEL <= zoom ? 1 : 0}
      />
    </div>
  );
};
