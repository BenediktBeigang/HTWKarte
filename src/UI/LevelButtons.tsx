import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as d3 from "d3";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { FinishedBuildings } from "../Constants";
import { BuildingInJson, switchToFloor } from "../Map/Building";
import { useCampusState } from "../State/campus-context";
import { CampusContextAction, CampusContextProps } from "../State/campus-reducer";
import { HTWK_DARK_TEXT, HTWK_GRAY, HTWK_LIGHT_GRAY, HTWK_YELLOW } from "./Color";

const buttonSize: number = 3 as const;

const SelectionMarker = (markerHeight: number, markerTop: number): JSX.Element => {
  return (
    <Box
      id="level-marker"
      sx={{
        top: `${markerTop}%`,
        position: "absolute",
        left: "5%",
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
  if (levelCount === undefined || uiLevel === undefined) return 0;
  const boxHeight = levelBoxHeight(levelCount);
  let newTop: number = boxHeight * (levelCount - uiLevel - 1);
  newTop += boxHeight * 0.05;
  return newTop;
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
  hasBasement,
}: {
  levelCount: number;
  hasBasement: boolean;
}): JSX.Element => {
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const [hoverLevel, setHoverLevel] = useState<number | undefined>(undefined);
  const buildingInfo: BuildingInJson | undefined = state.buildingInfo;
  const [startLevel, setStartLevel] = useState<number>(hasBasement ? state.level + 1 : state.level);

  useEffect(() => {
    setStartLevel(hasBasement ? state.level + 1 : state.level);
  }, [hasBasement, state.level]);

  useEffect(() => {
    if (levelCount === undefined || state.level === undefined) return;
    const uiLevel = hasBasement ? state.level + 1 : state.level;
    console.log("uiLevel", uiLevel, "hoverLevel", hoverLevel);
    hoverAnimation(uiLevel, hoverLevel, levelCount);
  }, [buildingInfo, hasBasement, hoverLevel, state.level, levelCount]);

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
        width: `${buttonSize}em`,
        height: `${buttonSize * levelCount}em`,
        border: `2px solid ${HTWK_LIGHT_GRAY}`,
        backgroundColor: HTWK_GRAY,
        opacity: levelCount === undefined ? "0" : "0.9",
      }}
    >
      {SelectionMarker(100 / levelCount, calcLevelSelectorTop(levelCount, startLevel))}
      {buildingInfo.properties.Floors.map((level) => (
        <ToggleButton
          key={level}
          value={level}
          onMouseEnter={() => setHoverLevel(hasBasement ? level + 1 : level)}
          onMouseLeave={() => setHoverLevel(undefined)}
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
            height: `${buttonSize}em`,
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
