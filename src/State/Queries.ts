import { useQuery } from "@tanstack/react-query";
import { BuildingInJson } from "../Map/MapTypes";
import { EventInJson } from "../UI/InfoDrawer/InfoDrawerTypes";

const ONE_DAY_IN_MS = 86400000 as const;
const ONE_HOUR_IN_MS = 3600000 as const;

export const useRoomInfo = () => {
  return useQuery({
    queryKey: ["roomInfo"],
    queryFn: () => fetch("/ExternalResources/roomDescriptions.json").then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useBuildingInfo = () => {
  return useQuery<BuildingInJson[], Error>({
    queryKey: ["buildingInfo"],
    queryFn: (): Promise<BuildingInJson[]> =>
      fetch("/Data/buildings.json").then((res) => res.json() as Promise<BuildingInJson[]>),
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
  const { data } = useQuery({
    queryKey: ["htwkContactsAPI"],
    queryFn: () =>
      fetch(
        // "https://corsproxy.io/?" + encodeURIComponent("https://app.htwk-leipzig.de/api/telephone"),
        // "https://app.htwk-leipzig.de/api/telephone",
        "/Data/contacts.json",
        {
          headers: {
            Accept: "application/ld+json",
          },
        },
      ).then((res) => res.json()),
    staleTime: ONE_DAY_IN_MS,
  });
  if (!data || !data.contacts) return [];
  return data?.contacts;
};

export const useCachedEvents = () => {
  const dayBeforeTwoWeeks = new Date(Date.now() - 14 * ONE_DAY_IN_MS).toISOString().split("T")[0];
  const dayInTwoWeeks = new Date(Date.now() + 14 * ONE_DAY_IN_MS).toISOString().split("T")[0];

  return useQuery({
    queryKey: ["cachedEvents"],
    queryFn: () =>
      fetch(
        `https://cal.htwk-leipzig.de/api/schedule?from=${dayBeforeTwoWeeks}&to=${dayInTwoWeeks}&mapped=true`,
      )
        .then((res) => res.json())
        .then((remoteEvents: any[]) =>
          fetch("/Data/lnc_events.json")
            .then((res) => res.json())
            .then((localEvents: EventInJson[]) => [...remoteEvents, ...localEvents]),
        ),
    staleTime: ONE_HOUR_IN_MS,
  });
};
