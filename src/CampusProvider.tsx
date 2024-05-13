import { PropsWithChildren, useEffect, useReducer } from "react";
import { CampusDispatchContext, CampusStateContext, initialCampusState } from "./campus-context";
import campusReducer from "./campus-reducer";

const fetchDataFromFile: (path: string, nameInStorage: string) => Promise<any[]> = async (
  path: string,
  nameInStorage: string,
) => {
  return new Promise((resolve) => {
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(nameInStorage, JSON.stringify(data));
        resolve(data);
      })
      .catch((error) => {
        console.log("Error: ", error);
        const localData = localStorage.getItem(nameInStorage);
        if (localData) {
          resolve(JSON.parse(localData));
        } else {
          resolve([]);
        }
      });
  });
};

const CampusProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(campusReducer, initialCampusState);

  const loadRoomInfo = async () => {
    const roomInfo = await fetchDataFromFile("/roomData.json", "roomInfo");
    dispatch({ type: "UPDATE_DATA_OF_ROOMS", dataOfRooms: roomInfo });
  };
  const loadBuildingInfo = async () => {
    const buildingInfo = await fetchDataFromFile("/htwkBuildings.json", "buildingInfo");
    dispatch({ type: "UPDATE_DATA_OF_BUILDINGS", dataOfBuildings: buildingInfo });
  };
  const loadCampusInfo = async () => {
    const campusInfo = await fetchDataFromFile("/campusData.json", "campusInfo");
    dispatch({ type: "UPDATE_DATA_OF_CAMPUS", dataOfCampus: campusInfo });
  };

  useEffect(() => {
    loadRoomInfo();
    loadBuildingInfo();
    loadCampusInfo();
  }, []);

  return (
    <CampusStateContext.Provider value={state}>
      <CampusDispatchContext.Provider value={dispatch}>{children}</CampusDispatchContext.Provider>
    </CampusStateContext.Provider>
  );
};

export default CampusProvider;
