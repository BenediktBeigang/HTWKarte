import * as d3 from "d3";
import { MutableRefObject } from "react";
import { FinishedBuildings } from "../Constants";
import { CampusContextAction, CampusContextProps } from "../State/campus-reducer";
import { CampusInJson } from "./Campus";
import { roomClickedHandler } from "./Room";

export type BuildingInJson = {
  type: string;
  properties: {
    Name: string;
    Abbreviation: string;
    Location: [number, number];
    Location_SVG: [number, number];
    Address: string;
    FloorCount: number;
    Floors: [number];
    TextXOffset: number;
    TextYOffset: number;
    Campus: string;
    Janitor: string;
    Description: string;
  };
  geometry: {
    coordinates: Array<Array<[number, number]>>;
    type: string;
  };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const removeRoof = async (buildingAbbreviation: string, delay: number = 0) => {
  if (delay > 0) await wait(delay);
  const buildingSVG = d3.select(`#${buildingAbbreviation}`);
  if (!buildingSVG) return;
  buildingSVG.selectAll(`#${buildingAbbreviation}_roof`).remove();
  return buildingSVG;
};

export const cleanBuilding = (buildingAbbreviation: string) => {
  const buildingSVG = d3.select(`#${buildingAbbreviation}`);
  if (!buildingSVG) return;
  buildingSVG.selectAll("*").remove();
  return buildingSVG;
};

const prepareRooms = (
  level: number,
  buildingAbbreviation: string,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const floor = d3.select(`#${buildingAbbreviation}_${level}`);
  floor.selectAll("path[id^='roomNames_']").attr("pointer-events", "none");

  const rooms = Array.from(
    floor
      .selectAll(
        `g[id='floor_${level}'] > g[id='rooms_${level}'] *[id*='${buildingAbbreviation.replace("Ö", "O")}']`,
      )
      .nodes(),
  );

  rooms.forEach((room: any) => {
    const room_d3 = d3.select(room);
    const roomID: string = room_d3.attr("id");
    room_d3.on("click", function () {
      roomClickedHandler(roomID, stateRef);
    });

    return;
  });
};

export const switchToFloor = (
  buildingAbbreviation: string,
  newLevel: number,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  cleanBuilding(buildingAbbreviation);
  if (buildingAbbreviation === "None" || !buildingAbbreviation) return;

  const pathToFloor = `/Buildings/${buildingAbbreviation}/${buildingAbbreviation}_${newLevel}.svg`;
  const buildingSVG = d3.select(`#${buildingAbbreviation}`);
  if (!buildingSVG) return;

  d3.xml(pathToFloor).then((xmlData: XMLDocument) => {
    const floorSVG_data = document.importNode(xmlData.documentElement, true);
    const floorContainer = d3.select(buildingSVG.node()).append(() => floorSVG_data);
    floorContainer.attr("id", `${buildingAbbreviation}_${newLevel}`);
    const floor = d3.select(`#${buildingAbbreviation}_${newLevel}`);
    floor.style("opacity", 0);
    floor.style("pointer-events", "none");
    prepareRooms(newLevel, buildingAbbreviation, stateRef);
    floor.transition().duration(200).style("opacity", 1);
    floor.style("pointer-events", "auto");
  });
};

export const loadBuilding = (
  buildingAbbreviation: string,
  buildingInfo: BuildingInJson,
  startFloor: number,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  if (!buildingInfo.properties.Floors) return;
  const state = stateRef.current.state;

  cleanBuilding(buildingAbbreviation);
  cleanBuilding(state.currentBuilding);

  drawRoof(state.currentBuilding, stateRef);
  switchToFloor(buildingAbbreviation, startFloor, stateRef);
};

export const drawRoof = (
  buildingAbbreviation: string,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  if (!buildingAbbreviation || buildingAbbreviation === "None") return;
  const buildingSVG = d3.select(`#${buildingAbbreviation}`);
  const pathToRoof = `/Buildings/${buildingAbbreviation}/${buildingAbbreviation}_Roof.svg`;
  d3.xml(pathToRoof).then((xmlData: XMLDocument) => {
    const floorSVG_data = document.importNode(xmlData.documentElement, true);
    const floorSVG = d3.select(buildingSVG.node()).append(() => floorSVG_data);
    try {
      floorSVG.attr("id", `${buildingAbbreviation}_roof`);
      floorSVG.style("opacity", 0);
      floorSVG.transition().duration(200).style("opacity", 1);
      floorSVG.on("click", () => {
        stateRef.current.dispatch({
          type: "UPDATE_FOCUSED_BUILDING",
          focusedBuilding: buildingAbbreviation,
        });
      });
    } catch (e) {
      return;
    }
  });
};

const drawBuilding = (
  buildingAbbreviation: string,
  buildingSVG: any,
  location: number[],
  projection: d3.GeoProjection,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  if (!buildingSVG || location.length !== 2) return;

  drawRoof(buildingAbbreviation, stateRef);

  const pixelLocation = projection([location[0], location[1]]);
  if (!pixelLocation) return;
  buildingSVG.attr("transform", `translate(${pixelLocation[0]}, ${pixelLocation[1]})`);
};

export const createBuildings = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
  dataOfBuildings: BuildingInJson[],
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  dataOfBuildings.map((building) => {
    if (
      !buildingContainer ||
      !building.properties.Abbreviation ||
      !building.properties.Location_SVG
    )
      return;
    const nextBuildingSVG = buildingContainer
      .append("g")
      .attr("id", building.properties.Abbreviation);
    drawBuilding(
      building.properties.Abbreviation,
      nextBuildingSVG,
      building.properties.Location_SVG,
      projection,
      stateRef,
    );
  });
};

export const drawBuildingOutlines = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
  dataOfBuildings: BuildingInJson[],
) => {
  dataOfBuildings.map((building) => {
    if (
      !buildingContainer ||
      !building.geometry.coordinates ||
      building.geometry.coordinates.length === 0 ||
      FinishedBuildings.includes(building.properties.Abbreviation) ||
      building.properties.Abbreviation === "MN"
    )
      return;
    const polygon = building.geometry.coordinates[0].map((coord) => {
      return projection([coord[0], coord[1]]);
    });

    buildingContainer
      .append("polygon")
      .attr("points", polygon.join(" "))
      .attr("fill", "#393e3f")
      .attr("stroke-width", 20)
      .attr("stroke-linejoin", "round");
  });
};

export const drawCampusOutlines = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
  dataOfCampus: CampusInJson[],
  campusName: string,
) => {
  // find right campus and draw it
  const campus = dataOfCampus.find((c) => c.properties.Name === campusName);
  if (!campus || !campus.geometry.coordinates) return;
  const polygon = campus.geometry.coordinates[0].map((coord) => {
    return projection([coord[0], coord[1]]);
  });

  buildingContainer
    .append("polygon")
    .attr("points", polygon.join(" "))
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 100)
    .attr("stroke-linejoin", "round");
};

export const drawCampusMarker = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  marker: [number, number],
) => {
  buildingContainer
    .append("circle")
    .attr("cx", marker[0])
    .attr("cy", marker[1])
    .attr("r", 20)
    .attr("fill", "red");
};

export const switchToInside = (
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  buildingInfo: BuildingInJson,
  level: number = 0,
) => {
  stateRef.current.dispatch({
    type: "UPDATE_BUILDING",
    currentBuilding: buildingInfo.properties.Abbreviation,
  });
  const newLevelCount = buildingInfo.properties.Floors.length ?? 0;
  stateRef.current.dispatch({ type: "UPDATE_LEVEL", level });
  stateRef.current.dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: newLevelCount });
  stateRef.current.dispatch({ type: "UPDATE_INSIDE_BUILDING", insideBuilding: true });
  loadBuilding(buildingInfo.properties.Abbreviation, buildingInfo, level, stateRef);
};
