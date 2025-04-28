import { useEffect, useState } from "react";
import { BuildingInJson, RoomInJson } from "../../Map/MapTypes";
import useRooms from "../../Map/useRooms";
import { useCampusState } from "../../State/campus-context";
import { useBuildingInfo, useRoomInfo } from "../../State/Queries";
import { BuildingInfo, ContactInfo } from "./InfoDrawerTypes";

const useInfoDrawer = () => {
  const [{ currentRoomID, contactInfo, focusedBuilding }, dispatch] = useCampusState();
  const [contactCard, setContactCard] = useState<ContactInfo | null>(null);
  const [buildingCard, setBuildingCard] = useState<BuildingInfo | null>(null);
  const [roomCard, setRoomCard] = useState<RoomInJson | null>(null);
  const { data: buildingInfo_data } = useBuildingInfo();
  const { splitRoomName } = useRooms();
  const { data: roomInfo_data } = useRoomInfo();

  const handleShare = async (roomID: string) => {
    const shareData = {
      title: "HTWKarte",
      text: "Schau dir diesen Raum der HTWK an:",
      url: `https://map.htwk-leipzig.de/${roomID}`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    await navigator.clipboard.writeText(shareData.url);
    dispatch({
      type: "UPDATE_SNACKBAR_ITEM",
      snackbarItem: { message: "Link zum Raum kopiert!", severity: "success" },
    });
  };

  useEffect(() => {
    if (currentRoomID === "None" || !contactInfo) return setContactCard(null);
    const contact = contactInfo.find((room) => room.roomID === currentRoomID);
    if (!contact) return setContactCard(null);
    setContactCard({
      roomName: splitRoomName(currentRoomID)?.join(" ") ?? currentRoomID,
      person: `${contact.firstName} ${contact.lastName}`,
      email: contact.email ?? "",
      telephone: contact.telephone ?? [],
      department: contact.department,
    });
  }, [currentRoomID, contactInfo]);

  useEffect(() => {
    if (focusedBuilding === undefined || buildingInfo_data === undefined)
      return setBuildingCard(null);
    const buildingInfo: BuildingInJson | undefined = buildingInfo_data.find(
      (building: BuildingInJson) => building.properties.Abbreviation === focusedBuilding,
    );
    if (!buildingInfo) return setBuildingCard(null);
    setBuildingCard({
      name: buildingInfo.properties.Name,
      address: buildingInfo.properties.Address,
      abbreviation: buildingInfo.properties.Abbreviation,
      janitor: buildingInfo.properties.Janitor ?? undefined,
      description: buildingInfo.properties.Description ?? undefined,
    });
  }, [buildingInfo_data, focusedBuilding]);

  useEffect(() => {
    if (currentRoomID === "None") return setRoomCard(null);

    const roomInfo: RoomInJson | undefined = roomInfo_data?.[currentRoomID];
    if (!roomInfo) return setRoomCard(null);
    setRoomCard(roomInfo);
  }, [buildingInfo_data, focusedBuilding]);

  return { handleShare, contactCard, buildingCard, roomCard };
};

export default useInfoDrawer;
