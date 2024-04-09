import { GeoJSON } from "react-leaflet";
import { LEIPZIG_RED, LEIPZIG_YELLOW, LEIPZIG_PURPLE } from "./Color";
import "./PublicTransportation.css";
import React from "react";

export const RouteTram9: React.FC<{ zoom: number }> = ({ zoom }) => {
  return Vehicle("Tram9", LEIPZIG_YELLOW, zoom);
};
export const RouteTram10: React.FC<{ zoom: number }> = ({ zoom }) => {
  return Vehicle("Tram10", LEIPZIG_RED, zoom);
};
export const RouteTram11: React.FC<{ zoom: number }> = ({ zoom }) => {
  return Vehicle("Tram11", LEIPZIG_RED, zoom);
};
export const RouteBus70: React.FC<{ zoom: number }> = ({ zoom }) => {
  return Vehicle("Bus70", LEIPZIG_PURPLE, zoom);
};
export const RouteBus89: React.FC<{ zoom: number }> = ({ zoom }) => {
  return Vehicle("Bus89", LEIPZIG_PURPLE, zoom);
};

function Vehicle(
  vehicle: string,
  color: string,
  zoom: number
): React.ReactElement {
  return (
    <GeoJSON
      data={require("./Assets/Routes/" + vehicle + "_Route.js")}
      style={{ color: color }}
    />
  );
}
