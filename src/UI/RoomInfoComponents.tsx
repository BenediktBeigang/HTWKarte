import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Divider, keyframes, List, ListItem, Paper, Typography } from "@mui/material";
import { format, FormatOptions } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Fragment } from "react/jsx-runtime";
import { HTWK_LIGHT_TEXT, HTWK_YELLOW } from "./Color";
import RoomInfo, { EventInJson } from "./RoomInfo";

const BOX_COLOR = "#495079"; // ROOM + "dd";

const RoomInfoRow = (content: string | any, muiVariant: any = "body1") => {
  return (
    <ListItem>
      <Typography variant={muiVariant}>{content}</Typography>
    </ListItem>
  );
};

const InfoBox = ({ icon, content }: { icon: JSX.Element; content: JSX.Element[] }) => {
  return (
    <Paper
      sx={{
        backgroundColor: BOX_COLOR,
      }}
    >
      <List sx={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
        {icon}
        <Divider variant="middle" />
        {content.map((item, index) => (
          <Fragment key={index}>
            {item}
            {index < content.length - 1 && <Divider variant="middle" />}
          </Fragment>
        ))}
      </List>
    </Paper>
  );
};

export const RoomNameBox = ({ roomInfo }: { roomInfo: RoomInfo }) => {
  return (
    <Paper
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        backgroundColor: BOX_COLOR,
      }}
    >
      <Typography variant="h4" align="center">
        {roomInfo.name}
      </Typography>
    </Paper>
  );
};

export const ContactBox = ({ roomInfo }: { roomInfo: RoomInfo }) => {
  const contactContent = [];

  if (roomInfo.person) contactContent.push(RoomInfoRow(roomInfo.person));
  if (roomInfo.email)
    contactContent.push(
      RoomInfoRow(
        <a style={{ color: HTWK_LIGHT_TEXT }} href={`mailto:${roomInfo.email}`}>
          {roomInfo.email}
        </a>,
      ),
    );
  if (roomInfo.telephone) {
    const phoneNumber = roomInfo.telephone[0].number;
    contactContent.push(
      RoomInfoRow(
        <a style={{ color: HTWK_LIGHT_TEXT + " !important" }} href={`tel:${phoneNumber}`}>
          {phoneNumber}
        </a>,
      ),
    );
  }
  if (roomInfo.department) contactContent.push(RoomInfoRow(roomInfo.department));

  return (
    <InfoBox
      icon={<PersonIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={contactContent}
    />
  );
};

export const BuildingBox = ({ roomInfo }: { roomInfo: RoomInfo }) => {
  const buildingContent = [];

  if (roomInfo.building) buildingContent.push(RoomInfoRow(roomInfo.building));
  if (roomInfo.adress) buildingContent.push(RoomInfoRow(roomInfo.adress));

  return (
    <InfoBox
      icon={<HomeIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={buildingContent}
    />
  );
};

const pulsate = keyframes`
  0% {
    border: 2px solid ${HTWK_YELLOW + "00"};
  }
  50% {
    border: 2px solid ${HTWK_YELLOW + "ff"};
  }
  100% {
    border: 2px solid ${HTWK_YELLOW + "00"};
  }
`;

const formatEventTime = (time: Date, timeZone: string): string => {
  const zonedDate = toZonedTime(time, timeZone);
  return format(zonedDate, "HH:mm", { timeZone } as FormatOptions);
};

const formatEventType = (eventType: string): string => {
  switch (eventType) {
    case "V":
      return "Vorlesung";
    case "S":
      return "Seminar";
    case "P":
      return "Praktikum";
    default:
      return eventType;
  }
};

const Event = ({ isNow, eventData }: { isNow: boolean; eventData: EventInJson }) => {
  return (
    <Paper
      sx={{
        display: "flex",
        gap: "1em",
        mr: "1em",
        ml: "1em",
        padding: "1em",
        backgroundColor: "#ffffff55",
        animation: isNow ? `${pulsate} 3s infinite` : "none",
      }}
    >
      <Typography sx={{ textAlign: "right" }}>
        {formatEventTime(eventData.start, "Europe/Berlin")}
        <br />
        {formatEventTime(eventData.end, "Europe/Berlin")}
      </Typography>
      <Divider orientation="vertical" flexItem />
      <Typography>
        {`${formatEventType(eventData.eventType)}`}
        <br />
        {`${eventData.name}`}
      </Typography>
    </Paper>
  );
};

const isEventNow = (event: EventInJson, devMode: boolean): boolean => {
  const now = devMode ? new Date(new Date(event.start).setHours(13, 45, 0, 0)) : new Date();
  return now >= new Date(event.start) && now <= new Date(event.end);
};

export const EventBox = ({ events, devMode }: { events: [EventInJson]; devMode: boolean }) => {
  return (
    <Paper
      sx={{
        backgroundColor: BOX_COLOR,
      }}
    >
      <List
        sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.7em" }}
      >
        <EventIcon sx={{ alignSelf: "center" }} />
        <Divider variant="middle" />
        <Typography sx={{ alignSelf: "center" }}>
          <b>Heutige Veranstaltungen</b>
        </Typography>
        {events.map((event, index) => (
          <Event key={index} isNow={isEventNow(event, devMode)} eventData={event} />
        ))}
      </List>
    </Paper>
  );
};
