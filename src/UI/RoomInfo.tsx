import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import { splitRoomName, updateRoomHighlighting } from "../Map/Room";
import { useCampusState } from "../State/campus-context";
import { ROOM } from "./Color";
import "./RoomInfo.css";

type RoomInfo = {
  name: string;
  building: string;
  person?: string;
  adress: string;
};

const defaultRoom: RoomInfo = {
  name: "unknown",
  building: "unknown",
  person: "unknown",
  adress: "unknown",
};

const RoomInfoStyle = {
  backgroundColor: ROOM,
  color: "#ffffffdd",
  fontFamily: "Source Sans 3, sans-serif",
  width: "100%",
  height: "100%",
  padding: "1em",
};

const prepareRoomInfo = (roomID: string, buildingName: string, buildingAdress: string) => {
  const room: RoomInfo = {
    name: splitRoomName(roomID)?.join(" ") ?? roomID,
    building: buildingName ?? "",
    person: "",
    adress: buildingAdress ?? "",
  };
  return room;
};

const RoomInfo = () => {
  const [{ currentRoomID, currentBuilding, buildingInfo }, dispatch] = useCampusState();
  const [roomInfo, setRoomInfo] = React.useState<RoomInfo>(defaultRoom);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (currentRoomID === "None" || !buildingInfo) return;
    setRoomInfo(
      prepareRoomInfo(currentRoomID, buildingInfo.properties.Name, buildingInfo.properties.Address),
    );
  }, [buildingInfo, currentBuilding, currentRoomID]);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    updateRoomHighlighting(currentRoomID, open);
    dispatch({ type: "UPDATE_ROOM", currentRoomID: open ? currentRoomID : "None" });
  };

  return (
    <SwipeableDrawer
      anchor={matches ? "left" : "bottom"}
      open={currentRoomID !== "None"}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <div
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        style={RoomInfoStyle}
      >
        <h1>{roomInfo.name}</h1>
        <List>
          {roomInfo.building && <ListItem>{`${roomInfo.building}`}</ListItem>}
          {roomInfo.person && <ListItem>{`${roomInfo.person}`}</ListItem>}
          {roomInfo.adress && <ListItem>{`${roomInfo.adress}`}</ListItem>}
        </List>
      </div>
    </SwipeableDrawer>
  );
};

export default RoomInfo;
