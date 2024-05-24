import { AppBar, Box, Button, IconButton, TextField, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { HTWKALENDER_GRAY } from "./Color";
import htwkLogo from "/Assets/htwkLogo.svg";

export const Header = () => {
  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: HTWKALENDER_GRAY + "ee" }}>
      <Toolbar>
        <Box display="flex" flexGrow={1}>
          <Box m={1}>
            <Link to="/">
              <IconButton edge="start" color="inherit" aria-label="logo">
                <img src={htwkLogo} alt="HTWK-Logo" style={{ height: "2em" }} />
              </IconButton>
            </Link>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" flexGrow={10}>
          <Box m={1}>
            <TextField label="Raum suchen..." variant="outlined" sx={{ width: "20em" }} />
          </Box>
        </Box>
        <Box display="flex" ml="auto" sx={{ height: "100%" }}>
          <Box m={1}>
            <Link to="/faq">
              <Button color="inherit">faq</Button>
            </Link>
          </Box>
          <Box m={1}>
            <Button color="inherit">imprint</Button>
          </Box>
          <Box m={1}>
            <Button color="inherit">privacy</Button>
          </Box>
          <Box m={1}></Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
