import DiningIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Info";
import { Box, Divider, Link, Stack, Typography } from "@mui/material";
import { useCampusState } from "../../State/campus-context";
import { HTWK_LIGHT_TEXT } from "../Color";
import BaseInfoBox from "./BaseInfoBox";
import useInfoDrawer from "./useInfoDrawer";

export const BuildingBox = () => {
  const { focusedBuilding } = useCampusState()[0];
  const { buildingCard } = useInfoDrawer();

  if (!buildingCard || !focusedBuilding) return <></>;

  return (
    <BaseInfoBox icon={<HomeIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}>
      <Stack sx={{ paddingX: "1em", paddingY: "0.5em", gap: "0.5em", justifyContent: "left" }}>
        <Typography>
          {buildingCard.abbreviation && "Gebäudekürzel: " + buildingCard.abbreviation}
        </Typography>

        {buildingCard.address && (
          <>
            <Divider sx={{ opacity: 0.2 }} />
            <Typography>{buildingCard.address}</Typography>
          </>
        )}

        {buildingCard.janitor && (
          <>
            <Divider sx={{ opacity: 0.2 }} />
            <Typography>{"Hausmeister: " + buildingCard.janitor}</Typography>
          </>
        )}

        {buildingCard.abbreviation === "MN" && (
          <>
            <Divider sx={{ opacity: 0.2 }} />
            {buildingCard.abbreviation === "MN" && (
              <Box sx={{ display: "flex", justifyContent: "Left", alignItems: "center" }}>
                <DiningIcon sx={{ marginRight: "0.2em" }} />
                <Link
                  style={{ color: HTWK_LIGHT_TEXT }}
                  href="https://mensa.heylinus.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: "underline",
                    paddingTop: "0.05em",
                    fontSize: "1.1em",
                  }}
                >
                  Mensa App
                </Link>
              </Box>
            )}
          </>
        )}
      </Stack>
    </BaseInfoBox>
  );
};

export default BuildingBox;
