import { Box } from "@mui/material";
import * as turf from "@turf/turf";
import * as d3 from "d3";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import $ from "jquery";
import { MutableRefObject, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  BuildingInJson,
  cleanBuilding,
  createBuildings,
  drawBuildingOutlines,
  drawRoof,
  switchToInside,
} from "./Building";
import { useCampusState } from "./campus-context";
import { CampusContextAction, CampusContextProps } from "./campus-reducer";
import { HTWKALENDER_GRAY } from "./Color";
import { FinishedBuildings } from "./Constants";
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

const createProjection = (
  campusName: string,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
  }>,
): d3.GeoProjection | undefined => {
  const state = stateRef.current.state;
  const campus = state.dataOfCampus.find((campusData) => campusData.properties.Name === campusName);
  const boundingBox: Feature<Polygon, GeoJsonProperties> = campus as Feature<
    Polygon,
    GeoJsonProperties
  >;
  if (!campus || !campus.properties.MapWidth || !campus.properties.MapHeight) return undefined;

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
  drawRoof(state.currentBuilding);
  stateRef.current.dispatch({ type: "UPDATE_BUILDING", currentBuilding: "None" });
  stateRef.current.dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: -1 });
  stateRef.current.dispatch({ type: "UPDATE_LEVEL", level: 0 });
  stateRef.current.dispatch({ type: "UPDATE_ROOM", currentRoomID: "None" });
  stateRef.current.dispatch({ type: "UPDATE_INSIDE_BUILDING", insideBuilding: false });
};

const updateCurrentBuilding = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const state = stateRef.current.state;

  if (state.zoomFactor < ZOOM_INSIDE_BUILDING_THRESHOLD()) {
    if (!state.insideBuilding) return;
    switchToOutside(stateRef);
    return;
  }

  const buildingsToUpdate: BuildingInJson[] = state.dataOfBuildings.filter((building) =>
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

  // Update stateRef to provide access to the current state and dispatch function to extracted functions
  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    console.log("Current Building:", state.currentBuilding);
  }, [state.currentBuilding, state.level]);

  useEffect(() => {
    if (state.roomZoomReady === false) return;
    dispatch({
      type: "UPDATE_ROOM_ZOOM_READY",
      roomZoomReady: false,
    });
    roomZoomEventHandler(stateRef, roomID);
  }, [dispatch, roomID, state.roomZoomReady]);

  // Update the current building when the position or zoom factor changes
  useEffect(() => {
    if (state.initialZoomReached === false) return;
    updateCurrentBuilding(stateRef);
  }, [state.initialZoomReached, state.position, state.zoomFactor]);

  // Get the campus map width and height
  const campus = state.dataOfCampus.find(
    (campus) => campus.properties.Name === state.currentCampus,
  )?.properties;
  const CAMPUS_MAP_WIDTH: number = campus ? campus.MapWidth : 0;
  const CAMPUS_MAP_HEIGHT: number = campus ? campus.MapHeight : 0;

  // Create the campus map
  useEffect(() => {
    if (state.dataOfCampus.length === 0) return;
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

    const projection: d3.GeoProjection | undefined = createProjection(
      "Campus-Karl-Liebknecht-Strasse",
      stateRef,
    );
    if (!projection) return;

    createBuildings(buildingContainer, projection, state.dataOfBuildings);

    drawBuildingOutlines(buildingContainer, projection, state.dataOfBuildings);
    // drawCampusOutlines(buildingContainer, projection, state.dataOfCampus, state.currentCampus);

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
    moveToBuilding(stateRef, campusSVG, buildingAbbreviation);
  }, [
    CAMPUS_MAP_HEIGHT,
    CAMPUS_MAP_WIDTH,
    roomID,
    state.currentCampus,
    state.dataOfBuildings,
    state.dataOfCampus,
  ]);

  // print zoom factor and position in console
  // useEffect(() => {
  //   console.log("Zoom Factor:", state.zoomFactor, "Position:", state.position);
  // }, [state.position, state.zoomFactor]);

  return (
    <>
      <Box
        id="campus-container"
        style={{ width: "100%", height: "100%", backgroundColor: HTWKALENDER_GRAY }}
      ></Box>
      {/* <Snackbar
        key={`${roomID}-${Date.now()}`}
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {alertOpen ? (
          <Alert severity="warning">Raum {roomID} ist keinem Gebäude zuzuordnen.</Alert>
        ) : undefined}
      </Snackbar> */}
    </>
  );
};

export default Campus;
