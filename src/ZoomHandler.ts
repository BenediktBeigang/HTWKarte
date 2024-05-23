import * as d3 from "d3";
import { MutableRefObject } from "react";
import { CampusContextAction, CampusContextProps } from "./campus-reducer.ts";

const MIN_ZOOM: number = window.innerWidth * 0.00001;
const MAX_ZOOM: number = window.innerWidth * 0.0005;

const START_ZOOM: number = 0.03 as const;

const svgPositionToLngLat = (
  x: number,
  y: number,
  k: number,
  projection: d3.GeoProjection,
): [number, number] => {
  const viewport = d3.select("#campus-svg");
  if (viewport.empty()) return [0, 0];

  const offset_x = (viewport.node() as HTMLElement).getBoundingClientRect().width / 2;
  const offset_y = (viewport.node() as HTMLElement).getBoundingClientRect().height / 2;
  const centerX = (1 / k) * (-x + offset_x);
  const centerY = (1 / k) * (-y + offset_y);
  return projection.invert!([centerX, centerY]) ?? [0, 0];
};

const lngLatToSvgPosition = (
  lngLatPosition: [number, number],
  projection: d3.GeoProjection,
): [number, number] => {
  const viewport = d3.select("#campus-svg");
  if (viewport.empty()) return [0, 0];

  const startSvgPosition = projection(lngLatPosition) ?? [0, 0];
  const scalar = 1 / START_ZOOM;
  const offset_x = (scalar * (viewport.node() as HTMLElement).getBoundingClientRect().width) / 2;
  const offset_y = (scalar * (viewport.node() as HTMLElement).getBoundingClientRect().height) / 2;
  const centerX = -startSvgPosition[0] + offset_x;
  const centerY = -startSvgPosition[1] + offset_y;
  return [centerX, centerY];
};

const createZoom = (
  campusSVG: any,
  buildingContainer: any,
  projection: d3.GeoProjection,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
): void => {
  // zoom-creation
  const zoom: any = d3.zoom().on("zoom", (event) => {
    const { transform } = event;
    const { x, y, k } = transform;
    const geoCoord: [number, number] = svgPositionToLngLat(x, y, k, projection);
    stateRef.current.dispatch({ type: "UPDATE_POSITION", position: geoCoord });
    stateRef.current.dispatch({ type: "UPDATE_ZOOM", zoomFactor: k });
    if (buildingContainer) buildingContainer.attr("transform", transform.toString());
  });
  campusSVG.call(zoom);
  zoom.scaleExtent([MIN_ZOOM, MAX_ZOOM]);

  // start in the middle of the campus
  const state = stateRef.current.state;
  const campus = state.dataOfCampus.find((c) => c.properties.Name === state.currentCampus);
  const lngLatOfCurrentCampus: [number, number] = campus!.properties.Location as [number, number];
  const [centerX, centerY] = lngLatToSvgPosition(lngLatOfCurrentCampus, projection);
  campusSVG.call(zoom.transform, d3.zoomIdentity.scale(START_ZOOM).translate(centerX, centerY));
};

export { createZoom };
