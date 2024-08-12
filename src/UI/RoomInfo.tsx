import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import { splitRoomName, updateRoomHighlighting } from "../Map/Room";
import { useCampusState } from "../State/campus-context";
import { ContactInJson } from "../State/RoomMapping";
import { HTWKALENDER_GRAY } from "./Color";
import "./RoomInfo.css";
import { BuildingBox, ContactBox, RoomNameBox } from "./RoomInfoComponents";

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
  name: "",
  building: "",
  person: "",
  adress: "",
};

const RoomInfoStyle = {
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
  personInRoom: ContactInJson,
) => {
  const room: RoomInfo = {
    name: splitRoomName(roomID)?.join(" ") ?? roomID,
    building: buildingName ?? "",
    adress: buildingAdress ?? "",
    person: preparePersonName(personInRoom.firstName, personInRoom.lastName) ?? "",
    email: personInRoom.email ?? "",
    telephone: personInRoom.telephone ?? [],
    department: personInRoom.department,
  };
  return room;
};

const RoomInfo = () => {
  const [{ currentRoomID, buildingInfo, contactInfo: roomInfo_htwk }, dispatch] = useCampusState();
  const [roomInfo, setRoomInfo] = React.useState<RoomInfo>(defaultRoom);
  const theme = useTheme();
  const desktopMode = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (currentRoomID === "None" || !buildingInfo || !roomInfo_htwk)
      return setRoomInfo(defaultRoom);
    setRoomInfo(
      prepareRoomInfo(
        currentRoomID,
        buildingInfo.properties.Name,
        buildingInfo.properties.Address,
        roomInfo_htwk.find((room) => room.roomID === currentRoomID) ?? ({} as ContactInJson),
      ),
    );
  }, [buildingInfo, currentRoomID, roomInfo_htwk]);

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
      anchor={desktopMode ? "left" : "bottom"}
      open={currentRoomID !== "None"}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Box
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        style={RoomInfoStyle}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          backgroundColor: HTWKALENDER_GRAY,
        }}
      >
        {roomInfo.name && <RoomNameBox roomInfo={roomInfo} />}
        {roomInfo.building && <BuildingBox roomInfo={roomInfo} />}
        {roomInfo.person && <ContactBox roomInfo={roomInfo} />}
      </Box>
    </SwipeableDrawer>
  );
};

export default RoomInfo;
