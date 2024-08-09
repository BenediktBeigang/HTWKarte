import { useQuery } from "@tanstack/react-query";

const ONE_DAY_IN_MS = 86400000 as const;

export const useRoomInfo = () => {
  return useQuery({
    queryKey: ["roomInfo"],
    queryFn: () => fetch("/roomData.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useBuildingInfo = () => {
  return useQuery({
    queryKey: ["buildingInfo"],
    queryFn: () => fetch("/htwkBuildings.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useCampusInfo = () => {
  return useQuery({
    queryKey: ["campusInfo"],
    queryFn: () => fetch("/campusData.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};
