import * as d3 from "d3";
import { MutableRefObject } from "react";
import { BuildingInJson, removeRoof } from "./Building.ts";
import { CampusContextAction, CampusContextProps } from "./campus-reducer.ts";
import { switchToInside } from "./Campus.tsx";
import { ParsedRoomID, parseRoomID, updateRoomHighlighting } from "./Room.ts";

const MIN_ZOOM: number = window.innerWidth * 0.00001;
const MAX_ZOOM: number = window.innerWidth * 0.0005;

const START_ZOOM: number = 0.03 as const;
const START_ZOOM_FOR_ROOM: number = 0.3 as const;

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

// const lngLatToSvgPosition = (
//   lngLatPosition: [number, number],
//   projection: d3.GeoProjection,
// ): [number, number] => {
//   const viewport = d3.select("#campus-svg");
//   if (viewport.empty()) return [0, 0];

//   const startSvgPosition = projection(lngLatPosition) ?? [0, 0];
//   const scalar = 1 / START_ZOOM;
//   const offset_x = (scalar * (viewport.node() as HTMLElement).getBoundingClientRect().width) / 2;
//   const offset_y = (scalar * (viewport.node() as HTMLElement).getBoundingClientRect().height) / 2;
//   const centerX = -startSvgPosition[0] + offset_x;
//   const centerY = -startSvgPosition[1] + offset_y;
//   return [centerX, centerY];
// };

const createZoom = (
  campusSVG: any,
  buildingContainer: any,
  projection: d3.GeoProjection,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
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
  return zoom;
};

const initialZoomPosition = async (
  campusSVG: any,
  buildingContainer: any,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  roomID: string | undefined,
  projection: d3.GeoProjection,
) => {
  let roomSearchResult: any | undefined;
  let targetPosition: [x:number, y:number];

  try {
    if (roomID === undefined) throw new Error("No room provided");
    // Search for room in SVG
    roomSearchResult = await findRoomInSVG(roomID, stateRef);
    const { roomSVG, buildingAbbreviation } = roomSearchResult;
    targetPosition = extractRoomCoordinates(
      roomSVG,
      buildingAbbreviation,
    );
  } catch (error) {
    if (roomSearchResult && roomSearchResult.buildingAbbreviation) removeRoof(roomSearchResult.buildingAbbreviation);
    moveToCampusCenter(
      stateRef,
      campusSVG,
      buildingContainer,
      () => {
        stateRef.current.dispatch({
          type: "UPDATE_ZOOM_POSITION_REACHED",
          zoomPositionReached: true,
        });
      },
      START_ZOOM,
      projection,
    );
    return;
  }
  removeRoof(roomSearchResult.buildingAbbreviation);
  updateRoomHighlighting(roomID, true);
  moveToCampusCenter(
    stateRef,
    campusSVG,
    buildingContainer,
    async () => {
      // Zoom to room
      zoomToPixelPosition(
        campusSVG,
        buildingContainer,
        targetPosition[0],
        targetPosition[1],
        START_ZOOM_FOR_ROOM,
        stateRef,
        projection,
        1000,
      );
      stateRef.current.dispatch({
        type: "UPDATE_ZOOM_POSITION_REACHED",
        zoomPositionReached: true,
      });
    },
    START_ZOOM_FOR_ROOM,
    projection,
  );
};

const moveToCampusCenter = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  campusSVG: any,
  buildingContainer: any,
  onEndCallback: () => void,
  zoomFactor: number,
  projection: d3.GeoProjection,
) => {
  const state = stateRef.current.state;
  const campus = state.dataOfCampus.find((c) => c.properties.Name === state.currentCampus);
  const { MapWidth, MapHeight } = campus!.properties;
  const xOffset = campus!.properties.CenterXOffset ?? 0;
  const yOffset = campus!.properties.CenterYOffset ?? 0;
  zoomToPixelPosition(
    campusSVG,
    buildingContainer,
    (MapWidth / 2) + xOffset,
    (MapHeight / 2) + yOffset,
    zoomFactor,
    stateRef,
    projection,
    0,
    onEndCallback,
  );
};

export const zoomToPixelPosition = (
  campusSVG: any,
  buildingContainer: any,
  targetX: number,
  targetY: number,
  scale: number,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  projection: d3.GeoProjection,
  duration: number = 750,
  onEndCallback?: () => void,
) => {
  if (!(campusSVG.node().clientWidth / 2) || !(campusSVG.node().clientHeight / 2)) return;
  // Define the new zoom transformation
  const transform = d3.zoomIdentity
    .translate(campusSVG.node().clientWidth / 2, campusSVG.node().clientHeight / 2)
    .scale(scale)
    .translate(-targetX, -targetY);

  // Update state
  const geoCoord: [number, number] = projection.invert!([targetX, targetY]) as [number, number];
  stateRef.current.dispatch({ type: "UPDATE_POSITION", position: geoCoord });
  stateRef.current.dispatch({ type: "UPDATE_ZOOM", zoomFactor: scale });

  // Apply transition to zoom
  campusSVG
    .transition()
    .duration(duration)
    .call(
      d3.zoom().on("zoom", (event) => {
        const { transform } = event;
        if (buildingContainer) buildingContainer.attr("transform", transform.toString());
      }).transform,
      transform,
    )
    .on("end", () => {
      if (onEndCallback) onEndCallback();
    });
};

const waitForSVGSelection = (selector: string, timeoutMs: number) => {
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
};

const findRoomInSVG = async (
  roomID: string | undefined,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  if (!roomID) return;
  const parsedRoomID: ParsedRoomID | undefined = parseRoomID(roomID);
  if (parsedRoomID === undefined) return;
  const { buildingAbbreviation, level } = parsedRoomID;
  const building: BuildingInJson | undefined = stateRef.current.state.dataOfBuildings.find(
    (building) => building.properties.Abbreviation === buildingAbbreviation,
  );
  if (!building || building.properties.Floors.includes(level) === false) return;
  switchToInside(stateRef, building, level);
  console.log("Building:", buildingAbbreviation, "Level:", level);

  const { roomSVG } = await waitForSVGSelection(
    `svg[id='${buildingAbbreviation}_${level}']`,
    3000,
  ).then((floorContainer: any) => {
    const floorSVG = floorContainer.select(`g[id='floor_${level}']`);
    const rooms = floorSVG.select(`g[id='rooms_${level}']`);
    const svgRoomID = roomID!.replace(".", "-");
    return {
      floorContainer,
      roomSVG: rooms.select(`rect[id='${svgRoomID}'], path[id='${svgRoomID}']`),
    };
  });
  console.log("Building:", buildingAbbreviation, "Level:", level);
  return { roomSVG, buildingAbbreviation };
};

const extractRoomCoordinates = (roomSVG: any, buildingAbbreviation: string): [number, number] => {
  if (!roomSVG.node()) throw new Error("Raum nicht gefunden");

  const building: any = d3.select(`#${buildingAbbreviation}`);
  if (!building.node()) throw new Error("Gebäude nicht gefunden");

  const translate = building.node().attributes.transform.nodeValue;
  const buildingPosX = parseFloat(translate.split(",")[0].split("(")[1]);
  const buildingPosY = parseFloat(translate.split(",")[1].split(")")[0]);

  const roomBBox = roomSVG.node().getBBox();
  console.log("building", building);

  const targetPositionX = buildingPosX + roomBBox.x + roomBBox.width / 2;
  const targetPositionY = buildingPosY + roomBBox.y + roomBBox.height / 2;
  return [ targetPositionX, targetPositionY ];
};

export { createZoom, initialZoomPosition };

