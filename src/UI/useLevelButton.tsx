import * as d3 from "d3";
import useBuildingDrawer from "../Map/useBuildingDrawer";
import { useCampusState } from "../State/campus-context";

const useLevelButton = () => {
  const [state, dispatch] = useCampusState();
  const { switchToFloor } = useBuildingDrawer();

  const levelChangeAnimation = (level: number, levelCount: number, oldLevel: number) => {
    const marker = d3.select("#level-marker");
    const oldTop = calcLevelSelectorTop(levelCount, oldLevel);
    marker.style("top", `${oldTop}%`);
    const newTop = calcLevelSelectorTop(levelCount, level);
    marker.transition().duration(200).style("top", `${newTop}%`);
  };

  const levelBoxHeight = (levelCount: number) => {
    return 100 / levelCount;
  };

  const calcLevelSelectorTop = (levelCount: number, uiLevel: number) => {
    if (levelCount === undefined || uiLevel === undefined) return 0;
    const boxHeight = levelBoxHeight(levelCount);
    let newTop: number = boxHeight * (levelCount - uiLevel - 1);
    newTop += boxHeight * 0.05;
    return newTop;
  };

  const handleLevelChange = (
    newLevel: number,
    oldLevel: number,
    levelCount: number,
    hasBasement: boolean,
  ) => {
    if (newLevel === undefined || newLevel === null) return;
    switchToFloor(state.currentBuilding, newLevel);
    dispatch({ type: "UPDATE_LEVEL", level: newLevel });
    levelChangeAnimation(
      hasBasement ? newLevel + 1 : newLevel,
      levelCount,
      hasBasement ? oldLevel + 1 : oldLevel,
    );
  };

  const hoverAnimation = (level: number, hoverLevel: number | undefined, levelCount: number) => {
    const marker = d3.select("#level-marker");
  
    let newTop = calcLevelSelectorTop(levelCount, level);
    if (isNaN(newTop)) return;
  
    if (hoverLevel === undefined) return marker.transition().duration(200).style("top", `${newTop}%`);
  
    const boxHeight = levelBoxHeight(levelCount);
    let hoverTop = 100 - boxHeight * hoverLevel;
    hoverTop -= boxHeight;
    hoverTop += boxHeight * 0.05;
  
    const percentage = 0.05;
    const diff = (hoverTop - newTop) * percentage;
    newTop += diff;
    marker.transition().duration(200).style("top", `${newTop}%`);
  };

  return { handleLevelChange, hoverAnimation, calcLevelSelectorTop };
};

export default useLevelButton;
