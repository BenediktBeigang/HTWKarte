import EventIcon from "@mui/icons-material/Event";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCampusState } from "../../State/campus-context";
import { BOX_COLOR, HTWK_YELLOW } from "../Color";
import EventContent from "./EventContent";
import { EventInJson } from "./InfoDrawerTypes";

const isEventNow = (event: EventInJson): boolean => {
  const now = new Date();
  return now >= new Date(event.start) && now <= new Date(event.end);
};

const JumpDayButton = (
  left: boolean,
  offsetFromNow: number,
  setOffsetFromNow: (value: number) => void,
) => {
  return (
    <IconButton
      sx={{
        borderRadius: "5px",
        width: "1.5em",
        height: "1.5em",
        ":hover": { backgroundColor: "#ffffff66" },
      }}
    >
      {left ? (
        <KeyboardArrowLeftIcon
          sx={{ color: HTWK_YELLOW, fontSize: "1.5em" }}
          onClick={() => {
            if (offsetFromNow - 1 > -7) setOffsetFromNow(offsetFromNow - 1);
          }}
        />
      ) : (
        <KeyboardArrowRightIcon
          sx={{ color: HTWK_YELLOW, fontSize: "1.5em" }}
          onClick={() => {
            if (offsetFromNow + 1 < 7) setOffsetFromNow(offsetFromNow + 1);
          }}
        />
      )}
    </IconButton>
  );
};

const getDayText = (offsetFromToday: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetFromToday);
  switch (offsetFromToday) {
    case 0:
      return "Heute";
    case 1:
      return "Morgen";
    case -1:
      return "Gestern";
    default:
      const weekday = date.toLocaleDateString("de-DE", { weekday: "short" });
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${weekday} ${day}.${month}.${year}`;
  }
};

const EventBox = () => {
  const [{ currentRoomID, cachedEvents }] = useCampusState();
  const [eventsOnDay, setEventsOnDay] = useState<EventInJson[] | null | "DONT_SHOW">(null);
  const [offsetFromNow, setOffsetFromNow] = useState<number>(0);

  useEffect(() => {
    if (currentRoomID === "None" || !cachedEvents) return setEventsOnDay("DONT_SHOW");

    const date = new Date();
    date.setDate(date.getDate() + offsetFromNow);

    const eventsInRoom: EventInJson[] = cachedEvents.filter((event) =>
      event.rooms.split(" ").includes(currentRoomID),
    );
    if (eventsInRoom.length === 0) return setEventsOnDay("DONT_SHOW"); // No events in this room

    const dayToShow = date.toISOString().split("T")[0];
    const eventsInRoomOnThisDay: EventInJson[] = eventsInRoom.filter(
      (event) => new Date(event.start).toISOString().split("T")[0] === dayToShow,
    );

    setEventsOnDay(
      eventsInRoomOnThisDay.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      ),
    );
  }, [cachedEvents, currentRoomID, offsetFromNow]);

  if (eventsOnDay === "DONT_SHOW") return <></>;

  return (
    <Paper sx={{ backgroundColor: BOX_COLOR }}>
      <Stack sx={{ gap: "0.5em", padding: "1em", paddingTop: "0.5em" }}>
        <EventIcon sx={{ alignSelf: "center" }} />
        <Divider />
        <Typography sx={{ alignSelf: "center", userSelect: "none" }}>
          <b>Veranstaltungen</b>
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          marginX="1em"
          marginBottom="0.5em"
        >
          {JumpDayButton(true, offsetFromNow, setOffsetFromNow)}
          <Typography sx={{ userSelect: "none" }}>
            <b>{getDayText(offsetFromNow)}</b>
          </Typography>
          {JumpDayButton(false, offsetFromNow, setOffsetFromNow)}
        </Stack>
        {eventsOnDay && eventsOnDay.length > 0 ? (
          eventsOnDay.map((event, index) => (
            <EventContent
              key={index}
              isNow={isEventNow(event)}
              eventData={event}
              offsetFromNow={offsetFromNow}
              setOffsetFromNow={setOffsetFromNow}
            />
          ))
        ) : (
          <EventContent
            key={0}
            isNow={false}
            eventData={null}
            offsetFromNow={offsetFromNow}
            setOffsetFromNow={setOffsetFromNow}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default EventBox;
