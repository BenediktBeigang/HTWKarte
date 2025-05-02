import { Divider, List, Paper } from "@mui/material";
import { ReactNode } from "react";
import { BOX_COLOR } from "../Color";

const BaseInfoBox = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => {
  return (
    <Paper sx={{ backgroundColor: BOX_COLOR }}>
      <List sx={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
        {icon}
        <Divider variant="middle" />
        {children}
      </List>
    </Paper>
  );
};

export default BaseInfoBox;
