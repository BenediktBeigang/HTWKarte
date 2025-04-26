import { Paper } from "@mui/material";
import { BOX_COLOR } from "../Color";

export const ImageBox = ({ building }: { building: string }) => {
  return (
    <Paper
      sx={{
        top: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        backgroundColor: BOX_COLOR,
      }}
    >
      <img
        src={`/Images/${building}.png`}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.5em" }}
      ></img>
    </Paper>
  );
};

export default ImageBox;
