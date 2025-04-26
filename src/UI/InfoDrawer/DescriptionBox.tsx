import InfoIcon from "@mui/icons-material/Info";
import InfoBox from "./BaseInfoBox";
import BaseInfoRow from "./BaseInfoRow";

export const DescriptionBox = ({ description }: { description: string }) => {
  return (
    <InfoBox
      icon={<InfoIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={[BaseInfoRow(description)]}
    />
  );
};

export default DescriptionBox;
