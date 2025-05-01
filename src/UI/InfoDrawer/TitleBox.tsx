import CopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { BOX_COLOR, HTWK_YELLOW } from "../Color";
import useInfoDrawer from "./useInfoDrawer";

export const TitleBox = ({
  title,
  shareButton,
  currentRoomID,
}: {
  title: string;
  shareButton: boolean;
  currentRoomID: string;
}) => {
  const { handleShare } = useInfoDrawer();

  return (
    <Stack
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        justifyContent: "left",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          backgroundColor: BOX_COLOR,
          paddingLeft: "1em",
          paddingRight: "1em",
          marginRight: shareButton ? "1em" : 0,
        }}
      >
        <Typography variant="h4" align="center">
          {title}
        </Typography>
      </Paper>
      {shareButton && (
        <Paper
          sx={{
            backgroundColor: HTWK_YELLOW,
            paddingLeft: "1em",
            paddingRight: "1em",
            height: "3em",
          }}
        >
          <IconButton onClick={() => handleShare(currentRoomID)}>
            {typeof navigator.share === "function" ? (
              <ShareIcon sx={{ color: "#000000ee" }} />
            ) : (
              <CopyIcon sx={{ color: "#000000ee" }} />
            )}
          </IconButton>
        </Paper>
      )}
    </Stack>
  );
};

export default TitleBox;
