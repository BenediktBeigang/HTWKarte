import { BuildingInJson, CampusInJson } from "../Map/MapTypes";
import { ContactInJson } from "../State/RoomMapping";
import { SnackbarItem } from "../UI/CustomSnackbar";
import { EventInJson } from "../UI/InfoDrawer/InfoDrawerTypes";

export type CampusContextProps = {
  position: [number, number];
  zoomFactor: number;
  currentBuilding: string;
  currentCampus: string;
  level: number;
  levelCount: number | undefined;
  currentRoomID: string;
  contactInfo?: ContactInJson[];
  buildingInfo?: BuildingInJson;
  campusInfo?: CampusInJson;
  cachedEvents?: EventInJson[];
  insideBuilding: boolean;
  darkMode: boolean;
  initialZoomReached: boolean;
  roomZoomReady?: boolean;
  snackbarItem: SnackbarItem;
  lncMode: boolean;
  lncModeOverride: boolean;
  focusedBuilding?: string;
};

export type CampusContextAction =
  | { type: "UPDATE_POSITION"; position: [number, number] }
  | { type: "UPDATE_ZOOM"; zoomFactor: number }
  | { type: "UPDATE_BUILDING"; currentBuilding: string }
  | { type: "UPDATE_CAMPUS"; currentCampus: string }
  | { type: "UPDATE_LEVEL"; level: number }
  | { type: "UPDATE_LEVEL_COUNT"; levelCount: number | undefined }
  | { type: "UPDATE_ROOM"; currentRoomID: string }
  | { type: "UPDATE_CONTACT_INFO"; dataOfContact: ContactInJson[] }
  | { type: "UPDATE_BUILDING_INFO"; dataOfBuilding: BuildingInJson }
  | { type: "UPDATE_CAMPUS_INFO"; dataOfCampus: CampusInJson }
  | { type: "UPDATE_CACHED_EVENTS"; cachedEvents: EventInJson[] }
  | { type: "UPDATE_INSIDE_BUILDING"; insideBuilding: boolean }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "UPDATE_INITIAL_ZOOM_REACHED"; initialZoomReached: boolean }
  | { type: "UPDATE_ROOM_ZOOM_READY"; roomZoomReady: boolean }
  | { type: "UPDATE_SNACKBAR_ITEM"; snackbarItem: SnackbarItem }
  | { type: "ACTIVATE_LNC_MODE" }
  | { type: "UPDATE_LNC_MODE_OVERRIDE" }
  | { type: "UPDATE_FOCUSED_BUILDING"; focusedBuilding: string | undefined };

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
    case "UPDATE_CONTACT_INFO":
      return { ...state, contactInfo: action.dataOfContact };
    case "UPDATE_BUILDING_INFO":
      return { ...state, buildingInfo: action.dataOfBuilding };
    case "UPDATE_CAMPUS_INFO":
      return { ...state, campusInfo: action.dataOfCampus };
    case "UPDATE_CACHED_EVENTS":
      return { ...state, cachedEvents: action.cachedEvents };
    case "UPDATE_INSIDE_BUILDING":
      return { ...state, insideBuilding: action.insideBuilding };
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    case "UPDATE_INITIAL_ZOOM_REACHED":
      return { ...state, initialZoomReached: action.initialZoomReached };
    case "UPDATE_ROOM_ZOOM_READY":
      return { ...state, roomZoomReady: action.roomZoomReady };
    case "UPDATE_SNACKBAR_ITEM":
      return { ...state, snackbarItem: action.snackbarItem };
    case "ACTIVATE_LNC_MODE":
      return { ...state, lncMode: true };
    case "UPDATE_LNC_MODE_OVERRIDE":
      return { ...state, lncModeOverride: true };
    case "UPDATE_FOCUSED_BUILDING":
      return { ...state, focusedBuilding: action.focusedBuilding };
    default:
      return state;
  }
};

export default campusReducer;
