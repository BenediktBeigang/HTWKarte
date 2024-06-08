import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import { adressOfBuilding, fullBuildingName } from "./Building";
import { useCampusState } from "./campus-context";
import { ROOM } from "./Color";
import { RoomInJson, splitRoomName, updateRoomHighlighting } from "./Room";
import "./RoomInfo.css";

type RoomInfo = {
  name: string;
  building: string;
  person: string;
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

const getRoomInfo = (roomID: string, rooms: RoomInJson[], building: string, adress: string) => {
  const roomData = rooms.find((room) => room.id === roomID);
  let roomName = roomData?.name ?? roomID;
  roomName = splitRoomName(roomName).join(" ") ?? roomName;

  const room: RoomInfo = {
    name: roomName,
    building: building ?? "",
    person: roomData?.person ?? "",
    adress: adress ?? "",
  };

  return room;
};

const RoomInfo = () => {
  const [{ currentRoomID, dataOfRooms, currentBuilding, dataOfBuildings }, dispatch] =
    useCampusState();
  const [roomInfo, setRoomInfo] = React.useState<RoomInfo>(defaultRoom);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (currentRoomID === "None") return;
    if (!dataOfBuildings) return;
    setRoomInfo(
      getRoomInfo(
        currentRoomID,
        dataOfRooms,
        fullBuildingName(currentBuilding, dataOfBuildings),
        adressOfBuilding(currentBuilding, dataOfBuildings),
      ),
    );
  }, [currentBuilding, currentRoomID, dataOfBuildings, dataOfRooms]);

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
