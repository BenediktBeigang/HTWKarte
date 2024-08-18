import { Box, Drawer, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import { splitRoomName, updateRoomHighlighting } from "../Map/Room";
import { useCampusState } from "../State/campus-context";
import { useEventsInRoom } from "../State/Querys";
import { ContactInJson } from "../State/RoomMapping";
import { HTWKALENDER_GRAY } from "./Color";
import "./RoomInfo.css";
import { BuildingBox, ContactBox, EventBox, RoomNameBox } from "./RoomInfoComponents";

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

export type EventInJson = {
  name: string;
  start: Date;
  end: Date;
  day: string;
  free: boolean;
  rooms: string;
  week: string;
  eventType: string;
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
  const [{ currentRoomID, buildingInfo, contactInfo: roomInfo_htwk, devMode }, dispatch] =
    useCampusState();
  const [roomInfo, setRoomInfo] = React.useState<RoomInfo>(defaultRoom);
  const theme = useTheme();
  const desktopMode = useMediaQuery(theme.breakpoints.up("sm"));
  const { data: eventsInRoom, isLoading } = useEventsInRoom(currentRoomID, devMode);

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
    <Drawer
      anchor={desktopMode ? "left" : "bottom"}
      open={currentRoomID !== "None"}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          backgroundColor: HTWKALENDER_GRAY,
          maxHeight: desktopMode ? "100%" : "60%",
        },
      }}
    >
      <Box
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        style={RoomInfoStyle}
        maxWidth="25em"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          backgroundColor: HTWKALENDER_GRAY,
          overflow: "auto",
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
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400}></Skeleton>
        ) : (
          <>
            {roomInfo.name && <RoomNameBox roomInfo={roomInfo} />}
            {roomInfo.building && <BuildingBox roomInfo={roomInfo} />}
            {roomInfo.person && <ContactBox roomInfo={roomInfo} />}
            {eventsInRoom && <EventBox events={eventsInRoom} devMode={devMode} />}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default RoomInfo;
