import * as d3 from "d3";
import { useCampusState } from "../State/campus-context";

const useRoofDrawer = () => {
  const [, dispatch] = useCampusState();

  const drawRoof = (buildingAbbreviation: string) => {
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
          dispatch({ type: "UPDATE_FOCUSED_BUILDING", focusedBuilding: buildingAbbreviation });
        });
      } catch (e) {
        return;
      }
    });
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const removeRoof = async (buildingAbbreviation: string, delay: number = 0) => {
    if (delay > 0) await wait(delay);
    const buildingSVG = d3.select(`#${buildingAbbreviation}`);
    if (!buildingSVG) return;
    buildingSVG.selectAll(`#${buildingAbbreviation}_roof`).remove();
    return buildingSVG;
  };

  return { drawRoof, removeRoof };
};

export default useRoofDrawer;
