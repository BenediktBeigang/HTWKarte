import { Box, Drawer } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
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
import { BuildingInfo, ContactInfo, EventInJson } from "./InfoDrawerTypes";
import "./RoomInfo.css";
import { TitleBox } from "./TitleBox";

const RoomInfoStyle = {
  color: "#ffffffdd",
  fontFamily: "Source Sans 3, sans-serif",
  width: "100%",
  height: "100%",
  padding: "1em",
};

const InfoDrawer = () => {
  const [{ currentRoomID, contactInfo, cachedEvents, focusedBuilding }, dispatch] =
    useCampusState();
  const [contactCard, setContactCard] = useState<ContactInfo | undefined>(undefined);
  const [buildingCard, setBuildingCard] = useState<BuildingInfo | undefined>(undefined);
  const [eventsCard, setEventsCard] = useState<EventInJson[] | undefined>(undefined);
  const { data: buildingInfo_data } = useBuildingInfo();
  const { splitRoomName, updateRoomHighlighting } = useRooms();

  const theme = useTheme();
  const desktopMode = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (currentRoomID === "None" || !contactInfo) return setContactCard(undefined);
    const contact = contactInfo.find((room) => room.roomID === currentRoomID);
    if (!contact) return setContactCard(undefined);
    setContactCard({
      roomName: splitRoomName(currentRoomID)?.join(" ") ?? currentRoomID,
      person: `${contact.firstName} ${contact.lastName}`,
      email: contact.email ?? "",
      telephone: contact.telephone ?? [],
      department: contact.department,
    });
  }, [currentRoomID, contactInfo]);

  useEffect(() => {
    if (focusedBuilding === undefined || buildingInfo_data === undefined)
      return setBuildingCard(undefined);
    const buildingInfo: BuildingInJson | undefined = buildingInfo_data.find(
      (building: BuildingInJson) => building.properties.Abbreviation === focusedBuilding,
    );
    if (!buildingInfo) return setBuildingCard(undefined);
    setBuildingCard({
      name: buildingInfo.properties.Name,
      address: buildingInfo.properties.Address,
      abbreviation: buildingInfo.properties.Abbreviation,
      janitor: buildingInfo.properties.Janitor ?? undefined,
      description: buildingInfo.properties.Description ?? undefined,
    });
  }, [buildingInfo_data, focusedBuilding]);

  useEffect(() => {
    if (currentRoomID === "None" || !cachedEvents) return setEventsCard([]);
    const today = new Date().toISOString().split("T")[0];
    const eventsInRoom: EventInJson[] = cachedEvents.filter(
      (event) =>
        event.rooms.split(" ").includes(currentRoomID) &&
        new Date(event.start).toISOString().split("T")[0] === today,
    );
    setEventsCard(
      eventsInRoom.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    );
  }, [cachedEvents, currentRoomID]);

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
            maxHeight: desktopMode ? "100%" : "60%",
          },
        },
      }}
    >
      <Box
        role="presentation"
        style={RoomInfoStyle}
        maxWidth={desktopMode ? "25em" : "100%"}
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
        {focusedBuilding && <ImageBox building={focusedBuilding} />}
        {buildingCard && focusedBuilding && <BuildingBox building={buildingCard} />}
        {buildingCard && focusedBuilding && buildingCard.description && (
          <DescriptionBox description={buildingCard.description} />
        )}
        {contactCard && <ContactBox contact={contactCard} />}
        {eventsCard && eventsCard.length > 0 && <EventBox events={eventsCard} />}
      </Box>
    </Drawer>
  );
};

export default InfoDrawer;
