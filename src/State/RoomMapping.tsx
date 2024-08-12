import { useEffect } from "react";
import { useCampusState } from "./campus-context";
import { useHtwkRoomAPI } from "./Querys";

type RoomInJson_htwk = {
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

  // remove in every roomIDPart every occurence of '(' or ')'
  roomIDParts?.forEach((part) => {
    part.replace("(", "");
    part.replace(")", "");
  });

  const buildings: string[] = ["ZU", "GU", "MZ", "TR", "FE", "HB", "HO", "E2", "WI", "CL", "CE"];

  // search in every roomIDPart if in there is a substring that is one item in the FinishedBuildings array and return this
  let roomAbbreveation = roomIDParts.find((part) => buildings.includes(part));

  // If Treffts then search for sub building
  if (roomAbbreveation === "TR") {
    const TR_building = roomIDParts.find(
      (part) => part === "L" || part === "A" || part === "B" || part === "C",
    );
    if (!TR_building) return;
    roomAbbreveation = `${roomAbbreveation}_${TR_building}`;
  }
  if (!roomAbbreveation) return;

  // extract room number and remove the '.' if there is one (could cause problems with rooms like MZK03.1)
  let roomNumber = roomIDParts.find((part) => /\d/.test(part) && part !== "E2");
  if (!roomNumber) return;
  roomNumber = roomNumber.replace(".", "");

  return `${roomAbbreveation}${roomNumber}`;
};

const convert = (htwkRoomAPI_data: RoomInJson_htwk[]): ContactInJson[] => {
  const convertedData: ContactInJson[] = [];

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
};

const RoomMapping = () => {
  const [, dispatch] = useCampusState();
  const { data: htwkRoomAPI_data } = useHtwkRoomAPI();

  useEffect(() => {
    if (!htwkRoomAPI_data) return;
    const convertedData = convert(htwkRoomAPI_data.contacts);
    dispatch({
      type: "UPDATE_CONTACT_INFO",
      dataOfContact: convertedData,
    });
  }, [htwkRoomAPI_data, dispatch]);

  return null;
};

export default RoomMapping;
