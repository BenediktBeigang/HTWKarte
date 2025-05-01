import { Typography } from "@mui/material";

const BaseInfoRow = (content: string | any, muiVariant: any = "body1") => {
  return <Typography variant={muiVariant}>{content}</Typography>;
};

export default BaseInfoRow;
