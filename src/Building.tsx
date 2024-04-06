import { Marker, GeoJSON } from "react-leaflet";
import L from 'leaflet';
import styles from "./Building.module.css";
import { HTWK_YELLOW } from "./Color";

const ABBREVIATION_ZOOM_THRESHOLD = 17.5 as const;
const BUILDING_ZOOM_THRESHOLD = 16.5 as const;

type BuildingProps = {
  zoom: number;
  mapRef: React.RefObject<L.Map>;
};

function createAbbreviationIcon(abbreviation: string, iconSize: [number, number], zoom: number): L.DivIcon {
  const htmlText: string = abbreviation;
  const iconStyle: string = zoom > ABBREVIATION_ZOOM_THRESHOLD ? styles.abbreviation_icon_bigger : styles.abbreviation_icon;
  const iconAnchor: [number, number] = zoom > ABBREVIATION_ZOOM_THRESHOLD ? [iconSize[0] / 2, iconSize[1] / 2] : [6, 6];
  return L.divIcon({
    className: iconStyle,
    html: htmlText,
    iconAnchor: iconAnchor,
  });
}

function DisplayBuildingAbbreviation(
  abbreviation: string,
  location: L.LatLng,
  zoom: number,
  iconSize: [number, number] = [25, 25]
) {
  return (
    <Marker
      key={abbreviation}
      position={location}
      icon={createAbbreviationIcon(abbreviation, iconSize, zoom)}
    />
  );
}

function onEachBuildingFeature(feature: any, layer: any, zoom: number) {
  layer.on({
    click: function (e: any) {
      if (feature.properties.Name === "Mensa") {
        window.open("https://mensa.heylinus.de/", "_blank");
      };
      console.log("You clicked Building: " + feature.properties.Name);
    },
  });
  const location: L.LatLng = new L.LatLng(feature.properties.Location[0], feature.properties.Location[1]);
  const abbreviation: string = feature.properties.Abbreviation;

  if (location && !buildingAbbreviationIcons.some(icon => icon.key === abbreviation)) buildingAbbreviationIcons.push(
    DisplayBuildingAbbreviation(abbreviation, location, zoom)
  );
}

function style() {
  return {
    color: HTWK_YELLOW,
  };
}

function DisplayBuildings(zoom: number) {
  if (zoom > BUILDING_ZOOM_THRESHOLD) {
    return (
      <GeoJSON
        data={require("./Assets/htwkBuildings.js")}
        style={style()}
        onEachFeature={(feature, layer) => onEachBuildingFeature(feature, layer, zoom)}
      />
    );
  }
}

function onEachCampusLocationFeature(feature: any, layer: any, mapRef: React.RefObject<L.Map>) {
  layer.on({
    click: function (e: any) {
      const [lng, lat] = feature.geometry.coordinates;
      mapRef.current?.flyTo([lat, lng], 18, { duration: 1 });
    }
  });
}

function DisplayCampusMarker(zoom: number, mapRef: React.RefObject<L.Map>) {
  if(zoom <= BUILDING_ZOOM_THRESHOLD) {
    return (
      <GeoJSON
        data={require("./Assets/htwkCampusLocations.js")}
        style={style()}
        pointToLayer={(feature, latlng) => {
          return L.marker(latlng, {
            icon: new L.Icon({
              iconUrl: require("./Assets/CampusMarker/" +
                feature.properties.Name +
                ".png"),
              iconSize: [200, 100],
              iconAnchor: [14, 100],
            }),
          });
        }}
        onEachFeature={(feature, layer) => onEachCampusLocationFeature(feature, layer, mapRef)}
      />
    );
  }
}

let buildingAbbreviationIcons: JSX.Element[] = [];

export const Building: React.FC<BuildingProps> = ({ zoom, mapRef }) => {
  buildingAbbreviationIcons = [];
  return (
    <div>
      {DisplayCampusMarker(zoom, mapRef)}
      {DisplayBuildings(zoom)}
      {buildingAbbreviationIcons}
    </div>
  );
};
