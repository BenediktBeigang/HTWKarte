import CopyIcon from "@mui/icons-material/ContentCopy";
import DiningIcon from "@mui/icons-material/Dining";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import SensorsIcon from "@mui/icons-material/Sensors";
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Divider,
  IconButton,
  keyframes,
  Link,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { format, FormatOptions } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { MutableRefObject } from "react";
import { Fragment } from "react/jsx-runtime";
import { CampusContextAction } from "../State/campus-reducer";
import { HTWK_LIGHT_TEXT, HTWK_YELLOW } from "./Color";
import { BuildingInfo, ContactInfo, EventInJson } from "./InfoDrawer";

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

const handleShare = async ({
  roomID,
  stateRef,
}: {
  roomID: string;
  stateRef: MutableRefObject<{
    dispatch: (value: CampusContextAction) => void;
  }>;
}) => {
  const shareData = {
    title: "HTWKarte",
    text: "Schau dir diesen Raum der HTWK an:",
    url: `https://map.htwk-leipzig.de/${roomID}`,
  };
  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }
  if (!navigator.clipboard || !navigator.clipboard.writeText) return;
  await navigator.clipboard.writeText(shareData.url);
  stateRef.current.dispatch({
    type: "UPDATE_SNACKBAR_ITEM",
    snackbarItem: {
      message: "Link zum Raum kopiert!",
      severity: "success",
    },
  });
};

export const TitleBox = ({
  title,
  shareButton,
  currentRoomID,
  stateRef,
}: {
  title: string;
  shareButton: boolean;
  currentRoomID: string;
  stateRef: MutableRefObject<{
    dispatch: (value: CampusContextAction) => void;
  }>;
}) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
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
          <IconButton onClick={() => handleShare({ roomID: currentRoomID, stateRef })}>
            {typeof navigator.share === "function" ? (
              <ShareIcon sx={{ color: "#000000ee" }} />
            ) : (
              <CopyIcon sx={{ color: "#000000ee" }} />
            )}
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};

export const ImageBox = ({ building }: { building: string }) => {
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
      <img
        src={`/Images/${building}.png`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "0.5em",
        }}
      ></img>
    </Paper>
  );
};

export const ContactBox = ({ contact }: { contact: ContactInfo }) => {
  const contactContent = [];

  if (contact.person) contactContent.push(RoomInfoRow(contact.person));
  if (contact.email)
    contactContent.push(
      RoomInfoRow(
        <a style={{ color: HTWK_LIGHT_TEXT }} href={`mailto:${contact.email}`}>
          {contact.email}
        </a>,
      ),
    );
  if (contact.telephone && contact.telephone.length > 0) {
    const phoneNumber = contact.telephone[0].number;
    contactContent.push(
      RoomInfoRow(
        <a style={{ color: HTWK_LIGHT_TEXT + " !important" }} href={`tel:${phoneNumber}`}>
          {phoneNumber}
        </a>,
      ),
    );
  }
  if (contact.department) contactContent.push(RoomInfoRow(contact.department));

  return (
    <InfoBox
      icon={<PersonIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={contactContent}
    />
  );
};

export const BuildingBox = ({ building }: { building: BuildingInfo }) => {
  const buildingContent = [];

  if (building.abbreviation)
    buildingContent.push(RoomInfoRow("Gebäudekürzel: " + building.abbreviation));
  if (building.address) buildingContent.push(RoomInfoRow(building.address));
  if (building.janitor) buildingContent.push(RoomInfoRow("Hausmeister: " + building.janitor));
  if (building.abbreviation === "MN")
    buildingContent.push(
      RoomInfoRow(
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DiningIcon sx={{ marginRight: "0.2em" }} />
          <Link
            style={{ color: HTWK_LIGHT_TEXT }}
            href="https://mensa.heylinus.de/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "underline", paddingTop: "0.05em" }}
          >
            Mensa App
          </Link>
        </Box>,
      ),
    );

  return (
    <InfoBox
      icon={<HomeIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={buildingContent}
    />
  );
};

export const DescriptionBox = ({ description }: { description: string }) => {
  return (
    <InfoBox
      icon={<InfoIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={[RoomInfoRow(description)]}
    />
  );
};

const borderPulsate = keyframes`
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

const colorPulsate = keyframes`
  0% {
    color: ${HTWK_YELLOW + "00"};
  }
  50% {
    color: ${HTWK_YELLOW + "ff"};
  }
  100% {
    color: ${HTWK_YELLOW + "00"};
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
        animation: isNow ? `${borderPulsate} 3s infinite` : "none",
        position: "relative",
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
      {isNow && (
        <SensorsIcon
          sx={{
            position: "absolute",
            top: "0.3em",
            right: "0.3em",
            animation: `${colorPulsate} 3s infinite`,
          }}
        />
      )}
    </Paper>
  );
};

const isEventNow = (event: EventInJson, devMode: boolean): boolean => {
  const now = devMode ? new Date(new Date(event.start).setHours(13, 45, 0, 0)) : new Date();
  return now >= new Date(event.start) && now <= new Date(event.end);
};

export const EventBox = ({ events, devMode }: { events: EventInJson[]; devMode: boolean }) => {
  return (
    <Paper
      sx={{
        backgroundColor: BOX_COLOR,
      }}
    >
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.7em",
          pb: "1em",
        }}
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
