import * as d3 from "d3";
import { MutableRefObject } from "react";
import { BuildingInJson, removeRoof } from "./Building.ts";
import { CampusContextAction, CampusContextProps } from "./campus-reducer.ts";
import { switchToInside } from "./Campus.tsx";
import { ParsedRoomID, parseRoomID } from "./Room.ts";

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

  return zoom;
};

function waitForSVGSelection(selector: string, timeoutMs: number) {
  return new Promise((resolve, reject) => {
    const intervalMs = 100;
    let elapsedMs = 0;

    const intervalId = setInterval(() => {
      const selectedElement = d3.select(selector);
      if (selectedElement !== null) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        resolve(selectedElement);
      } else if (elapsedMs >= timeoutMs) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        reject(new Error("Timeout erreicht, Element nicht gefunden"));
      }
      elapsedMs += intervalMs;
    }, intervalMs);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error("Timeout erreicht, Element nicht gefunden"));
    }, timeoutMs);
  });
}

const zoomToRoom = (
  roomID: string | undefined,
  initialZoomPositionReached: boolean,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  zoom: any,
  projection: d3.GeoProjection,
) => {
  if (initialZoomPositionReached || !roomID) return;
  const parsedRoomID: ParsedRoomID | undefined = parseRoomID(roomID);
  if (parsedRoomID === undefined) return;
  const { buildingAbbreviation, level } = parsedRoomID;
  const building: BuildingInJson | undefined = stateRef.current.state.dataOfBuildings.find(
    (building) => building.properties.Abbreviation === buildingAbbreviation,
  );
  if (!building || building.properties.Floors.includes(level) === false) return;
  switchToInside(stateRef, building, level);
  console.log("Building:", buildingAbbreviation, "Level:", level);

  waitForSVGSelection(`svg[id='${buildingAbbreviation}_${level}']`, 3000)
    .then((floorContainer: any) => {
      const floorSVG = floorContainer.select(`g[id='floor_${level}']`);
      const rooms = floorSVG.select(`g[id='rooms_${level}']`);
      const svgRoomID = roomID!.replace(".", "-");
      return { floorContainer, roomSVG: rooms.select(`rect[id='${svgRoomID}']`) };
    })
    .then((svgs: any) => {
      const { floorContainer, roomSVG } = svgs;

      if (!roomSVG.node()) throw new Error("Raum nicht gefunden");
      console.log(roomSVG.node());

      removeRoof(buildingAbbreviation, 200);

      const building: any = d3.select(`#${buildingAbbreviation}`);
      if (!building.node()) throw new Error("Gebäude nicht gefunden");

      const translate = building.node().attributes.transform.nodeValue;
      const buildingPosX = parseFloat(translate.split(",")[0].split("(")[1]);
      const buildingPosY = parseFloat(translate.split(",")[1].split(")")[0]);

      const roomBBox = roomSVG.node().getBBox();
      console.log("building", building);

      const targetPositionX = buildingPosX; //+ roomBBox.x + roomBBox.width / 2;
      const targetPositionY = buildingPosY; //+ roomBBox.y + roomBBox.height / 2;
      const pixelPos = [targetPositionX, targetPositionY];
      console.log(pixelPos);

      // convert pixel position to lngLat
      const START_ZOOM: number = 1 as const;
      const geoCoord: [number, number] = svgPositionToLngLat(
        pixelPos[0],
        pixelPos[1],
        START_ZOOM,
        projection,
      );
      console.log("geoCoord", geoCoord);

      // const k = d3.zoomIdentity.k;
      const k = 1;
      const campusSVG = d3.select<SVGSVGElement, unknown>("#campus-svg");

      console.log(svgPositionToLngLat(21892.791222587228, 34957.27783828974, k, projection));
      console.log(svgPositionToLngLat(0, 0, k, projection));

      // campusSVG.transition().duration(1500).call(
      //   zoom.transform,
      //   // d3.zoomIdentity.translate(targetPositionX, targetPositionY).scale(START_ZOOM),
      //   d3.zoomIdentity.translate(geoCoord[0], geoCoord[1]),
      // );
    });
};

export { createZoom, zoomToRoom };

