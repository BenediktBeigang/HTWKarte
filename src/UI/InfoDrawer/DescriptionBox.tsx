import InfoIcon from "@mui/icons-material/Info";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCampusState } from "../../State/campus-context";
import { HTWK_LIGHT_TEXT } from "../Color";
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
      <Stack sx={{ paddingX: "1em", paddingY: "0.5em", gap: "0.5em" }}>
        {roomCard && (
          <Link
            style={{ color: HTWK_LIGHT_TEXT }}
            href={roomCard?.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer", marginTop: "0.3em" }}
              onClick={() => {}}
            >
              <Typography
                variant="subtitle1"
                sx={{ userSelect: "none", textDecoration: "underline" }}
              >
                {roomCard?.name}
              </Typography>

              <OpenInNewIcon sx={{ fontSize: "1.2em" }} />
            </Stack>
          </Link>
        )}

        <Typography>{descriptionText}</Typography>
      </Stack>
    </BaseInfoBox>
  );
};

export default DescriptionBox;
