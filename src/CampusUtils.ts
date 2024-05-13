import { BuildingInJson } from "./Building";

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
