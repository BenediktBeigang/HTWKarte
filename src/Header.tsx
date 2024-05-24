import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { AppBar, Box, Button, IconButton, TextField, Toolbar } from "@mui/material";
import { useCampusState } from "./campus-context";
import { HTWK_GREEN, HTWK_YELLOW } from "./Color";
import htwkLogo from "/Assets/htwkLogo.svg";

export const Header = () => {
  const [state, dispatch] = useCampusState();

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar>
        <Box m={1}>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img src={htwkLogo} alt="HTWK-Logo" style={{ height: "2em" }} />
          </IconButton>
        </Box>
        <Box m={1}>
          <TextField
            inputProps={{ "aria-label": "search" }}
            label="Raum suchen..."
            variant="filled"
          />
        </Box>
        <Box m={1}>
          <Button color="inherit">faq</Button>
        </Box>
        <Box m={1}>
          <Button color="inherit">imprint</Button>
        </Box>
        <Box m={1}>
          <Button color="inherit">privacy</Button>
        </Box>
        <Box m={1}>
          <IconButton
            color="inherit"
            onClick={() => {
              dispatch({ type: "TOGGLE_DARK_MODE" });
            }}
            sx={{height: "2em", width: "2em"}}
            style={{ display: state.darkMode ? "inline-flex" : "none" }}
          >
            <LightModeIcon
              sx={{ borderRadius: "15px", color: "#000", fontSize: "1em" }}
              style={{ backgroundColor: HTWK_YELLOW }}
            />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              dispatch({ type: "TOGGLE_DARK_MODE" });
            }}
            style={{ display: state.darkMode ? "none" : "inline-flex" }} // Versteckt, wenn darkMode nicht aktiv ist
          >
            <DarkModeIcon
              sx={{ borderRadius: "15px", color: "#fff", fontSize: "1.8em" }}
              style={{ backgroundColor: HTWK_GREEN }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
