import React, { createContext } from "react";
import { CampusContextAction, CampusContextProps } from "./campus-reducer";

export const initialCampusState: CampusContextProps = {
  position: [0, 0],
  zoomFactor: 0.03,
  currentBuilding: "None",
  currentCampus: "Campus-Karl-Liebknecht-Strasse",
  level: 0,
  levelCount: undefined,
  currentRoomID: "None",
  contactInfo: undefined,
  buildingInfo: undefined,
  campusInfo: undefined,
  cachedEvents: undefined,
  insideBuilding: false,
  darkMode: true,
  initialZoomReached: false,
  roomZoomReady: false,
  snackbarItem: {
    message: "",
    severity: "info",
  },
  devMode: false,
  focusedBuilding: undefined,
};

export const CampusStateContext = createContext<CampusContextProps>(initialCampusState);
export const CampusDispatchContext = createContext<React.Dispatch<CampusContextAction>>(() => null);

export const useCampusState = (): [CampusContextProps, React.Dispatch<CampusContextAction>] => {
  return [React.useContext(CampusStateContext), React.useContext(CampusDispatchContext)];
};
