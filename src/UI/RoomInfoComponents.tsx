import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { Divider, List, ListItem, Paper, Typography } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import { HTWK_LIGHT_TEXT, ROOM } from "./Color";
import RoomInfo from "./RoomInfo";

const BOX_COLOR = ROOM + "dd";

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
  if (roomInfo.telephone) contactContent.push(RoomInfoRow(roomInfo.telephone[0].number));
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
