import * as d3 from "d3";
import { MutableRefObject } from "react";
import { CampusContextAction, CampusContextProps } from "./campus-reducer";
import { ROOM, ROOM_HIGHTLIGHTED } from "./Color";

export type RoomInJson = {
  id: string;
  name: string;
  person: string;
  adress: string;
  xOffset: number;
  yOffset: number;
};

export const getFontSizeOfRoom = (roomWidth: number, roomHeight: number, text: string) => {
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

export const splitRoomName = (name: string): string[] => {
  if (name.startsWith("K")) return [name.slice(0, 1), name.slice(1)];
  if (name.startsWith("TR_L")) return [name.slice(0, 4), name.slice(4)];
  if (name.startsWith("TR_A")) return [name.slice(0, 4), name.slice(4)];
  if (name.startsWith("TR_B")) return [name.slice(0, 4), name.slice(4)];
  if (name.startsWith("TR_C")) return [name.slice(0, 4), name.slice(4)];
  return [name.slice(0, 2), name.slice(2)];
};

export const getRoomName = (roomID: string, rooms: RoomInJson[]) => {
  if (!rooms || !Array.isArray(rooms)) return "";
  const room = rooms.find((room: RoomInJson) => room.id === roomID);
  return room && (room.name || room.name === "") ? room.name : roomID;
};

export const updateRoomHighlighting = (roomID: string, active: boolean) => {
  if (roomID === "") return;
  const room = d3.select(`#${roomID}`);
  if (!room) {
    console.error(`Room ${roomID} not found`);
    return;
  }
  room
    .transition()
    .duration(300)
    .style("fill", active ? ROOM_HIGHTLIGHTED : ROOM);
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
  stateRef.current.dispatch({ type: "UPDATE_ROOM", currentRoomID: idOfClickedRoom });
  updateRoomHighlighting(idOfClickedRoom, true);
};