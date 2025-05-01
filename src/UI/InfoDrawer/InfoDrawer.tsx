import { Box, Drawer, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { BuildingInJson } from "../../Map/MapTypes";
import useRooms from "../../Map/useRooms";
import { useCampusState } from "../../State/campus-context";
import { useBuildingInfo } from "../../State/Queries";
import { HTWKALENDER_GRAY } from "../Color";
import BuildingBox from "./BuildingBox";
import ContactBox from "./ContactBox";
import DescriptionBox from "./DescriptionBox";
import EventBox from "./EventBox";
import ImageBox from "./ImageBox";
import "./RoomInfo.css";
import { TitleBox } from "./TitleBox";

const InfoDrawer = () => {
  const [{ currentRoomID, focusedBuilding }, dispatch] = useCampusState();
  const { data: buildingInfo_data } = useBuildingInfo();
  const { splitRoomName, updateRoomHighlighting } = useRooms();

  const theme = useTheme();
  const desktopMode = useMediaQuery(theme.breakpoints.up("sm"));

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    )
      return;

    dispatch({ type: "UPDATE_FOCUSED_BUILDING", focusedBuilding: undefined });
    updateRoomHighlighting(currentRoomID, open);
    dispatch({ type: "UPDATE_ROOM", currentRoomID: open ? currentRoomID : "None" });
  };

  return (
    <Drawer
      anchor={desktopMode ? "left" : "bottom"}
      open={currentRoomID !== "None" || focusedBuilding !== undefined}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          toggleDrawer(false)(event as any);
        }
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: HTWKALENDER_GRAY,
            width: desktopMode ? "25em" : "100%",
            height: desktopMode ? "100%" : "60%",
          },
        },
      }}
    >
      <Stack
        role="presentation"
        gap={2}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: desktopMode ? "25em" : "100%",
          padding: "1em",
          backgroundColor: HTWKALENDER_GRAY,
          color: "#ffffffdd",
          overflow: "auto",
          fontFamily: "Source Sans 3, sans-serif",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: HTWKALENDER_GRAY,
            width: "100%",
            height: "5em",
            zIndex: 5,
          }}
        />

        {currentRoomID !== "None" && (
          <TitleBox
            title={
              splitRoomName(currentRoomID)?.join(" ").replace("-", ".").replace("FO", "FÖ") ??
              currentRoomID
            }
            shareButton={true}
            currentRoomID={currentRoomID}
          />
        )}
        {currentRoomID === "None" && focusedBuilding !== undefined && buildingInfo_data && (
          <TitleBox
            title={
              buildingInfo_data.find(
                (building: BuildingInJson) => building.properties.Abbreviation === focusedBuilding,
              )?.properties.Name ?? "Building not found"
            }
            shareButton={false}
            currentRoomID={""}
          />
        )}
        <ImageBox />
        <BuildingBox />
        <DescriptionBox />
        <ContactBox />
        <EventBox />
      </Stack>
    </Drawer>
  );
};

export default InfoDrawer;
