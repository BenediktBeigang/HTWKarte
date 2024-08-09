import { PropsWithChildren, useReducer } from "react";
import { CampusDispatchContext, CampusStateContext, initialCampusState } from "./campus-context";
import campusReducer from "./campus-reducer";

const CampusProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(campusReducer, initialCampusState);

  return (
    <CampusStateContext.Provider value={state}>
      <CampusDispatchContext.Provider value={dispatch}>{children}</CampusDispatchContext.Provider>
    </CampusStateContext.Provider>
  );
};

export default CampusProvider;
