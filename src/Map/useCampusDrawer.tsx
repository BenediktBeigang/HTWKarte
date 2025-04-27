import { FinishedBuildings, LNC_BUILDINGS, LncBuildingType } from "../Constants";
import { useCampusState } from "../State/campus-context";
import { BuildingInJson, CampusInJson } from "./MapTypes";

const useCampusDrawer = () => {
  const [state] = useCampusState();

  const drawBuildingOutlines = (
    buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    projection: d3.GeoProjection,
    dataOfBuildings: BuildingInJson[],
  ) => {
    dataOfBuildings.map((building) => {
      if (
        !buildingContainer ||
        !building.geometry.coordinates ||
        building.geometry.coordinates.length === 0 ||
        (state.lncMode === false && FinishedBuildings.includes(building.properties.Abbreviation)) ||
        building.properties.Abbreviation === "MN"
      )
        return;
      if (
        state.lncMode &&
        LNC_BUILDINGS.includes(building.properties.Abbreviation as LncBuildingType)
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

  const drawCampusOutlines = (
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

  const drawCampusMarker = (
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

  return { drawBuildingOutlines, drawCampusOutlines, drawCampusMarker };
};

export default useCampusDrawer;
