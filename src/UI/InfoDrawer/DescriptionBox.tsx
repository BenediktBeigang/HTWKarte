import InfoIcon from "@mui/icons-material/Info";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCampusState } from "../../State/campus-context";
import BaseInfoBox from "./BaseInfoBox";
import useInfoDrawer from "./useInfoDrawer";

export const DescriptionBox = () => {
  const { focusedBuilding } = useCampusState()[0];
  const [descriptionText, setDescriptionText] = useState<string | null>(null);
  const { buildingCard, roomCard } = useInfoDrawer();

  useEffect(() => {
    if (buildingCard && focusedBuilding && buildingCard.description)
      return setDescriptionText(buildingCard.description);
    if (roomCard?.description) return setDescriptionText(roomCard.description);
    setDescriptionText(null);
  }, [buildingCard, roomCard]);

  if (!descriptionText) return <></>;

  return (
    <BaseInfoBox icon={<InfoIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}>
      <Typography variant="body1" sx={{ margin: "1em" }}>
        {descriptionText}
      </Typography>
    </BaseInfoBox>
  );
};

export default DescriptionBox;
