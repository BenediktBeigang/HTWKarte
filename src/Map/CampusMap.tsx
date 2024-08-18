import { Box } from "@mui/material";
import { useMemo } from "react";
import { useCampusState } from "../State/campus-context";
import CustomSnackbar from "../UI/CustomSnackbar";
import { Header } from "../UI/Header";
import LevelButtons from "../UI/LevelButtons";
import RoomInfo from "../UI/RoomInfo";
import Campus from "./Campus";

export const CampusMap = () => {
  const [state, dispatch] = useCampusState();

  const hasBasement = useMemo(() => {
    return state.buildingInfo ? state.buildingInfo.properties.Floors.includes(-1) : false;
  }, [state.buildingInfo]);

  const levelButton = useMemo(() => {
    return (
      state.levelCount && (
        <LevelButtons
          levelCount={state.levelCount}
          // startLevel={hasBasement ? state.level + 1 : state.level}
          hasBasement={hasBasement}
        />
      )
    );
  }, [hasBasement, state.levelCount]);

  return (
    <Box id="campus-map" style={{ width: "100vw", height: "100lvh" }}>
      <Header />
      <Campus />
      {/* {state.levelCount && (
        <LevelButtons
          levelCount={state.levelCount}
          startLevel={hasBasement ? state.level + 1 : state.level}
          hasBasement={hasBasement}
        />
      )} */}
      {levelButton}
      <RoomInfo />
      <CustomSnackbar />
    </Box>
  );
};
