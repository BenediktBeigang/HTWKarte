import { Box } from "@mui/material";
import * as d3 from "d3";
import $ from "jquery";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FinishedBuildings } from "../Constants";
import { useCampusState } from "../State/campus-context";
import { useBuildingInfo, useCampusInfo } from "../State/Queries";
import RoomMapping from "../State/RoomMapping";
import { drawEntrances, drawNotAccessible, drawParkingLots, drawStreets } from "./MapBackground";
import { BuildingInJson, CampusInJson, ParsedRoomID } from "./MapTypes";
import useBuildingDrawer from "./useBuildingDrawer";
import useCampus from "./useCampus";
import useCampusDrawer from "./useCampusDrawer";
import useRooms from "./useRooms";
import useZoom from "./useZoom";

const Campus = () => {
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const { roomID } = useParams<{ roomID: string }>();
  const { data: campusInfo_data } = useCampusInfo();
  const { data: buildingInfo_data } = useBuildingInfo();
  const { roomZoomEventHandler, createZoom, moveToCampusCenter, moveToBuilding } = useZoom();
  const { updateCurrentBuilding, createProjection } = useCampus();
  const { drawBuildingOutlines } = useCampusDrawer();
  const { drawBuildingsOnCampus } = useBuildingDrawer();
  const { parseRoomID } = useRooms();

  // Update stateRef to provide access to the current state and dispatch function to extracted functions
  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    console.log("Current Building:", state.currentBuilding);
  }, [state.currentBuilding, state.level]);

  useEffect(() => {
    if (!buildingInfo_data || state.roomZoomReady === false) return;
    dispatch({ type: "UPDATE_ROOM_ZOOM_READY", roomZoomReady: false });
    roomZoomEventHandler(roomID, buildingInfo_data);
  }, [buildingInfo_data, dispatch, roomID, state.roomZoomReady]);

  // Update the current building when the position or zoom factor changes
  useEffect(() => {
    if (!buildingInfo_data || state.initialZoomReached === false) return;
    updateCurrentBuilding(buildingInfo_data);
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
    const buildingInfo: BuildingInJson | undefined = buildingInfo_data.find(
      (building: BuildingInJson) => building.properties.Abbreviation === state.currentBuilding,
    );
    if (!buildingInfo) return;
    dispatch({
      type: "UPDATE_BUILDING_INFO",
      dataOfBuilding: buildingInfo,
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

    drawBuildingsOnCampus(buildingContainer, projection, buildingInfo_data);

    drawBuildingOutlines(buildingContainer, projection, buildingInfo_data);
    drawStreets(buildingContainer, projection);
    drawEntrances(buildingContainer, projection);
    drawParkingLots(buildingContainer);
    drawNotAccessible(buildingContainer);

    createZoom(campusSVG, buildingContainer, projection);

    if (!roomID) {
      moveToCampusCenter(campusSVG);
      return;
    }

    const { buildingAbbreviation }: ParsedRoomID = parseRoomID(roomID);

    if (
      !buildingAbbreviation ||
      (buildingAbbreviation && FinishedBuildings.includes(buildingAbbreviation) === false)
    ) {
      moveToCampusCenter(campusSVG);
      stateRef.current.dispatch({
        type: "UPDATE_SNACKBAR_ITEM",
        snackbarItem: { message: "Gebäude nicht gefunden", severity: "error" },
      });
      return;
    }

    const buildingInfo = buildingInfo_data.find(
      (building: BuildingInJson) => building.properties.Abbreviation === buildingAbbreviation,
    );
    if (!buildingInfo) return;

    moveToBuilding(campusSVG, buildingInfo);
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
