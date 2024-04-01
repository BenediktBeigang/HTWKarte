import { Marker, GeoJSON } from "react-leaflet";
import L from 'leaflet';
import styles from "./Building.module.css";
import { HTWK_YELLOW } from "./Color";

function createAbbreviationIcon(abbreviation: string, iconSize: [number, number]): L.DivIcon {
  const htmlText: string = abbreviation;
  return L.divIcon({
    className: styles.abbreviation_icon,
    html: htmlText,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
  });
}

function displayBuildingAbbreviation(abbreviation: string, location: L.LatLng, iconSize: [number, number] = [25, 25]) {
  return (
    <Marker
      key={abbreviation}
      position={location}
      icon={createAbbreviationIcon(abbreviation, iconSize)}
    />
  );
}

function onEachFeature(feature: any, layer: any) {
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
    displayBuildingAbbreviation(abbreviation, location)
  );
}

function style() {
  return {
    color: HTWK_YELLOW,
  };
}

let buildingAbbreviationIcons: JSX.Element[] = [];

export const Building = () => {
  buildingAbbreviationIcons = [];
  return (
    <div>
      <GeoJSON
        data={require("./Assets/htwkBuildings.js")}
        style={style()}
        onEachFeature={onEachFeature}
      />
      {buildingAbbreviationIcons}
    </div>
  );
};
