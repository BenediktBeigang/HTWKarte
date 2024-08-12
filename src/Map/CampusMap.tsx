import { Box } from "@mui/material";
import CustomSnackbar from "../UI/CustomSnackbar";
import { Header } from "../UI/Header";
import LevelButtons from "../UI/LevelButtons";
import RoomInfo from "../UI/RoomInfo";
import Campus from "./Campus";

export const CampusMap = () => {
  return (
    <Box id="campus-map" style={{ width: "100vw", height: "100lvh" }}>
      <Header />
      <Campus />
      <LevelButtons />
      <RoomInfo />
      <CustomSnackbar />
    </Box>
  );
};
