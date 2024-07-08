import * as d3 from "d3";
import { MutableRefObject } from "react";
import { BuildingInJson, removeRoof } from "./Building.ts";
import { CampusContextAction, CampusContextProps } from "./campus-reducer.ts";
import { switchToInside } from "./Campus.tsx";
import { ParsedRoomID, parseRoomID } from "./Room.ts";

const MIN_ZOOM: number = window.innerWidth * 0.000001;
// const MIN_ZOOM: number = window.innerWidth * 0.00001;
const MAX_ZOOM: number = window.innerWidth * 0.0005;

const START_ZOOM: number = 0.03 as const;
const START_ZOOM_FOR_ROOM: number = 0.04 as const;

const mapCenter: [number, number] = [36000 / 2, 58000 / 2];

// const svgPositionToLngLat = (
//   x: number,
//   y: number,
//   k: number,
//   projection: d3.GeoProjection,
// ): [number, number] => {
//   const viewport = d3.select("#campus-svg");
//   if (viewport.empty()) return [0, 0];

//   const offset_x = (viewport.node() as HTMLElement).getBoundingClientRect().width / 2;
//   const offset_y = (viewport.node() as HTMLElement).getBoundingClientRect().height / 2;
//   const centerX = (1 / k) * (-x + offset_x);
//   const centerY = (1 / k) * (-y + offset_y);
//   return projection.invert!([centerX, centerY]) ?? [0, 0];
// };

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

const createZoom = async(
  campusSVG: any,
  buildingContainer: any,
  projection: d3.GeoProjection,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  roomID: string | undefined,
  initialZoomPositionReached: boolean,
  setInitialZoomPositionReached: (value: boolean) => void,
) => {
  // zoom-creation
  const zoom: any = d3.zoom().on("zoom", (event) => {
    const { transform } = event;
    // const { x, y, k } = transform;
    // const geoCoord: [number, number] = svgPositionToLngLat(x, y, k, projection);
    // stateRef.current.dispatch({ type: "UPDATE_POSITION", position: geoCoord });
    // stateRef.current.dispatch({ type: "UPDATE_ZOOM", zoomFactor: k });
    if (buildingContainer) buildingContainer.attr("transform", transform.toString());
  });
  campusSVG.call(zoom);
  zoom.scaleExtent([MIN_ZOOM, MAX_ZOOM]);

  moveToCampusCenter(stateRef, campusSVG, projection, buildingContainer, async () => {
    if (roomID === undefined) return;
    // const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    // await wait(2000);
    const [targetPositionX, targetPositionY] = (await roomCoordinates(
      roomID,
      initialZoomPositionReached,
      stateRef,
    )) ?? mapCenter;
    console.log("targetPositionX", targetPositionX, "targetPositionY", targetPositionY);
    zoomToPixelPosition(
      campusSVG,
      buildingContainer,
      projection,
      stateRef,
      targetPositionX,
      targetPositionY,
      START_ZOOM_FOR_ROOM,
      1000,
      () => {
        // setInitialZoomPositionReached(true);
      },
    );
  });
  return zoom;
};

const moveToCampusCenter = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  campusSVG: any,
  projection: d3.GeoProjection,
  buildingContainer: any,
  onEndCallback: () => void,
) => {
  const state = stateRef.current.state;
  const campus = state.dataOfCampus.find((c) => c.properties.Name === state.currentCampus);
  // const lngLatOfCurrentCampus: [number, number] = campus!.properties.Location as [number, number];
  // const [centerX, centerY] = lngLatToSvgPosition(lngLatOfCurrentCampus, projection);
  // campusSVG.call(zoom.transform, d3.zoomIdentity.scale(0.03).translate(centerX, centerY));
  zoomToPixelPosition(
    campusSVG,
    buildingContainer,
    projection,
    stateRef,
    36000 / 2,
    58000 / 2 - 5000,
    START_ZOOM,
    0,
    onEndCallback,
  );
};

export const zoomToPixelPosition = (
  campusSVG: any,
  buildingContainer: any,
  projection: d3.GeoProjection,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  targetX: number,
  targetY: number,
  scale: number,
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
  // const geoCoord: [number, number] = projection.invert!([targetX, targetY]) as [number, number];
  // stateRef.current.dispatch({ type: "UPDATE_POSITION", position: geoCoord });
  // stateRef.current.dispatch({ type: "UPDATE_ZOOM", zoomFactor: scale });

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
}

const roomCoordinates = async (
  roomID: string | undefined,
  initialZoomPositionReached: boolean,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
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

  try {
  const {targetPositionX, targetPositionY} = await waitForSVGSelection(`svg[id='${buildingAbbreviation}_${level}']`, 3000)
    .then((floorContainer: any) => {
      const floorSVG = floorContainer.select(`g[id='floor_${level}']`);
      const rooms = floorSVG.select(`g[id='rooms_${level}']`);
      const svgRoomID = roomID!.replace(".", "-");
      console.log("RoomFound!");
      return { floorContainer, roomSVG: rooms.select(`rect[id='${svgRoomID}']`) };
    })
    .then((svgs: any) => {
      const { floorContainer, roomSVG } = svgs;

      if (!roomSVG.node()) throw new Error("Raum nicht gefunden");
      // console.log(roomSVG.node());

      removeRoof(buildingAbbreviation, 200);

      const building: any = d3.select(`#${buildingAbbreviation}`);
      if (!building.node()) throw new Error("Gebäude nicht gefunden");

      const translate = building.node().attributes.transform.nodeValue;
      const buildingPosX = parseFloat(translate.split(",")[0].split("(")[1]);
      const buildingPosY = parseFloat(translate.split(",")[1].split(")")[0]);

      const roomBBox = roomSVG.node().getBBox();
      console.log("building", building);

      const targetPositionX = buildingPosX + roomBBox.x + roomBBox.width / 2;
      const targetPositionY = buildingPosY + roomBBox.y + roomBBox.height / 2;
      // console.log("targetPositionX", targetPositionX, "targetPositionY", targetPositionY);
      return { targetPositionX, targetPositionY };
    });
    return [targetPositionX, targetPositionY];
    } catch (error) {
      console.error("Error while zooming to room:", error);
      return mapCenter;
    }
};

export { createZoom, roomCoordinates as zoomToRoom };

