import { useEffect } from "react";
import { AllBuildingAbbreviations } from "../Constants";
import { useCampusState } from "./campus-context";
import { useCachedEvents, useHtwkContactsAPI } from "./Queries";

type ContactInJson_htwk = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: [
    {
      number: string;
    },
  ];
  department: string;
  room: {
    title: string;
    type: number;
  };
};

export type ContactInJson = {
  roomID: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: [
    {
      number: string;
    },
  ];
  department: string;
};

const extractRoomID = (roomTitle: string): string | undefined => {
  const roomID = roomTitle.match(/\(([^)]+)\)/)?.[1];

  // roomAbbreviation is on of the items in the FinishedBuildings array, so search if o
  const roomIDParts = roomID?.split(" ");
  if (!roomIDParts) return;

  // remove in every roomIDPart every occurrence of '(' or ')'
  roomIDParts?.forEach((part) => {
    part.replace("(", "");
    part.replace(")", "");
  });

  // search in every roomIDPart if in there is a substring that is one item in the FinishedBuildings array and return this
  let roomAbbreviation = roomIDParts.find((part) => AllBuildingAbbreviations.includes(part));

  // If Trefftz then search for sub building
  if (roomAbbreviation === "TR") {
    const TR_building = roomIDParts.find(
      (part) => part === "L" || part === "A" || part === "B" || part === "C",
    );
    if (!TR_building) return;
    roomAbbreviation = `${roomAbbreviation}_${TR_building}`;
  }
  if (!roomAbbreviation) return;

  // extract room number and remove the '.' if there is one (could cause problems with rooms like MZK03.1)
  let roomNumber = roomIDParts.find((part) => /\d/.test(part) && part !== "E2");
  if (!roomNumber) return;
  roomNumber = roomNumber.replace(".", "");

  return `${roomAbbreviation}${roomNumber}`;
};

const convert = (htwkRoomAPI_data: ContactInJson_htwk[]): ContactInJson[] => {
  const convertedData: ContactInJson[] = [];

  try {
    for (const room of htwkRoomAPI_data) {
      const roomID = extractRoomID(room.room.title);
      if (!roomID) continue;
      convertedData.push({
        roomID,
        firstName: room.firstName,
        lastName: room.lastName,
        email: room.email,
        telephone: room.telephone,
        department: room.department,
      });
    }
    return convertedData;
  } catch (e) {
    return [];
  }
};

const RoomMapping = () => {
  const [state, dispatch] = useCampusState();
  const htwkRoomAPI_data = useHtwkContactsAPI();
  const { data: cachedEvents } = useCachedEvents(state.devMode);

  useEffect(() => {
    if (!htwkRoomAPI_data) return;
    const convertedData = convert(htwkRoomAPI_data);
    dispatch({
      type: "UPDATE_CONTACT_INFO",
      dataOfContact: convertedData,
    });
  }, [htwkRoomAPI_data, dispatch]);

  useEffect(() => {
    if (!cachedEvents) return;
    dispatch({
      type: "UPDATE_CACHED_EVENTS",
      cachedEvents,
    });
  }, [cachedEvents, dispatch]);

  return null;
};

export default RoomMapping;
