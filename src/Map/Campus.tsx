import { Box } from "@mui/material";
import * as turf from "@turf/turf";
import * as d3 from "d3";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import $ from "jquery";
import { MutableRefObject, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FinishedBuildings } from "../Constants";
import { useCampusState } from "../State/campus-context";
import { CampusContextAction, CampusContextProps } from "../State/campus-reducer";
import { useBuildingInfo, useCampusInfo } from "../State/Querys";
import RoomMapping from "../State/RoomMapping";
import {
  BuildingInJson,
  cleanBuilding,
  createBuildings,
  drawBuildingOutlines,
  drawRoof,
  switchToInside,
} from "./Building";
import { drawEntrances, drawParkingLots, drawStreets } from "./MapBackground";
import { ParsedRoomID, parseRoomID } from "./Room";
import {
  createZoom,
  moveToBuilding,
  moveToCampusCenter,
  roomZoomEventHandler,
} from "./ZoomHandler";

const ZOOM_INSIDE_BUILDING_THRESHOLD = () => {
  if (window.innerWidth < 500) return 0.05;
  if (window.innerWidth < 1000) return 0.1;
  return 0.1;
};

export type CampusInJson = {
  type: string;
  properties: {
    Name: string;
    Location: [number, number];
    MapWidth: number;
    MapHeight: number;
    CenterXOffset: number;
    CenterYOffset: number;
  };
  geometry: {
    coordinates: Array<Array<[number, number]>>;
    type: string;
  };
};

const createProjection = (campus: CampusInJson): d3.GeoProjection | undefined => {
  const boundingBox: Feature<Polygon, GeoJsonProperties> = campus as Feature<
    Polygon,
    GeoJsonProperties
  >;

  const projection = d3.geoMercator();
  projection.fitExtent(
    [
      [0, 0],
      [campus.properties.MapWidth, campus.properties.MapHeight],
    ],
    boundingBox,
  );
  return projection;
};

const switchToOutside = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const state = stateRef.current.state;
  cleanBuilding(state.currentBuilding);
  drawRoof(state.currentBuilding, stateRef);
  stateRef.current.dispatch({ type: "UPDATE_BUILDING", currentBuilding: "None" });
  stateRef.current.dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: undefined });
  stateRef.current.dispatch({ type: "UPDATE_LEVEL", level: 0 });
  stateRef.current.dispatch({ type: "UPDATE_ROOM", currentRoomID: "None" });
  stateRef.current.dispatch({ type: "UPDATE_INSIDE_BUILDING", insideBuilding: false });
};

const updateCurrentBuilding = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  completeBuildingInfo: BuildingInJson[],
) => {
  const state = stateRef.current.state;

  if (state.zoomFactor < ZOOM_INSIDE_BUILDING_THRESHOLD()) {
    if (!state.insideBuilding) return;
    switchToOutside(stateRef);
    return;
  }

  const buildingsToUpdate: BuildingInJson[] = completeBuildingInfo.filter((building) =>
    FinishedBuildings.includes(building.properties.Abbreviation),
  );

  buildingsToUpdate.forEach((building: BuildingInJson) => {
    if (!building.properties.Location) return;

    const polygon = turf.polygon(building.geometry.coordinates);
    const point = turf.point(state.position);

    if (
      !turf.booleanPointInPolygon(point, polygon) ||
      building.properties.Abbreviation === state.currentBuilding
    )
      return;

    switchToInside(stateRef, building);
    return;
  });
};

const Campus = () => {
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const { roomID } = useParams<{ roomID: string }>();
  const { data: campusInfo_data } = useCampusInfo();
  const { data: buildingInfo_data } = useBuildingInfo();

  // Update stateRef to provide access to the current state and dispatch function to extracted functions
  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    console.log("Current Building:", state.currentBuilding);
  }, [state.currentBuilding, state.level]);

  useEffect(() => {
    if (!buildingInfo_data || state.roomZoomReady === false) return;
    dispatch({
      type: "UPDATE_ROOM_ZOOM_READY",
      roomZoomReady: false,
    });
    roomZoomEventHandler(stateRef, roomID, buildingInfo_data);
  }, [buildingInfo_data, dispatch, roomID, state.roomZoomReady]);

  // Update the current building when the position or zoom factor changes
  useEffect(() => {
    if (!buildingInfo_data || state.initialZoomReached === false) return;
    updateCurrentBuilding(stateRef, buildingInfo_data);
  }, [buildingInfo_data, state.initialZoomReached, state.position, state.zoomFactor]);

  useEffect(() => {
    if (!campusInfo_data) return;
    dispatch({
      type: "UPDATE_CAMPUS_INFO",
      dataOfCampus: campusInfo_data.find(
        (campus: CampusInJson) => campus.properties.Name === state.currentCampus,
      ),
    });
  }, [campusInfo_data, state.currentCampus, dispatch]);

  useEffect(() => {
    if (!buildingInfo_data || state.currentBuilding === "None") return;
    dispatch({
      type: "UPDATE_BUILDING_INFO",
      dataOfBuilding: buildingInfo_data.find(
        (building: BuildingInJson) => building.properties.Abbreviation === state.currentBuilding,
      ),
    });
  }, [buildingInfo_data, state.currentBuilding, dispatch]);

  // Create the campus map
  useEffect(() => {
    if (state.campusInfo === undefined || buildingInfo_data === undefined) return;
    const CAMPUS_MAP_WIDTH: number = state.campusInfo.properties.MapWidth;
    const CAMPUS_MAP_HEIGHT: number = state.campusInfo.properties.MapHeight;

    $("#campus-container").children().remove();
    const campusSVG = d3
      .select("#campus-container")
      .append("svg")
      .attr("id", "campus-svg")
      .attr("width", CAMPUS_MAP_WIDTH)
      .attr("height", CAMPUS_MAP_HEIGHT)
      .style("width", "100vw")
      .style("height", "100vh");

    const buildingContainer = campusSVG
      .append("g")
      .attr("id", "buildingContainer")
      .attr("width", CAMPUS_MAP_WIDTH)
      .attr("height", CAMPUS_MAP_HEIGHT)
      .style("width", "100%")
      .style("height", "100%");

    const projection: d3.GeoProjection | undefined = createProjection(state.campusInfo);
    if (!projection) return;

    createBuildings(buildingContainer, projection, buildingInfo_data, stateRef);

    drawBuildingOutlines(buildingContainer, projection, buildingInfo_data);
    // drawCampusOutlines(buildingContainer, projection, state.dataOfCampus, state.currentCampus);
    drawStreets(buildingContainer, projection);
    drawEntrances(buildingContainer, projection);
    drawParkingLots(buildingContainer);

    createZoom(campusSVG, buildingContainer, projection, stateRef);

    if (!roomID) {
      moveToCampusCenter(stateRef, campusSVG);
      return;
    }

    const { buildingAbbreviation }: ParsedRoomID = parseRoomID(roomID);

    if (
      !buildingAbbreviation ||
      (buildingAbbreviation && FinishedBuildings.includes(buildingAbbreviation) === false)
    ) {
      moveToCampusCenter(stateRef, campusSVG);
      stateRef.current.dispatch({
        type: "UPDATE_SNACKBAR_ITEM",
        snackbarItem: {
          message: "Gebäude nicht gefunden",
          severity: "error",
        },
      });
      return;
    }

    const buildingInfo = buildingInfo_data.find(
      (building: BuildingInJson) => building.properties.Abbreviation === buildingAbbreviation,
    );
    if (!buildingInfo) return;

    moveToBuilding(stateRef, campusSVG, buildingInfo);
  }, [buildingInfo_data, roomID, state.campusInfo, state.currentCampus]);

  // print zoom factor and position in console
  // useEffect(() => {
  //   console.log("Zoom Factor:", state.zoomFactor, "Position:", state.position);
  // }, [state.position, state.zoomFactor]);

  return (
    <>
      <Box id="campus-container" style={{ width: "100%", height: "100%" }}></Box>
      <RoomMapping />
    </>
  );
};

export default Campus;
