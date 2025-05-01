import { Paper, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useCampusState } from "../../State/campus-context";
import { BOX_COLOR } from "../Color";

export const ImageBox = () => {
  const [{ currentRoomID, focusedBuilding }] = useCampusState();
  const [srcURL, setSrcURL] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    if (!currentRoomID && !focusedBuilding) return setSrcURL(undefined);
    if (focusedBuilding) return setSrcURL(`/Images/${focusedBuilding}.png`);
    if (currentRoomID) return setSrcURL(`/ExternalResources/images/${currentRoomID}.png`);
  }, [currentRoomID, focusedBuilding]);

  const handleOnError = () => {
    if (focusedBuilding) return setLoading(false);
    if (!srcURL?.endsWith(".png")) {
      setError(true);
      return setLoading(false);
    }
    setSrcURL(`/ExternalResources/images/${currentRoomID}.jpg`);
  };

  const handleOnLoad = () => {
    setLoading(false);
  };

  if (!srcURL || error) return <></>;

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
      {loading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="300px"
          sx={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
      <img
        src={srcURL}
        onLoad={handleOnLoad}
        onError={handleOnError}
        style={{
          display: loading ? "none" : "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "0.5em",
        }}
      />
    </Paper>
  );
};

export default ImageBox;
