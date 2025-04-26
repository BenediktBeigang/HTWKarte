import * as d3 from "d3";
import { useCampusState } from "../State/campus-context";
import { ROOM, ROOM_HIGHLIGHTED } from "../UI/Color";
import { ParsedRoomID } from "./MapTypes";

const useRooms = () => {
  const [state, dispatch] = useCampusState();

  const splitRoomName = (
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

  const updateRoomHighlighting = (roomID: string, active: boolean) => {
    roomID = roomID.replace("Ö", "O");
    const room = d3.select(`#${roomID}`);
    if (roomID === "" || !room) return;
    room
      .transition()
      .duration(300)
      .style("fill", active ? ROOM_HIGHLIGHTED : ROOM);
  };

  const pingRoom = (roomID: string) => {
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
      .style("fill", ROOM_HIGHLIGHTED)
      .transition()
      .duration(300)
      .style("fill", ROOM)
      .on("end", () => blinkRoom(room, times - 1));
  };

  const roomClickedHandler = (idOfClickedRoom: string) => {
    const idOfCurrentRoom = state.currentRoomID;
    if (idOfClickedRoom === "None") return;

    if (idOfClickedRoom === idOfCurrentRoom) {
      dispatch({ type: "UPDATE_ROOM", currentRoomID: "None" });
      return;
    }
    dispatch({ type: "UPDATE_ROOM", currentRoomID: idOfClickedRoom.replace("FO", "FÖ") });
    updateRoomHighlighting(idOfClickedRoom, true);
  };

  const parseRoomID = (roomID: string | undefined): ParsedRoomID => {
    try {
      if (!roomID) throw new Error("Room ID is undefined");
      if (roomID.startsWith("TR")) return parseTrefftzRoomID(roomID);
      return {
        buildingAbbreviation: roomID.slice(0, 2),
        level: parseLevel(roomID),
        room: roomID.slice(3, roomID.length),
      };
    } catch (error) {
      return { buildingAbbreviation: undefined, level: undefined, room: undefined };
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

  return { roomClickedHandler, splitRoomName, updateRoomHighlighting, parseRoomID, pingRoom };
};

export default useRooms;
