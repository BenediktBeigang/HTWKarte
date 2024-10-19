import * as d3 from "d3";
import { MutableRefObject } from "react";
import { CampusContextAction, CampusContextProps } from "../State/campus-reducer";
import { ROOM, ROOM_HIGHTLIGHTED } from "../UI/Color";
import { BuildingInJson } from "./Building";

export const getFontSizeOfRoom = (
  roomWidth: number,
  roomHeight: number,
  text: string,
  fontSizeOverride: number = -1,
) => {
  if (fontSizeOverride > 0) return `${fontSizeOverride}em`;
  const emInPx = 16;
  const fontSize = 8;
  const charWidth = 0.6 * emInPx * fontSize;
  const lineHeight = 1.2 * emInPx * fontSize;
  let newFontSizeWidth = fontSize;
  if (text.length * charWidth > roomWidth) {
    newFontSizeWidth = (roomWidth / (text.length * charWidth)) * fontSize;
  }
  let newFontSizeHeight = fontSize;
  if (2 * lineHeight > roomHeight) {
    newFontSizeHeight = (roomHeight / (2 * lineHeight)) * fontSize;
  }
  const newFontSize = Math.min(newFontSizeWidth, newFontSizeHeight);
  return `${newFontSize}em`;
};

export const splitRoomName = (
  name: string,
): [buildingAbbreviation: string, roomName: string] | undefined => {
  try {
    if (name.startsWith("TR_L")) return [name.slice(0, 4), name.slice(4)];
    if (name.startsWith("TR_A")) return [name.slice(0, 4), name.slice(4)];
    if (name.startsWith("TR_B")) return [name.slice(0, 4), name.slice(4)];
    if (name.startsWith("TR_C")) return [name.slice(0, 4), name.slice(4)];
    return [name.slice(0, 2), name.slice(2)];
  } catch (error) {
    return undefined;
  }
};

export const getRoomName = (roomID: string) => {
  const roomName = roomID;
  return roomName.replace("-", ".");
};

export const updateRoomHighlighting = (roomID: string, active: boolean) => {
  roomID = roomID.replace("Ö", "O");
  const room = d3.select(`#${roomID}`);
  if (roomID === "" || !room) return;
  room
    .transition()
    .duration(300)
    .style("fill", active ? ROOM_HIGHTLIGHTED : ROOM);
};

export const pingRoom = (roomID: string) => {
  roomID = roomID.replace("Ö", "O");
  const room = d3.select(`#${roomID}`);
  if (roomID === "" || !room) return;
  blinkRoom(room, 2);
};

const blinkRoom = (room: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, times: number) => {
  if (times <= 0) return;
  room
    .transition()
    .duration(300)
    .style("fill", ROOM_HIGHTLIGHTED)
    .transition()
    .duration(300)
    .style("fill", ROOM)
    .on("end", () => blinkRoom(room, times - 1));
};

export const roomClickedHandler = (
  idOfClickedRoom: string,
  stateRef: MutableRefObject<{
    state: CampusContextProps;
    dispatch: (value: CampusContextAction) => void;
  }>,
) => {
  const idOfCurrentRoom = stateRef.current.state.currentRoomID;
  if (idOfClickedRoom === "None") return;

  if (idOfClickedRoom === idOfCurrentRoom) {
    stateRef.current.dispatch({ type: "UPDATE_ROOM", currentRoomID: "None" });
    return;
  }
  stateRef.current.dispatch({
    type: "UPDATE_ROOM",
    currentRoomID: idOfClickedRoom.replace("FO", "FÖ"),
  });
  updateRoomHighlighting(idOfClickedRoom, true);
};

export type ParsedRoomID = {
  buildingAbbreviation: string | undefined;
  level: number | undefined;
  room: string | undefined;
};

export const parseRoomID = (roomID: string | undefined): ParsedRoomID => {
  try {
    if (!roomID) throw new Error("Room ID is undefined");
    if (roomID.startsWith("TR")) return parseTrefftzRoomID(roomID);
    return {
      buildingAbbreviation: roomID.slice(0, 2),
      level: parseLevel(roomID),
      room: roomID.slice(3, roomID.length),
    };
  } catch (error) {
    return {
      buildingAbbreviation: undefined,
      level: undefined,
      room: undefined,
    };
  }
};

const parseLevel = (roomID: string, TR: boolean = false): number => {
  const level = TR ? roomID.slice(4, 5) : roomID.slice(2, 3);
  return level === "K" ? -1 : parseInt(level);
};

const parseTrefftzRoomID = (roomID: string): ParsedRoomID => {
  return {
    buildingAbbreviation: roomID.slice(0, 4),
    level: parseLevel(roomID, true),
    room: roomID.slice(5, roomID.length),
  };
};

export const campusOfRoom = (
  room: string | undefined,
  dataOfCBuildings: BuildingInJson[],
): string => {
  if (!room) return "None";
  const roomAbbreviation = room.substring(0, 2);
  const building = dataOfCBuildings.find(
    (building) => building.properties.Abbreviation === roomAbbreviation,
  );
  return building === undefined ? "None" : building.properties.Campus;
};
