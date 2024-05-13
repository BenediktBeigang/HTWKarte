import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/system";
import * as d3 from "d3";
import * as React from "react";
import { switchFloor } from "./Building";
import { HTWK_DARK_TEXT, HTWK_GRAY, HTWK_LIGHT_GRAY, HTWK_YELLOW } from "./Color";
import { useCampusState } from "./campus-context";

const buttonSize: number = 3 as const;

const buttonGroupStyle = (levelCount: number): React.CSSProperties => {
  let height = buttonSize * (levelCount + 1);
  height = isNaN(height) ? 0 : height;
  return {
    position: "absolute",
    bottom: "2em",
    right: "2em",
    width: buttonSize + "em",
    height: height + "em",
    border: `2px solid ${HTWK_LIGHT_GRAY}`,
    backgroundColor: HTWK_GRAY,
    opacity: levelCount === -1 ? "0" : "0.9",

    margin: "0",
    padding: "0",
  };
};

function markerStyle(levelCount: number): React.CSSProperties {
  let markerHeight = 100 / levelCount;
  markerHeight = isNaN(markerHeight) ? 0 : markerHeight;
  return {
    top: "0",
    left: "5%",
    position: "absolute",
    width: "90%",
    height: `${markerHeight * 0.9}%`,
    backgroundColor: HTWK_YELLOW,
    borderRadius: "5%",
  };
}

const StyledToggleButton = styled(ToggleButton)<{ levelcount: number }>(({ levelcount }) => ({
  "&.Mui-selected": {
    backgroundColor: "transparent",
    color: HTWK_DARK_TEXT,
    transition: "color 0.5s ease-in-out",
    "&:hover": {
      color: HTWK_DARK_TEXT,
      background: "transparent",
    },
  },
  "&:hover": {
    color: HTWK_LIGHT_GRAY,
  },
  backgroundColor: "transparent",
  color: HTWK_LIGHT_GRAY,
  height: isNaN(levelcount) ? 0 : `calc(${buttonSize}em / ${levelcount + 1})`,
  fontWeight: "bold",
  fontSize: "1.5em",
  margin: "0",
  padding: "0",
}));

const hoverAnimation = (level: number, levelCount: number, hoverLevel: number | null) => {
  const marker = d3.select("#level-marker");
  const boxHeight = 100 / (levelCount + 1);
  let newTop = level ? 100 - boxHeight * level : 100;
  newTop -= boxHeight;
  newTop += boxHeight * 0.05;
  if (isNaN(newTop)) return;

  if (hoverLevel === null) {
    marker.transition().duration(200).style("top", `${newTop}%`);
    return;
  }

  let hoverTop = 100 - boxHeight * hoverLevel;
  hoverTop -= boxHeight;
  hoverTop += boxHeight * 0.05;

  const percentage = 0.05;
  const diff = (hoverTop - newTop) * percentage;
  newTop += diff;
  marker.transition().duration(200).style("top", `${newTop}%`);
};

const levelChangeAnimation = (level: number, levelCount: number) => {
  const marker = d3.select("#level-marker");
  const boxHeight = 100 / (levelCount + 1);
  let newTop = level ? 100 - boxHeight * level : 100;
  newTop -= boxHeight;
  newTop += boxHeight * 0.05;
  if (isNaN(newTop)) return;
  marker.transition().duration(200).style("top", `${newTop}%`);
};

const LevelButtons = (): JSX.Element => {
  const [state, dispatch] = useCampusState();
  const [hoverLevel, setHoverLevel] = React.useState<number | null>(null);

  const handleLevelChange = (_event: React.MouseEvent<HTMLElement>, newLevel: number | null) => {
    if (newLevel === null) return;
    switchFloor(state.currentBuilding, newLevel, state.level);
    dispatch({ type: "UPDATE_LEVEL", level: newLevel });
  };

  React.useEffect(() => {
    hoverAnimation(state.level, state.levelCount, hoverLevel);
  }, [hoverLevel, state.level, state.levelCount]);

  React.useEffect(() => {
    levelChangeAnimation(state.level, state.levelCount);
  }, [state.level, state.levelCount]);

  return (
    <ToggleButtonGroup
      value={state.level}
      color="primary"
      exclusive
      orientation="vertical"
      size="large"
      onChange={handleLevelChange}
      aria-label="Level"
      style={buttonGroupStyle(state.levelCount)}
    >
      <div id="level-marker" style={markerStyle(state.levelCount + 1)} />
      {Array.from({ length: state.levelCount + 1 }, (_, i) => state.levelCount - i).map((level) => (
        <StyledToggleButton
          key={level}
          value={level}
          onMouseEnter={() => setHoverLevel(level)}
          onMouseLeave={() => setHoverLevel(null)}
          aria-label={`Level ${level}`}
          levelcount={0}
        >
          {level}
        </StyledToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default LevelButtons;