import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import * as turf from "@turf/turf";
import * as d3 from "d3";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import $ from "jquery";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  cleanBuilding,
  createBuildings,
  drawBuildingOutlines,
  drawRoof,
  loadBuilding,
} from "./Building";
import { useCampusState } from "./campus-context";
import { CampusContextAction, CampusContextProps } from "./campus-reducer";
import { HTWK_GRAY } from "./Color";
import { createZoom } from "./ZoomHandler";

// const CAMPUS_MAP_WIDTH: number = 36000 as const;
// const CAMPUS_MAP_HEIGHT: number = 58000 as const;
const ZOOM_INSIDE_BUILDING_THRESHOLD: number = 0.0001 * window.innerWidth;

export type CampusInJson = {
  type: string;
  properties: {
    Name: string;
    Location: [number, number];
    MapWidth: number;
    MapHeight: number;
  };
  geometry: {
    coordinates: Array<Array<[number, number]>>;
    type: string;
  };
};

function createGrid(svg: any, width: number, height: number, gridSpacing: number) {
  const xLines = d3.range(0, width + 1, gridSpacing);
  const yLines = d3.range(0, height + 1, gridSpacing);

  const grid = svg.append("g").attr("id", "grid");

  xLines.forEach((x) => {
    grid
      .append("line")
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", height)
      .style("stroke", "#ffffff77")
      .style("stroke-width", "5");
  });

  yLines.forEach((y) => {
    grid
      .append("line")
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", width)
      .attr("y2", y)
      .style("stroke", "#ffffff77")
      .style("stroke-width", "5");
  });
}

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

const updateCurrentBuilding = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const state = stateRef.current.state;

  if (state.zoomFactor < ZOOM_INSIDE_BUILDING_THRESHOLD) {
    cleanBuilding(state.currentBuilding);
    drawRoof(state.currentBuilding);
    stateRef.current.dispatch({ type: "UPDATE_BUILDING", currentBuilding: "None" });
    stateRef.current.dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: -1 });
    stateRef.current.dispatch({ type: "UPDATE_LEVEL", level: 0 });
    stateRef.current.dispatch({ type: "UPDATE_ROOM", currentRoomID: "None" });
    return;
  }

  state.dataOfBuildings.forEach((building) => {
    if (!building.properties.Location) return;

    const polygon = turf.polygon(building.geometry.coordinates);
    const point = turf.point(state.position);

    if (
      !turf.booleanPointInPolygon(point, polygon) ||
      building.properties.Abbreviation === state.currentBuilding
    ) {
      return;
    }

    stateRef.current.dispatch({
      type: "UPDATE_BUILDING",
      currentBuilding: building.properties.Abbreviation,
    });
    const newLevelCount = (building.properties.FloorCount ?? 0) - 1;
    stateRef.current.dispatch({ type: "UPDATE_LEVEL", level: 0 });
    stateRef.current.dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: newLevelCount });
    loadBuilding(building.properties.Abbreviation, 0, stateRef);
  });
};

const Campus = () => {
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const [alertOpen, setAlertOpen] = useState(false);

  const handleClose = (
    _event?: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  // use routerparams to get the roomID
  const { roomID } = useParams<{ roomID: string }>();

  // Update stateRef to provide access to the current state and dispatch function to extracted functions
  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  // Update the current building when the position or zoom factor changes
  useEffect(() => {
    updateCurrentBuilding(stateRef);
  }, [state.position, state.zoomFactor]);

  // const campus: string = campusOfRoom(roomID, state.dataOfBuildings);

  const CAMPUS_MAP_WIDTH: number = 36000 as const;
  const CAMPUS_MAP_HEIGHT: number = 58000 as const;

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

    createGrid(buildingContainer, CAMPUS_MAP_WIDTH, CAMPUS_MAP_HEIGHT, 1000);

    createBuildings(buildingContainer, projection, state.dataOfBuildings);

    drawBuildingOutlines(buildingContainer, projection, state.dataOfBuildings);

    createZoom(campusSVG, buildingContainer, projection, stateRef);
  }, [roomID, state.dataOfBuildings, state.dataOfCampus]);

  return (
    <>
      <div
        id="campus-container"
        style={{ width: "100%", height: "100%", backgroundColor: HTWK_GRAY }}
      ></div>
      <Snackbar
        key={`${roomID}-${Date.now()}`}
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {alertOpen ? (
          <Alert severity="warning">Raum {roomID} ist keinem Gebäude zuzuordnen.</Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
};

export default Campus;
