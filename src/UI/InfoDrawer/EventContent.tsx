import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SensorsIcon from "@mui/icons-material/Sensors";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  keyframes,
  Stack,
  Typography,
} from "@mui/material";
import { format, FormatOptions, isEqual } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useSwipeable } from "react-swipeable";
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
      return eventType ?? "";
  }
};

type EventContentProps = {
  isNow: boolean;
  eventData: EventInJson | null;
  offsetFromNow: number;
  setOffsetFromNow: (value: number) => void;
};

const EventContent = ({ isNow, eventData, offsetFromNow, setOffsetFromNow }: EventContentProps) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (offsetFromNow + 1 < 7) setOffsetFromNow(offsetFromNow + 1);
    },
    onSwipedRight: () => {
      if (offsetFromNow - 1 > -7) setOffsetFromNow(offsetFromNow - 1);
    },
    trackMouse: true,
  });

  if (eventData === null)
    return (
      <Box
        {...swipeHandlers}
        sx={{
          backgroundColor: "#ffffff55",
          borderRadius: "5px",
          padding: "1em",
        }}
      >
        <Typography textAlign="center">Keine Veranstaltungen an diesem Tag.</Typography>
      </Box>
    );

  const eventTypeVisible = (eventType: string) =>
    eventData.eventType && eventData.eventType !== "nicht zugewiesen" && eventType !== "Zentral";
  const lncSimpleBox =
    isEqual(eventData.start, new Date("2025-05-10T12:00:00.000Z")) &&
    isEqual(eventData.end, new Date("2025-05-11T01:00:00.000Z"));

  isNow = lncSimpleBox ? false : isNow;

  return (
    <Accordion
      {...swipeHandlers}
      disableGutters
      sx={{
        backgroundColor: "#ffffff55",
        animation: isNow ? `${borderPulsate} 3s infinite` : "none",
        borderRadius: "5px",
      }}
    >
      <AccordionSummary
        sx={{ position: "relative" }}
        expandIcon={eventData.notes ? <ExpandMoreIcon /> : <></>}
      >
        <Stack direction="row" spacing={2} sx={{ padding: "0.5em" }}>
          {!lncSimpleBox && (
            <>
              <Typography sx={{ textAlign: "right" }}>
                {formatEventTime(eventData.start, "Europe/Berlin")}
                <br />
                {formatEventTime(eventData.end, "Europe/Berlin")}
              </Typography>
              <Divider orientation="vertical" flexItem />
            </>
          )}
          <Typography
            sx={{
              wordBreak: "break-all",
              overflowWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {eventTypeVisible(eventData.eventType) && `${formatEventType(eventData.eventType)}`}
            {eventTypeVisible(eventData.eventType) && <br />}
            {`${eventData.name}`}
          </Typography>
        </Stack>
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
      </AccordionSummary>
      {eventData.notes && (
        <AccordionDetails>
          <Divider sx={{ marginBottom: "1em" }} />
          <Typography>{eventData.notes}</Typography>
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default EventContent;
