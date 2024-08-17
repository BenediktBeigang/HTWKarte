import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as d3 from "d3";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { FinishedBuildings } from "../Constants";
import { BuildingInJson, switchToFloor } from "../Map/Building";
import { useCampusState } from "../State/campus-context";
import { CampusContextAction, CampusContextProps } from "../State/campus-reducer";
import { HTWK_DARK_TEXT, HTWK_GRAY, HTWK_LIGHT_GRAY, HTWK_YELLOW } from "./Color";

const buttonSize: number = 3 as const;

const SelectionMarker = (
  // levelCount: number,
  // level: number,
  markerHeight: number,
  markerTop: number,
): JSX.Element => {
  return (
    <div
      id="level-marker"
      style={{
        top: `${markerTop}%`,
        left: "5%",
        position: "absolute",
        width: "90%",
        height: `${markerHeight * 0.9}%`,
        backgroundColor: HTWK_YELLOW,
        borderRadius: "5px",
      }}
    />
  );
};

const levelBoxHeight = (levelCount: number) => {
  return 100 / levelCount;
};

const calcLevelSelectorTop = (levelCount: number, uiLevel: number) => {
  console.log("levelCount", levelCount, "uiLevel", uiLevel);
  if (levelCount === undefined || uiLevel === undefined) return 0;
  const boxHeight = levelBoxHeight(levelCount);
  let newTop: number = boxHeight * (levelCount - uiLevel - 1);
  newTop += boxHeight * 0.05;
  return newTop;
};

// const hoverAnimation = (
//   level: number,
//   levelCount: number,
//   hoverLevel: number | undefined,
// ) => {
//   const marker = d3.select("#level-marker");

//   let newTop = levelSelectorTop(levelCount, level);
//   if (isNaN(newTop)) return;

//   if (hoverLevel === undefined) {
//     marker.transition().duration(200).style("top", `${newTop}%`);
//     return;
//   }

//   const boxHeight = levelBoxHeight(levelCount + 1);
//   let hoverTop = 100 - boxHeight * hoverLevel;
//   hoverTop -= boxHeight;
//   hoverTop += boxHeight * 0.05;

//   const percentage = 0.05;
//   const diff = (hoverTop - newTop) * percentage;
//   newTop += diff;
//   marker.transition().duration(200).style("top", `${newTop}%`);
// };

const levelChangeAnimation = (level: number, levelCount: number, oldLevel: number) => {
  const marker = d3.select("#level-marker");
  const oldTop = calcLevelSelectorTop(levelCount, oldLevel);
  marker.style("top", `${oldTop}%`);
  const newTop = calcLevelSelectorTop(levelCount, level);
  marker.transition().duration(200).style("top", `${newTop}%`);
};

const handleLevelChange = (
  newLevel: number,
  oldLevel: number,
  levelCount: number,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
  hasBasement: boolean,
) => {
  console.log("newLevel", newLevel, "oldLevel", oldLevel);
  if (newLevel === undefined || newLevel === null) return;
  switchToFloor(stateRef.current.state.currentBuilding, newLevel, stateRef);
  stateRef.current.dispatch({ type: "UPDATE_LEVEL", level: newLevel });
  levelChangeAnimation(
    hasBasement ? newLevel + 1 : newLevel,
    levelCount,
    hasBasement ? oldLevel + 1 : oldLevel,
  );
};

const LevelButtons = ({
  levelCount,
  startLevel,
  hasBasement,
}: {
  levelCount: number;
  startLevel: number;
  hasBasement: boolean;
}): JSX.Element => {
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const [hoverLevel, setHoverLevel] = useState<number | undefined>(undefined);
  const buildingInfo: BuildingInJson | undefined = state.buildingInfo;

  const startSelectorHeight = useMemo(() => {
    return 100 / levelCount!;
  }, [levelCount]);

  // useEffect(() => {
  //   return;
  //   const minFloor: number = buildingInfo ? Math.min(...buildingInfo.properties.Floors) : 0;
  //   const adjustedLevel: number = state.level - minFloor;
  //   if (levelCount === undefined) return;
  //   hoverAnimation(adjustedLevel, levelCount, hoverLevel, hasBasement);
  // }, [buildingInfo, hasBasement, hoverLevel, state.level, levelCount]);

  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  if (
    !buildingInfo ||
    !FinishedBuildings.includes(state.currentBuilding) ||
    levelCount === undefined ||
    state.level === undefined
  ) {
    return <></>;
  }

  return (
    <ToggleButtonGroup
      value={state.level}
      color="primary"
      exclusive
      orientation="vertical"
      size="large"
      onChange={(_event, value) =>
        handleLevelChange(value, state.level, levelCount!, stateRef, hasBasement)
      }
      sx={{
        position: "absolute",
        bottom: "2em",
        right: "2em",
        width: buttonSize + "em",
        height: buttonSize * levelCount + "em",
        border: `2px solid ${HTWK_LIGHT_GRAY}`,
        backgroundColor: HTWK_GRAY,
        opacity: levelCount === undefined ? "0" : "0.9",
      }}
    >
      {SelectionMarker(startSelectorHeight, calcLevelSelectorTop(levelCount, startLevel))}
      {buildingInfo.properties.Floors.map((level) => (
        <ToggleButton
          key={level}
          value={level}
          // onMouseEnter={() => setHoverLevel(level)}
          // onMouseLeave={() => setHoverLevel(undefined)}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "transparent",
              color: HTWK_DARK_TEXT,
              transition: "color 0.3s ease-in-out",
              "&:hover": {
                color: HTWK_DARK_TEXT,
                background: "transparent",
              },
            },
            transition: "color 0.3s ease-in-out",
            height: buttonSize + "em",
            backgroundColor: "transparent",
            color: HTWK_LIGHT_GRAY,
            fontSize: "1.5em",
            fontWeight: "bold",
            margin: "0",
            padding: "0",
          }}
        >
          {level}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default LevelButtons;
