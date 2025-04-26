import * as turf from "@turf/turf";
import * as d3 from "d3";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import { FinishedBuildings } from "../Constants";
import { useCampusState } from "../State/campus-context";
import { BuildingInJson, CampusInJson } from "./MapTypes";
import useBuildingDrawer from "./useBuildingDrawer";
import useRoofDrawer from "./useRoofDrawer";

const useCampus = () => {
  const [state, dispatch] = useCampusState();
  const { cleanBuilding, switchToInside } = useBuildingDrawer();
  const { drawRoof } = useRoofDrawer();

  const ZOOM_INSIDE_BUILDING_THRESHOLD = () => {
    if (window.innerWidth < 500) return 0.05;
    if (window.innerWidth < 1000) return 0.1;
    return 0.1;
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

  const switchToOutside = () => {
    cleanBuilding(state.currentBuilding);
    drawRoof(state.currentBuilding);
    dispatch({ type: "UPDATE_BUILDING", currentBuilding: "None" });
    dispatch({ type: "UPDATE_LEVEL_COUNT", levelCount: undefined });
    dispatch({ type: "UPDATE_LEVEL", level: 0 });
    dispatch({ type: "UPDATE_ROOM", currentRoomID: "None" });
    dispatch({ type: "UPDATE_INSIDE_BUILDING", insideBuilding: false });
  };

  const updateCurrentBuilding = (completeBuildingInfo: BuildingInJson[]) => {
    if (state.zoomFactor < ZOOM_INSIDE_BUILDING_THRESHOLD()) {
      if (!state.insideBuilding) return;
      switchToOutside();
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

      switchToInside(building);
      return;
    });
  };

  return { updateCurrentBuilding, createProjection };
};

export default useCampus;
