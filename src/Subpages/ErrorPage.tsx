import { Box, Typography } from "@mui/material";
import { Header } from "../UI/Header";
import PageNotFound_SVG from "/Icons/PageNotFound.svg";

export const ErrorPage = () => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Header />
      <Box style={{ width: "30%" }}>
        <img src={PageNotFound_SVG} style={{ width: "100%" }} alt="Error" />
      </Box>
      <Typography variant="h5" align="center">
        Upps! Diese Seite ist wohl gerade in der Mensa.
      </Typography>
    </Box>
  );
};
