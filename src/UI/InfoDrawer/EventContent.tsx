import SensorsIcon from "@mui/icons-material/Sensors";
import { Divider, keyframes, Paper, Typography } from "@mui/material";
import { format, FormatOptions } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { HTWK_YELLOW } from "../Color";
import { EventInJson } from "./InfoDrawerTypes";

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

const EventContent = ({ isNow, eventData }: { isNow: boolean; eventData: EventInJson }) => {
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
      <Typography sx={{ wordWrap: "break-word", overflow: "hidden", textOverflow: "ellipsis" }}>
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

export default EventContent;