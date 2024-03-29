import { FeatureGroup, Marker } from "react-leaflet";
import L from "leaflet";
import tram10Image from "./Assets/Tram10.png";
import tram11Image from "./Assets/Tram11.png";
import tram9Image from "./Assets/Tram9.png";
import bus70Image from "./Assets/Bus70.png";

function createPublicTransportIcon(tramImage: string) {
  return new L.Icon({
    iconUrl: tramImage,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

type PublicTransportProps = {
  zoom: number;
};

export const PublicTransport: React.FC<PublicTransportProps> = ({ zoom }) => {
  const tram10Icon = createPublicTransportIcon(tram10Image);
  const tram11Icon = createPublicTransportIcon(tram11Image);
  const tram9Icon = createPublicTransportIcon(tram9Image);
  const bus70Icon = createPublicTransportIcon(bus70Image);

  const stopPosition_htwkStop_north = L.latLng(51.3155, 12.37335);
  const vehicles_htwkStop_north: { icon: L.Icon; offset: L.LatLng }[] = [
    { icon: tram10Icon, offset: L.latLng(0, 0) },
    { icon: tram11Icon, offset: L.latLng(-0.0003, 0) },
  ];

  const stopPosition_htwkStop_east = L.latLng(51.31487, 12.3739);
  const vehicles_htwkStop_east: { icon: L.Icon; offset: L.LatLng }[] = [
    { icon: tram9Icon, offset: L.latLng(0, 0) },
    { icon: bus70Icon, offset: L.latLng(0, 0.0005) },
  ];

  return (
    <div>
      <FeatureGroup>
        {vehicles_htwkStop_north.map((vehicle, index) => (
          <Marker
            key={index}
            position={L.latLng(
              stopPosition_htwkStop_north.lat + vehicle.offset.lat,
              stopPosition_htwkStop_north.lng + vehicle.offset.lng
            )}
            icon={vehicle.icon}
            opacity={17 <= zoom ? 1 : 0}
          />
        ))}
        {vehicles_htwkStop_east.map((vehicle, index) => (
          <Marker
            key={index}
            position={L.latLng(
              stopPosition_htwkStop_east.lat + vehicle.offset.lat,
              stopPosition_htwkStop_east.lng + vehicle.offset.lng
            )}
            icon={vehicle.icon}
            opacity={17 <= zoom ? 1 : 0}
          />
        ))}
      </FeatureGroup>
    </div>
  );
};
