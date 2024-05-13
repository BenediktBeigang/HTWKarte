import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Campus from "./Campus";
import { HTWK_GRAY, HTWK_LIGHT_GRAY } from "./Color";
import LevelButtons from "./LevelButtons";
import RoomInfo from "./RoomInfo";
import { useCampusState } from "./campus-context";

export const CampusMap = () => {
  const [, dispatch] = useCampusState();

  return (
    <div id="campus-map" style={{ width: "100vw", height: "100lvh" }}>
      <Campus />
      <LevelButtons />
      <RoomInfo />
      <Button
        onClick={() => {
          dispatch({ type: "UPDATE_CAMPUS", currentCampus: "None" });
        }}
        variant="outlined"
        sx={{
          position: "absolute",
          top: "1em",
          left: "1em",
          border: "2px solid",
          borderRadius: "10%",
          height: "3em",
          width: "1em",
          borderColor: HTWK_LIGHT_GRAY,
          backgroundColor: HTWK_GRAY,
          "&:hover": {
            backgroundColor: "yellow",
            "& .MuiSvgIcon-root": {
              color: "black",
              stroke: "black",
              strokeWidth: "1",
            },
          },
        }}
      >
        <Link to="/city" style={{ display: "flex", alignItems: "center" }}>
          <ArrowBackIcon
            sx={{
              color: HTWK_LIGHT_GRAY,
              fontWeight: "5em",
              stroke: HTWK_LIGHT_GRAY,
              strokeWidth: "1",
            }}
          />
        </Link>
      </Button>
    </div>
  );
};
