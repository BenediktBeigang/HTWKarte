import DiningIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Info";
import { Box, Link } from "@mui/material";
import { HTWK_LIGHT_TEXT } from "../Color";
import InfoBox from "./BaseInfoBox";
import BaseInfoRow from "./BaseInfoRow";
import { BuildingInfo } from "./InfoDrawerTypes";

export const BuildingBox = ({ building }: { building: BuildingInfo }) => {
  const buildingContent = [];

  if (building.abbreviation)
    buildingContent.push(BaseInfoRow("Gebäudekürzel: " + building.abbreviation));
  if (building.address) buildingContent.push(BaseInfoRow(building.address));
  if (building.janitor) buildingContent.push(BaseInfoRow("Hausmeister: " + building.janitor));
  if (building.abbreviation === "MN")
    buildingContent.push(
      BaseInfoRow(
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DiningIcon sx={{ marginRight: "0.2em" }} />
          <Link
            style={{ color: HTWK_LIGHT_TEXT }}
            href="https://mensa.heylinus.de/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "underline", paddingTop: "0.05em" }}
          >
            Mensa App
          </Link>
        </Box>,
      ),
    );

  return (
    <InfoBox
      icon={<HomeIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={buildingContent}
    />
  );
};

export default BuildingBox;
