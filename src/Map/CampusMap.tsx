import { Box } from "@mui/material";
import { useMemo } from "react";
import { useCampusState } from "../State/campus-context";
import CustomSnackbar from "../UI/CustomSnackbar";
import { Header } from "../UI/Header";
import LevelButtons from "../UI/LevelButtons";
import RoomInfo from "../UI/RoomInfo";
import Campus from "./Campus";

export const CampusMap = () => {
  const [state] = useCampusState();

  const hasBasement = useMemo(() => {
    return state.buildingInfo ? state.buildingInfo.properties.Floors.includes(-1) : false;
  }, [state.buildingInfo]);

  return (
    <Box id="campus-map" style={{ width: "100vw", height: "100lvh" }}>
      <Header />
      <Campus />
      {state.levelCount && <LevelButtons levelCount={state.levelCount} hasBasement={hasBasement} />}
      <RoomInfo />
      <CustomSnackbar />
    </Box>
  );
};
