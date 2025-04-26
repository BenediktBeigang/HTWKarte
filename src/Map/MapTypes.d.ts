export type BuildingInJson = {
  type: string;
  properties: {
    Name: string;
    Abbreviation: string;
    Location: [number, number];
    Location_SVG: [number, number];
    Address: string;
    FloorCount: number;
    Floors: [number];
    TextXOffset: number;
    TextYOffset: number;
    Campus: string;
    Janitor: string;
    Description: string;
  };
  geometry: { coordinates: Array<Array<[number, number]>>; type: string };
};

export type ParsedRoomID = {
  buildingAbbreviation: FinishedBuildingType | undefined;
  level: number | undefined;
  room: string | undefined;
};

export type CampusInJson = {
  type: string;
  properties: {
    Name: string;
    Location: [number, number];
    MapWidth: number;
    MapHeight: number;
    CenterXOffset: number;
    CenterYOffset: number;
  };
  geometry: { coordinates: Array<Array<[number, number]>>; type: string };
};
