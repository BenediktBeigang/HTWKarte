import { useCampusState } from "../../State/campus-context";

const useInfoDrawer = () => {
  const [, dispatch] = useCampusState();

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

  return { handleShare };
};

export default useInfoDrawer;
