import { Marker, SVGOverlay } from "react-leaflet";
import L from 'leaflet';
import {ReactComponent as NI} from './Assets/BuildingTest_export.svg';

type BuildingInsideViewProps = {
  zoom: number;
  mapRef: React.RefObject<L.Map>;
};

const buildingCanvasBounds: L.LatLngBoundsExpression = L.latLngBounds(
  L.latLng(51.31364327130214, 12.372724266336547),
  L.latLng(51.31277904425039, 12.373036936776828)
);

export const BuildingInsideView: React.FC<BuildingInsideViewProps> = ({
  zoom,
  mapRef,
}) => {
  return (
    <>
      <Marker position={L.latLng(51.31364327130214, 12.372724266336547)} />
      <Marker position={L.latLng(51.31277904425039, 12.373036936776828)} />
      <SVGOverlay bounds={buildingCanvasBounds}>
        <NI width="100%" height="100%" />
      </SVGOverlay>
    </>
  );
};
