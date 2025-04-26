import { Divider, List, Paper } from "@mui/material";
import { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";
import { BOX_COLOR } from "../Color";

const BaseInfoBox = ({ icon, content }: { icon: ReactNode; content: ReactNode[] }) => {
  return (
    <Paper sx={{ backgroundColor: BOX_COLOR }}>
      <List sx={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
        {icon}
        <Divider variant="middle" />
        {content.map((item, index) => (
          <Fragment key={index}>
            {item}
            {index < content.length - 1 && <Divider variant="middle" />}
          </Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default BaseInfoBox;
