import { ListItem, Typography } from "@mui/material";

const BaseInfoRow = (content: string | any, muiVariant: any = "body1") => {
  return (
    <ListItem>
      <Typography variant={muiVariant}>{content}</Typography>
    </ListItem>
  );
};

export default BaseInfoRow;
