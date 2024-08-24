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

export const useHtwkContactsAPI = () => {
  return useQuery({
    queryKey: ["htwkContactsAPI"],
    queryFn: () =>
      fetch(
        "https://corsproxy.io/?" + encodeURIComponent("https://app.htwk-leipzig.de/api/telephone"),
        {
          headers: {
            Accept: "application/ld+json",
          },
        },
      ).then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useCachedEvents = (devMode: boolean) => {
  let today = "2024-06-04";
  let dayInTwoWeeks = "2024-06-18";

  if (devMode === false) {
    const todayObject = new Date();
    today = todayObject.toISOString().split("T")[0];

    const dayInTwoWeeksObject = new Date(todayObject);
    dayInTwoWeeksObject.setDate(todayObject.getDate() + 14);
    dayInTwoWeeks = dayInTwoWeeksObject.toISOString().split("T")[0];
  }

  return useQuery({
    queryKey: ["cachedEvents", devMode],
    queryFn: () =>
      fetch(
        `https://cal.htwk-leipzig.de/api/schedule?from=${today}&to=${dayInTwoWeeks}&mapped=true`,
      ).then((res) => res.json()),
    staleTime: ONE_HOUR_IN_MS,
  });
};
