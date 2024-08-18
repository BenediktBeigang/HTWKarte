import { useQuery } from "@tanstack/react-query";

const ONE_DAY_IN_MS = 86400000 as const;
const ONE_HOUR_IN_MS = 3600000 as const;

export const useRoomInfo = () => {
  return useQuery({
    queryKey: ["roomInfo"],
    queryFn: () => fetch("/Data/rooms.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useBuildingInfo = () => {
  return useQuery({
    queryKey: ["buildingInfo"],
    queryFn: () => fetch("/Data/buildings.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useCampusInfo = () => {
  return useQuery({
    queryKey: ["campusInfo"],
    queryFn: () => fetch("/Data/campus.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useHtwkRoomAPI = () => {
  return useQuery({
    queryKey: ["htwkRoomAPI"],
    queryFn: () =>
      fetch(
        // "https://asist-app.de/asist/rest/app/telephone/htwkl/search/_",
        "https://corsproxy.io/?" +
          encodeURIComponent("https://asist-app.de/asist/rest/app/telephone/htwkl/search/_"),
      ).then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useEventsInRoom = (roomID: string, devMode: boolean) => {
  let today: string = "2024-06-04";
  let tomorrow: string = "2024-06-05";

  if (devMode === false) {
    const todayObject = new Date();
    today = todayObject.toISOString().split("T")[0];
    const tomorrowObject = new Date(todayObject);
    tomorrowObject.setDate(tomorrowObject.getDate() + 1);
    tomorrow = tomorrowObject.toISOString().split("T")[0];
  }

  return useQuery({
    queryKey: ["eventInRoom", roomID],
    queryFn: () =>
      fetch(
        `https://cal.htwk-leipzig.de/api/schedule?room=${roomID}&from=${today}&to=${tomorrow}&mapped=true`,
      ).then((res) => res.json()),
    staleTime: ONE_HOUR_IN_MS,
  });
};
