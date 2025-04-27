import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FinishedBuildings } from "../Constants";
import { BuildingInJson } from "../Map/MapTypes";
import { useCampusState } from "../State/campus-context";
import { HTWK_DARK_TEXT, HTWK_GRAY, HTWK_LIGHT_GRAY, HTWK_YELLOW } from "./Color";
import useLevelButton from "./useLevelButton";

const buttonSize: number = 3 as const;

const SelectionMarker = (markerHeight: number, markerTop: number): ReactNode => {
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

const LevelButtons = ({
  levelCount,
  hasBasement,
}: {
  levelCount: number;
  hasBasement: boolean;
}): ReactNode => {
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const [hoverLevel, setHoverLevel] = useState<number | undefined>(undefined);
  const buildingInfo: BuildingInJson | undefined = state.buildingInfo;
  const [startLevel, setStartLevel] = useState<number>(hasBasement ? state.level + 1 : state.level);
  const { handleLevelChange, hoverAnimation, calcLevelSelectorTop } = useLevelButton();

  useEffect(() => {
    setStartLevel(hasBasement ? state.level + 1 : state.level);
  }, [hasBasement, state.level]);

  useEffect(() => {
    if (levelCount === undefined || state.level === undefined) return;
    const uiLevel = hasBasement ? state.level + 1 : state.level;
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
      onChange={(_event, value) => handleLevelChange(value, state.level, levelCount!, hasBasement)}
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
