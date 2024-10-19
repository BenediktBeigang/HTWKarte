import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useCampusState } from "../State/campus-context";
import CustomSnackbar from "../UI/CustomSnackbar";
import { Header } from "../UI/Header";
import InfoDrawer from "../UI/InfoDrawer";
import LevelButtons from "../UI/LevelButtons";
import Campus from "./Campus";

export const CampusMap = () => {
  const [state] = useCampusState();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const hasBasement = useMemo(() => {
    return state.buildingInfo ? state.buildingInfo.properties.Floors.includes(-1) : false;
  }, [state.buildingInfo]);

  return (
    <Box id="campus-map" style={{ width: "100vw", height: "100lvh" }}>
      {isSmallScreen && (
        <Typography
          variant="h1"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "20vw",
            color: "#454c7f77",
            zIndex: -1,
          }}
        >
          HTWKarte
        </Typography>
      )}
      <Header />
      <Campus />
      {state.levelCount && <LevelButtons levelCount={state.levelCount} hasBasement={hasBasement} />}
      <InfoDrawer />
      <CustomSnackbar />
    </Box>
  );
};
