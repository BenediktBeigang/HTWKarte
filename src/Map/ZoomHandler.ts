import * as d3 from "d3";
import { MutableRefObject } from "react";
import { FinishedBuildings } from "../Constants.ts";
import {
  MissingBuildingException,
  MissingRoomException,
  MissingRoomWithValidBuildingException,
} from "../CustomExceptions.ts";
import { CampusContextAction, CampusContextProps } from "../State/campus-reducer.ts";
import { BuildingInJson, removeRoof, switchToInside } from "./Building.ts";
import { ParsedRoomID, parseRoomID, pingRoom } from "./Room.ts";

const START_ZOOM_CAMPUS = () => {
  if (window.innerWidth < 500) return 0.01;
  if (window.innerWidth < 1000) return 0.02;
  return 0.03;
};

const maxZoom = () => {
  if (window.innerWidth < 500) return 0.4;
  if (window.innerWidth < 1000) return 0.5;
  return 0.6;
};

const START_ZOOM_ROOM = () => {
  if (window.innerWidth < 500) return 0.1;
  if (window.innerWidth < 1000) return 0.15;
  return 0.2;
};

const MIN_ZOOM: number = START_ZOOM_CAMPUS();
const MAX_ZOOM: number = maxZoom();

// const START_ZOOM_FOR_ROOM: number = 0.2 as const;

let PROJECTION: d3.GeoProjection | undefined = undefined;
let ZOOM_BEHAVIOR: d3.ZoomBehavior<Element, unknown> | undefined = undefined;

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
  zoomFactor: number = START_ZOOM_CAMPUS(),
): [number, number] => {
  const viewport = d3.select("#campus-svg");
  if (viewport.empty()) return [0, 0];

  const startSvgPosition = projection(lngLatPosition) ?? [0, 0];
  const scalar = 1 / zoomFactor;
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
) => {
  PROJECTION = projection;
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
  ZOOM_BEHAVIOR = zoom;
  return zoom;
};

export const roomZoomEventHandler = async (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  roomID: string | undefined,
) => {
  let roomSearchResult: any | undefined;
  let targetPosition: [x: number, y: number];

  try {
    if (roomID === undefined) throw new MissingRoomException(`${roomID} is not a known room`);
    if (PROJECTION === undefined) throw new Error("Projection not initialized");

    roomSearchResult = await findRoomInSVG(roomID, stateRef);
    console.log("SVG found:", roomSearchResult);
    if (!roomSearchResult) throw new MissingRoomException(`${roomID} is not a known room`);

    const { roomSVG, buildingAbbreviation, floorSVG, roomsContainer } = roomSearchResult;

    targetPosition = extractRoomCoordinates(
      roomSVG,
      buildingAbbreviation,
      floorSVG,
      roomsContainer,
    );
    removeRoof(roomSearchResult.buildingAbbreviation);

    const campusSVG = d3.select(`#campus-svg`);
    if (campusSVG === undefined) throw new Error("#campus-svg not found");
    const buildingContainer = d3.select(`#buildingContainer`);
    if (buildingContainer === undefined) throw new Error("buildingContainer not found");

    if (targetPosition === undefined) throw new Error("Target position not found");
    if (targetPosition[0] === 0 || targetPosition[1] === 0)
      throw new Error("Target position is 0,0");
    await zoomToPixelPosition(
      campusSVG,
      targetPosition[0],
      targetPosition[1],
      stateRef.current.state.zoomFactor,
      stateRef,
      1000,
      true,
      roomID,
    );
  } catch (error: unknown) {
    if (error instanceof MissingRoomWithValidBuildingException) return;
    if (error instanceof MissingRoomException)
      return stateRef.current.dispatch({
        type: "UPDATE_SNACKBAR_ITEM",
        snackbarItem: {
          message: "Raum nicht gefunden",
          severity: "error",
        },
      });
    if (error instanceof Error) return console.error(error);
  } finally {
    stateRef.current.dispatch({
      type: "UPDATE_INITIAL_ZOOM_REACHED",
      initialZoomReached: true,
    });
  }
};

export const moveToCampusCenter = async (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  campusSVG: any,
) => {
  const state = stateRef.current.state;
  const campus = state.dataOfCampus.find((c) => c.properties.Name === state.currentCampus);
  const { MapWidth, MapHeight } = campus!.properties;
  const xOffset = campus!.properties.CenterXOffset ?? 0;
  const yOffset = campus!.properties.CenterYOffset ?? 0;
  await zoomToPixelPosition(
    campusSVG,
    MapWidth / 2 + xOffset,
    MapHeight / 2 + yOffset,
    START_ZOOM_CAMPUS(),
    stateRef,
    0,
    false,
  );
  stateRef.current.dispatch({
    type: "UPDATE_INITIAL_ZOOM_REACHED",
    initialZoomReached: true,
  });
  stateRef.current.dispatch({
    type: "UPDATE_ROOM_ZOOM_READY",
    roomZoomReady: false,
  });
};

export const moveToBuilding = async (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  campusSVG: any,
  buildingAbbreviation: string,
) => {
  if (!PROJECTION) throw new Error("Projection not initialized");
  if (!buildingAbbreviation)
    throw new MissingBuildingException(`${buildingAbbreviation} is not a known building`);

  const state = stateRef.current.state;

  const building: BuildingInJson | undefined = state.dataOfBuildings.find(
    (b) => b.properties.Abbreviation === buildingAbbreviation,
  );
  const [lng, lat] = building!.properties.Location;
  const [x, y] = lngLatToSvgPosition([lng, lat], PROJECTION, 1);

  await zoomToPixelPosition(campusSVG, -x, -y, START_ZOOM_ROOM(), stateRef, 0, false);
  stateRef.current.dispatch({
    type: "UPDATE_ROOM_ZOOM_READY",
    roomZoomReady: true,
  });
  stateRef.current.dispatch({
    type: "UPDATE_INITIAL_ZOOM_REACHED",
    initialZoomReached: false,
  });
};

export const zoomToPixelPosition = async (
  campusSVG: any,
  targetX: number,
  targetY: number,
  scale: number,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  duration: number = 750,
  roomZoom: boolean = false,
  roomID: string = "",
) => {
  const viewportWidth = campusSVG.node().clientWidth;
  const viewportHeight = campusSVG.node().clientHeight;
  if (!(viewportWidth / 2) || !(viewportHeight / 2) || !PROJECTION) return;

  campusSVG.interrupt();
  const translateX = viewportWidth / 2 - targetX * scale;
  const translateY = viewportHeight / 2 - targetY * scale;
  const transformToNewPosition = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
  // if (buildingZoom) {
  //   transformToNewPosition = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
  // }

  // Update state
  const geoCoord: [number, number] = PROJECTION!.invert!([targetX, targetY]) as [number, number];
  stateRef.current.dispatch({ type: "UPDATE_POSITION", position: geoCoord });
  stateRef.current.dispatch({ type: "UPDATE_ZOOM", zoomFactor: scale });
  console.log("Zoom to:", translateX, translateY, "Scale:", scale, "Zooming to room:", roomZoom);

  if (roomZoom)
    return campusSVG
      .transition()
      .duration(duration)
      .call(ZOOM_BEHAVIOR?.transform as any, transformToNewPosition)
      .on("end", async () => {
        if (roomID) pingRoom(roomID);
        stateRef.current.dispatch({
          type: "UPDATE_INITIAL_ZOOM_REACHED",
          initialZoomReached: true,
        });
      });

  await campusSVG.call(ZOOM_BEHAVIOR?.transform as any, transformToNewPosition);
};

const waitForSVGSelection = async (selector: string, timeoutMs: number) => {
  return new Promise((resolve, reject) => {
    const intervalMs = 100;
    let elapsedMs = 0;

    const intervalId = setInterval(() => {
      const selectedElement = d3.select(selector);
      if (selectedElement !== null) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        console.log("svgSelection found this:", selectedElement);
        resolve(selectedElement);
      } else if (elapsedMs >= timeoutMs) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        console.log("timeout reached");
        reject(new Error("Timeout erreicht, Element nicht gefunden"));
      }
      console.log("Search iteration", elapsedMs);
      elapsedMs += intervalMs;
    }, intervalMs);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      console.log("timeout reached in setTimeout");
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
  const parsedRoomID: ParsedRoomID = parseRoomID(roomID);
  if (parsedRoomID === undefined) throw new MissingRoomException(`${roomID} is not a known room`);
  const { buildingAbbreviation, level, room } = parsedRoomID;
  if (!buildingAbbreviation)
    throw new MissingBuildingException(`${buildingAbbreviation} is not a known building`);
  if (
    buildingAbbreviation &&
    FinishedBuildings.includes(buildingAbbreviation) &&
    !level &&
    level !== 0 &&
    !room
  )
    throw new MissingRoomWithValidBuildingException(
      `${level}${room} is not a known room in ${buildingAbbreviation}`,
    );

  const building: BuildingInJson | undefined = stateRef.current.state.dataOfBuildings.find(
    (building) => building.properties.Abbreviation === buildingAbbreviation,
  );
  if (!building)
    throw new MissingBuildingException(`${buildingAbbreviation} is not a known building`);
  if ((!level && level !== 0) || building.properties.Floors.includes(level) === false)
    throw new MissingRoomException(`Level ${level} is unknown in ${buildingAbbreviation}`);
  switchToInside(stateRef, building, level);

  console.log("Building ready to search");

  const { roomSVG, floorContainer, roomsContainer } = await waitForSVGSelection(
    `svg[id='${buildingAbbreviation}_${level}']`,
    3000,
  ).then((floorContainer: any) => {
    console.log("floorContainer:", floorContainer);
    const floorSVG = floorContainer.select(`g[id='floor_${level}']`);
    const rooms = floorSVG.select(`g[id='rooms_${level}']`);
    const svgRoomID = roomID!.replace(".", "-");
    console.log("after waitForSVGSelection:", floorSVG, rooms);
    return {
      floorContainer,
      roomSVG: rooms.select(`rect[id='${svgRoomID}'], path[id='${svgRoomID}']`),
      roomsContainer: rooms,
    };
  });
  if (roomSVG.empty())
    throw new MissingRoomException(`${room} is not a known room on level ${level}`);
  return { roomSVG, buildingAbbreviation, floorSVG: floorContainer, roomsContainer };
};

const extractRoomCoordinates = (
  roomSVG: any,
  buildingAbbreviation: string,
  floorSVG: any,
  roomsContainer: any,
): [number, number] => {
  if (!roomSVG.node()) throw new Error("Raum nicht gefunden");

  const building: any = d3.select(`#${buildingAbbreviation}`);
  if (!building.node()) throw new Error("Gebäude nicht gefunden");

  const translate = building.node().attributes.transform.nodeValue;
  const buildingPosX = parseFloat(translate.split(",")[0].split("(")[1]);
  const buildingPosY = parseFloat(translate.split(",")[1].split(")")[0]);

  const roomBBox = roomSVG.node().getBBox();
  const floorBBox = floorSVG.node().getBBox();
  const roomsContainerBBox = roomsContainer.node().getBBox();

  const targetPositionX =
    buildingPosX + floorBBox.x + roomsContainerBBox.x + roomBBox.x + roomBBox.width / 2;
  const targetPositionY =
    buildingPosY + floorBBox.y - roomsContainerBBox.y + roomBBox.y + roomBBox.width / 2;
  return [targetPositionX, targetPositionY];
};

export { createZoom, roomZoomEventHandler as initialZoomPosition };
