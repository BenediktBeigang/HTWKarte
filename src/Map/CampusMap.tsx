import { Box, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { DATE_OF_LNC_START } from "../Constants";
import { useCampusState } from "../State/campus-context";
import CustomSnackbar from "../UI/CustomSnackbar";
import { Header } from "../UI/Header";
import InfoDrawer from "../UI/InfoDrawer/InfoDrawer";
import LevelButtons from "../UI/LevelButtons";
import Campus from "./Campus";

export const CampusMap = () => {
  const [state, dispatch] = useCampusState();

  const hasBasement = useMemo(() => {
    return state.buildingInfo ? state.buildingInfo.properties.Floors.includes(-1) : false;
  }, [state.buildingInfo]);

  useMemo(() => {
    const lncStart = new Date(DATE_OF_LNC_START);
    const now = new Date();

    const endOfLnc = new Date(lncStart);
    endOfLnc.setDate(endOfLnc.getDate() + 1);
    endOfLnc.setHours(0, 0, 0, 0);

    if (now >= lncStart && now < endOfLnc) {
      dispatch({ type: "ACTIVATE_LNC_MODE" });
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname.includes("/lnc")) {
      dispatch({ type: "ACTIVATE_LNC_MODE" });
      dispatch({ type: "UPDATE_LNC_MODE_OVERRIDE" });
    }
  }, []);

  return (
    <Box id="campus-map" style={{ width: "100vw", height: "100lvh" }}>
      <Header />
      <Campus />
      {state.levelCount && <LevelButtons levelCount={state.levelCount} hasBasement={hasBasement} />}
      <InfoDrawer />
      <CustomSnackbar />
      <Typography
        variant="caption"
        sx={{ position: "absolute", bottom: 0, right: 0, paddingRight: 1 }}
      >
        v0.4.1
      </Typography>
    </Box>
  );
};
