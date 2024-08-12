import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import { splitRoomName, updateRoomHighlighting } from "../Map/Room";
import { useCampusState } from "../State/campus-context";
import { RoomInJson } from "../State/RoomMapping";
import { HTWK_LIGHT_TEXT, ROOM } from "./Color";
import "./RoomInfo.css";

type RoomInfo = {
  name: string;
  building: string;
  adress: string;
  person?: string;
  email?: string;
  telephone?: [
    {
      number: string;
    },
  ];
  department?: string;
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

const preparePersonName = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return undefined;
  return `${firstName} ${lastName}`;
};

const prepareRoomInfo = (
  roomID: string,
  buildingName: string,
  buildingAdress: string,
  personInRoom: RoomInJson,
) => {
  const room: RoomInfo = {
    name: splitRoomName(roomID)?.join(" ") ?? roomID,
    building: buildingName ?? "",
    adress: buildingAdress ?? "",
    person: preparePersonName(personInRoom.firstName, personInRoom.lastName) ?? "",
    email: personInRoom.email ?? "",
    telephone: personInRoom.telephone ?? [],
    department: personInRoom.department
  };
  return room;
};

const RoomInfoRow = (content: string | any, muiVariant: any = "body1") => {
  return (
    <ListItem>
      <Typography variant={muiVariant}>{content}</Typography>
    </ListItem>
  );
};

const RoomInfo = () => {
  const [{ currentRoomID, currentBuilding, buildingInfo, roomInfo_htwk }, dispatch] =
    useCampusState();
  const [roomInfo, setRoomInfo] = React.useState<RoomInfo>(defaultRoom);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (currentRoomID === "None" || !buildingInfo || !roomInfo_htwk) return;
    setRoomInfo(
      prepareRoomInfo(
        currentRoomID,
        buildingInfo.properties.Name,
        buildingInfo.properties.Address,
        roomInfo_htwk.find((room) => room.roomID === currentRoomID) ?? ({} as RoomInJson),
      ),
    );
  }, [buildingInfo, currentBuilding, currentRoomID, roomInfo_htwk]);

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
          {roomInfo.building && RoomInfoRow(roomInfo.building)}
          {roomInfo.adress && RoomInfoRow(roomInfo.adress)}
          {roomInfo.person && RoomInfoRow(roomInfo.person, "h6")}
          {roomInfo.email &&
            RoomInfoRow(
              <a
                style={{ color: HTWK_LIGHT_TEXT }}
                href={`mailto:${roomInfo.email}`}
              >{`${roomInfo.email}`}</a>,
            )}
          {roomInfo.telephone && RoomInfoRow(roomInfo.telephone[0].number)}
          {roomInfo.department && RoomInfoRow(roomInfo.department)}
        </List>
      </div>
    </SwipeableDrawer>
  );
};

export default RoomInfo;
