import EventIcon from "@mui/icons-material/Event";
import { Divider, List, Paper, Typography } from "@mui/material";
import { BOX_COLOR } from "../Color";
import EventContent from "./EventContent";
import { EventInJson } from "./InfoDrawerTypes";

const isEventNow = (event: EventInJson, devMode: boolean): boolean => {
  const now = devMode ? new Date(new Date(event.start).setHours(13, 45, 0, 0)) : new Date();
  return now >= new Date(event.start) && now <= new Date(event.end);
};

const EventBox = ({ events, devMode }: { events: EventInJson[]; devMode: boolean }) => {
  return (
    <Paper sx={{ backgroundColor: BOX_COLOR }}>
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
          <EventContent key={index} isNow={isEventNow(event, devMode)} eventData={event} />
        ))}
      </List>
    </Paper>
  );
};

export default EventBox;
