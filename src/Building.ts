import * as d3 from "d3";
import { MutableRefObject } from "react";
import buildingFactory from "./BuildingFactory";
import { HTWK_LIGHT_TEXT } from "./Color";
import { getFontSizeOfRoom, getRoomName, roomClickedHandler } from "./Room";
import { CampusContextAction, CampusContextProps } from "./campus-reducer";

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
    TextYOffset: number;
    Campus: string;
  };
  geometry: {
    coordinates: Array<Array<[number, number]>>;
    type: string;
  };
};

export const fullBuildingName = (abbreviation: string, buildingData: BuildingInJson[]) => {
  const building = buildingData.find(
    (building) => building.properties.Abbreviation === abbreviation,
  );
  return building ? building.properties.Name : "";
};

export const adressOfBuilding = (abbreviation: string, buildingData: BuildingInJson[]) => {
  const building = buildingData.find(
    (building) => building.properties.Abbreviation === abbreviation,
  );
  return building ? building.properties.Address : "";
};

export const cleanBuilding = (buildingAbbreviation: string) => {
  const buildingSVG = d3.select(`#${buildingAbbreviation}`);
  if (!buildingSVG) return;
  buildingSVG.selectAll("*").remove();
  return buildingSVG;
};

export const switchFloor = (buildingAbbreviation: string, newLevel: number, oldLevel: number) => {
  const newFloor = d3.select(`#${buildingAbbreviation}_${newLevel}`);
  const oldFloor = d3.select(`#${buildingAbbreviation}_${oldLevel}`);
  if (!newFloor || !oldFloor) return;
  oldFloor.transition().duration(200).style("opacity", 0);
  oldFloor.style("pointer-events", "none");
  newFloor.transition().duration(200).style("opacity", 1);
  newFloor.style("pointer-events", "auto");
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
  const rooms = Array.from(
    floor
      .selectAll(`g[id='floor_${level}'] > g[id='rooms_${level}'] *[id*='${buildingAbbreviation}']`)
      .nodes(),
  );

  const yOffset =
    stateRef.current.state.dataOfBuildings.find(
      (b) => b.properties.Abbreviation === buildingAbbreviation,
    )?.properties.TextYOffset ?? 0;

  rooms.forEach((room: any) => {
    const room_d3 = d3.select(room);
    const roomID: string = room_d3.attr("id");
    room_d3.on("click", function () {
      roomClickedHandler(roomID, stateRef);
    });
    const roomBBox = room.getBBox();
    const roomCenterX: number = roomBBox.x + roomBBox.width / 2;
    const roomCenterY: number = roomBBox.y + roomBBox.height / 2;

    const roomName = getRoomName(roomID, stateRef.current.state.dataOfRooms);
    const [firstPart, secondPart] = roomName.split("\n");

    const textElement = floor
      .append("text")
      .attr("x", roomCenterX)
      .attr("y", roomCenterY + yOffset)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", getFontSizeOfRoom(roomBBox.width, roomBBox.height, roomName))
      .attr("font-family", "Source Sans Pro, sans-serif")
      .attr("fill", HTWK_LIGHT_TEXT)
      .attr("opacity", 0.65)
      .attr("font-weight", 1000)
      .style("cursor", "default");
    textElement.append("tspan").attr("x", roomCenterX).attr("dy", "0em").text(firstPart);
    textElement.append("tspan").attr("x", roomCenterX).attr("dy", "1em").text(secondPart);
    textElement.on("click", function () {
      roomClickedHandler(roomID, stateRef);
    });
  });
};

export const loadBuilding = (
  buildingAbbreviation: string,
  startFloor: number,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const state = stateRef.current.state;

  const pathToFloors = buildingFactory.getBuilding(buildingAbbreviation);
  if (!pathToFloors) return;

  const buildingInData: any = state.dataOfBuildings.find(
    (b) => b.properties.Abbreviation === buildingAbbreviation,
  );
  const levels: number[] = buildingInData.properties.Floors;
  if (!levels) return;

  const buildingSVG = cleanBuilding(buildingAbbreviation);
  const oldBuildingSVG = cleanBuilding(state.currentBuilding);
  if (!buildingSVG || !oldBuildingSVG) return;

  drawRoof(state.currentBuilding, oldBuildingSVG);

  pathToFloors.forEach((floor, index) => {
    const level = levels[index];
    if (!level && level != 0) return;

    d3.xml(floor).then((xmlData: XMLDocument) => {
      const floorSVG_data = document.importNode(xmlData.documentElement, true);
      const floorContainer = d3.select(buildingSVG.node()).append(() => floorSVG_data);
      floorContainer.attr("id", `${buildingAbbreviation}_${level}`);
      const floor = d3.select(`#${buildingAbbreviation}_${level}`);
      floor.style("opacity", 0);
      floor.style("pointer-events", "none");
      prepareRooms(level, buildingAbbreviation, stateRef);
      if (level === startFloor) {
        floor.transition().duration(200).style("opacity", 1);
        floor.style("pointer-events", "auto");
      }
    });
  });
};

export const drawRoof = (buildingAbbreviation: string, buildingSVG: any = null) => {
  if (!buildingSVG) buildingSVG = d3.select(`#${buildingAbbreviation}`);

  const pathToRoof = buildingFactory.getRoof(buildingAbbreviation);
  if (!pathToRoof) return;

  d3.xml(pathToRoof).then((xmlData: XMLDocument) => {
    const floorSVG_data = document.importNode(xmlData.documentElement, true);
    const floorSVG = d3.select(buildingSVG.node()).append(() => floorSVG_data);
    floorSVG.attr("id", `${buildingAbbreviation}_roof`);
    floorSVG.style("opacity", 0);
    floorSVG.transition().duration(200).style("opacity", 1);
  });
};

const drawBuilding = (
  buildingAbbreviation: string,
  buildingSVG: any,
  location: number[],
  projection: d3.GeoProjection,
) => {
  const pathToRoof = buildingFactory.getRoof(buildingAbbreviation);
  if (!buildingSVG || !pathToRoof || location.length !== 2) return;

  drawRoof(buildingAbbreviation, buildingSVG);

  const pixelLocation = projection([location[0], location[1]]);
  if (!pixelLocation) return;
  buildingSVG.attr("transform", `translate(${pixelLocation[0]}, ${pixelLocation[1]})`);
};

export const createBuildings = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
  dataOfBuildings: BuildingInJson[],
) => {
  dataOfBuildings.map((building) => {
    if (
      !buildingContainer ||
      !building.properties.FloorCount ||
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
      building.properties.Abbreviation === "GU" ||
      building.properties.Abbreviation === "ZU"
    )
      return;
    const polygon = building.geometry.coordinates[0].map((coord) => {
      return projection([coord[0], coord[1]]);
    });

    buildingContainer
      .append("polygon")
      .attr("points", polygon.join(" "))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 20)
      .attr("stroke-linejoin", "round");
  });
};
