import { Box, SnackbarCloseReason } from "@mui/material";
import * as turf from "@turf/turf";
import * as d3 from "d3";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import $ from "jquery";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BuildingInJson,
  cleanBuilding,
  createBuildings,
  drawBuildingOutlines,
  drawRoof,
  loadBuilding,
  removeRoof,
} from "./Building";
import { useCampusState } from "./campus-context";
import { CampusContextAction, CampusContextProps } from "./campus-reducer";
import { HTWKALENDER_GRAY } from "./Color";
import { FinishedBuildings } from "./Constants";
import { ParsedRoomID, parseRoomID } from "./Room";
import { createZoom, zoomToRoom } from "./ZoomHandler";

const ZOOM_INSIDE_BUILDING_THRESHOLD: number = 0.00008 * window.innerWidth;

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

export const switchToInside = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  building: BuildingInJson,
  level: number = 0,
) => {
  stateRef.current.dispatch({
    type: "UPDATE_BUILDING",
    currentBuilding: building.properties.Abbreviation,
  });
  const newLevelCount = (building.properties.Floors.length ?? 0) - 1;
  stateRef.current.dispatch({ type: "UPDATE_LEVEL", level });
  stateRef.current.dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: newLevelCount });
  stateRef.current.dispatch({ type: "UPDATE_INSIDE_BUILDING", insideBuilding: true });
  loadBuilding(building.properties.Abbreviation, level, stateRef);
};

const updateCurrentBuilding = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const state = stateRef.current.state;

  if (state.zoomFactor < ZOOM_INSIDE_BUILDING_THRESHOLD) {
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
  const [alertOpen, setAlertOpen] = useState(false);
  const { roomID } = useParams<{ roomID: string }>();
  const [initialZoomPositionReached, setInitialZoomPositionReached] = useState(false);

  const handleClose = (
    _event?: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  // Update stateRef to provide access to the current state and dispatch function to extracted functions
  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    console.log("Current Building:", state.currentBuilding);
  }, [state.currentBuilding, state.level]);

  // Update the current building when the position or zoom factor changes
  useEffect(() => {
    if (initialZoomPositionReached === false) return;
    updateCurrentBuilding(stateRef);
  }, [initialZoomPositionReached, state.position, state.zoomFactor]);

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

    const zoom: any = createZoom(campusSVG, buildingContainer, projection, stateRef);

    zoomToRoom(roomID, initialZoomPositionReached, stateRef, zoom, projection);
  }, [CAMPUS_MAP_HEIGHT, CAMPUS_MAP_WIDTH, initialZoomPositionReached, roomID, state.dataOfBuildings, state.dataOfCampus]);

  const abortZoomToRoom = () => {
    setInitialZoomPositionReached(true);
    switchToOutside(stateRef);
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

  // const zoomToRoom = async (campusSVG: any, zoom: any) => {
  //   await campusSVG
  //     .transition()
  //     .duration(1500)
  //     .call(zoom.transform, d3.zoomIdentity.translate(1, 1).scale(2));
  //   const currentTransform = d3.zoomTransform(campusSVG.node() as SVGSVGElement);
  //   console.log("Current Transform:", currentTransform);
  // };

  useEffect(() => {
    return;
    setInitialZoomPositionReached(true);
    if (initialZoomPositionReached || !roomID) return;
    const parsedRoomID: ParsedRoomID | undefined = parseRoomID(roomID);
    if (parsedRoomID === undefined) return;
    const { buildingAbbreviation, level } = parsedRoomID;
    const building: BuildingInJson | undefined = state.dataOfBuildings.find(
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
        return rooms.select(`rect[id='${svgRoomID}']`);
      })
      .then((roomSVG: any) => {
        const test = async () => {
          if (!roomSVG.node()) throw new Error("Raum nicht gefunden");

          removeRoof(buildingAbbreviation, 200);

          const roomBBox = roomSVG.node().getBBox();
          const targetPositionX = roomBBox.x + roomBBox.width / 2;
          const targetPositionY = roomBBox.y + roomBBox.height / 2;

          const campusSVG = d3.select<SVGSVGElement, unknown>("#campus-svg");
          const zoom = d3.zoom<SVGSVGElement, unknown>();
          const START_ZOOM: number = 1 as const;

          console.log(campusSVG.node());

          const newTransform = d3.zoomIdentity
            .translate(
              // window.innerWidth / 2 - targetPositionX * START_ZOOM,
              // window.innerHeight / 2 - targetPositionY * START_ZOOM,
              0,
              0,
            )
            .scale(START_ZOOM);

          const currentTransform = d3.zoomTransform(campusSVG.node() as SVGSVGElement);
          console.log("Current Transform:", currentTransform);
          console.log("Zooming to:", { targetPositionX, targetPositionY });
          console.log("New Transform:", newTransform);

          // campusSVG
          // .transition()
          // .duration(1500)
          // .call((t) => zoom.transform(t, newTransform));
          // .call(zoom.transform, d3.zoomIdentity.translate(100,100).scale(2));

          await zoomToRoom(campusSVG, zoom);
        };
        // test();
      })
      .finally(() => {
        // async () => {
        //   const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        //   await wait(3000);
        //   console.log("finish");
        //   // setInitialZoomPositionReached(true);
        //   const projection: d3.GeoProjection | undefined = createProjection(
        //     "Campus-Karl-Liebknecht-Strasse",
        //     stateRef,
        //   );
        //   if (!projection) return;
        //   // createZoom(d3.select("#campus-svg"), d3.select("#buildingContainer"), projection, stateRef);
        // };
      })
      .catch((error) => {
        console.error(error.message);
        abortZoomToRoom();
      });
  }, [initialZoomPositionReached, roomID, state.dataOfBuildings]);

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
