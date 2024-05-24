import { BuildingInJson } from "./Building";
import { CampusInJson } from "./Campus";
import { RoomInJson } from "./Room";

export type CampusContextProps = {
  position: [number, number];
  zoomFactor: number;
  currentBuilding: string;
  currentCampus: string;
  level: number;
  levelCount: number;
  currentRoomID: string;
  dataOfRooms: RoomInJson[];
  dataOfBuildings: BuildingInJson[];
  dataOfCampus: CampusInJson[];
  insideBuilding: boolean;
  darkMode: boolean;
};

export type CampusContextAction =
  | { type: "UPDATE_POSITION"; position: [number, number] }
  | { type: "UPDATE_ZOOM"; zoomFactor: number }
  | { type: "UPDATE_BUILDING"; currentBuilding: string }
  | { type: "UPDATE_CAMPUS"; currentCampus: string }
  | { type: "UPDATE_LEVEL"; level: number }
  | { type: "UPDATE_LEVEL_COUNT"; levelCount: number }
  | { type: "UPDATE_ROOM"; currentRoomID: string }
  | { type: "UPDATE_DATA_OF_ROOMS"; dataOfRooms: RoomInJson[] }
  | { type: "UPDATE_DATA_OF_BUILDINGS"; dataOfBuildings: BuildingInJson[] }
  | { type: "UPDATE_DATA_OF_CAMPUS"; dataOfCampus: CampusInJson[] }
  | { type: "UPDATE_INSIDE_BUILDING"; insideBuilding: boolean }
  | { type: "TOGGLE_DARK_MODE" };

const campusReducer = (
  state: CampusContextProps,
  action: CampusContextAction,
): CampusContextProps => {
  switch (action.type) {
    case "UPDATE_POSITION":
      return { ...state, position: action.position };
    case "UPDATE_ZOOM":
      return { ...state, zoomFactor: action.zoomFactor };
    case "UPDATE_BUILDING":
      return { ...state, currentBuilding: action.currentBuilding };
    case "UPDATE_CAMPUS":
      return { ...state, currentCampus: action.currentCampus };
    case "UPDATE_LEVEL":
      return { ...state, level: action.level };
    case "UPDATE_LEVEL_COUNT":
      return { ...state, levelCount: action.levelCount };
    case "UPDATE_ROOM":
      return { ...state, currentRoomID: action.currentRoomID };
    case "UPDATE_DATA_OF_ROOMS":
      return { ...state, dataOfRooms: action.dataOfRooms };
    case "UPDATE_DATA_OF_BUILDINGS":
      return { ...state, dataOfBuildings: action.dataOfBuildings };
    case "UPDATE_DATA_OF_CAMPUS":
      return { ...state, dataOfCampus: action.dataOfCampus };
    case "UPDATE_INSIDE_BUILDING":
      return { ...state, insideBuilding: action.insideBuilding };
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
};

export default campusReducer;
