import * as d3 from "d3";
import { useCampusState } from "../State/campus-context";
import { BuildingInJson } from "./MapTypes";
import useRoofDrawer from "./useRoofDrawer";
import useRooms from "./useRooms";

const useBuildingDrawer = () => {
  const [state, dispatch] = useCampusState();
  const { drawRoof } = useRoofDrawer();
  const { roomClickedHandler } = useRooms();

  const prepareRooms = (level: number, buildingAbbreviation: string) => {
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
        roomClickedHandler(roomID);
      });

      return;
    });
  };

  const switchToFloor = (buildingAbbreviation: string, newLevel: number) => {
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
      prepareRooms(newLevel, buildingAbbreviation);
      floor.transition().duration(200).style("opacity", 1);
      floor.style("pointer-events", "auto");
    });
  };

  const loadBuilding = (
    buildingAbbreviation: string,
    buildingInfo: BuildingInJson,
    startFloor: number,
  ) => {
    if (!buildingInfo.properties.Floors) return;

    cleanBuilding(buildingAbbreviation);
    cleanBuilding(state.currentBuilding);

    drawRoof(state.currentBuilding);
    switchToFloor(buildingAbbreviation, startFloor);
  };

  const switchToInside = (buildingInfo: BuildingInJson, level: number = 0) => {
    dispatch({ type: "UPDATE_BUILDING", currentBuilding: buildingInfo.properties.Abbreviation });
    const newLevelCount = buildingInfo.properties.Floors.length ?? 0;
    dispatch({ type: "UPDATE_LEVEL", level });
    dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: newLevelCount });
    dispatch({ type: "UPDATE_INSIDE_BUILDING", insideBuilding: true });
    loadBuilding(buildingInfo.properties.Abbreviation, buildingInfo, level);
  };

  const drawBuilding = (
    buildingAbbreviation: string,
    buildingSVG: any,
    location: number[],
    projection: d3.GeoProjection,
  ) => {
    if (!buildingSVG || location.length !== 2) return;

    drawRoof(buildingAbbreviation);

    const pixelLocation = projection([location[0], location[1]]);
    if (!pixelLocation) return;
    buildingSVG.attr("transform", `translate(${pixelLocation[0]}, ${pixelLocation[1]})`);
  };

  const drawBuildingsOnCampus = (
    buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    projection: d3.GeoProjection,
    dataOfBuildings: BuildingInJson[],
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
      );
    });
  };

  const cleanBuilding = (buildingAbbreviation: string) => {
    const buildingSVG = d3.select(`#${buildingAbbreviation}`);
    if (!buildingSVG) return;
    buildingSVG.selectAll("*").remove();
    return buildingSVG;
  };

  return { switchToInside, cleanBuilding, drawBuildingsOnCampus, switchToFloor };
};

export default useBuildingDrawer;
