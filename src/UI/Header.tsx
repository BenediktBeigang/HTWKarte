import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  Hidden,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import "primeicons/primeicons.css";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCampusState } from "../State/campus-context";
import { HTWKALENDER_GRAY } from "./Color";
import htwkLogo from "/Assets/htwkLogo.svg";

const correctRoomSearchTerm = (searchedRoomID: string) => {
  const roomID = searchedRoomID.toUpperCase();
  const roomIDWithoutSpaces = roomID.replace(/\s/g, "");
  return roomIDWithoutSpaces;
};

const HeaderButton = (subPage: string, iconName: string) => {
  return (
    <MuiLink to={`/${subPage}`} component={RouterLink}>
      <ListItemButton>
        <ListItemIcon>
          <i className={iconName} style={{ fontSize: "1.2rem" }} />
        </ListItemIcon>
        <ListItemText primary={subPage} />
      </ListItemButton>
    </MuiLink>
  );
};

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const correctedRoomID: string = correctRoomSearchTerm(searchValue);
    setSearchValue(correctedRoomID);
    navigate(`/room/${correctedRoomID}`);
    if (inputRef.current) inputRef.current.blur();

    // event.preventDefault();
    // dispatch({
    //   type: "UPDATE_ROOM_ZOOM_READY",
    //   roomZoomReady: false,
    // });
    // stateRef.current.dispatch({
    //   type: "UPDATE_INITIAL_ZOOM_REACHED",
    //   initialZoomReached: false,
    // });
    // roomZoomEventHandler(stateRef, searchValue);
  };

  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  const drawer = (
    <Box
      sx={{
        margin: "0.5em",
      }}
    >
      {HeaderButton("faq", "pi pi-book")}
      {HeaderButton("imprint", "pi pi-id-card")}
      {HeaderButton("privacy", "pi pi-exclamation-triangle")}
    </Box>
  );

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: HTWKALENDER_GRAY + "00" }}>
      <Toolbar>
        <Box display="flex">
          <Box m={1}>
            <MuiLink to="/" component={RouterLink}>
              <IconButton edge="start" color="inherit" aria-label="logo">
                <img src={htwkLogo} alt="HTWK-Logo" style={{ height: "2em" }} />
              </IconButton>
            </MuiLink>
          </Box>
        </Box>
        <Hidden smUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          <Box m={1}>
            <TextField
              label="Raum suchen..."
              variant="outlined"
              sx={{ backgroundColor: HTWKALENDER_GRAY + "aa", minWidth: "5em" }}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              onKeyDown={handleSearchKeyPress}
              inputRef={inputRef}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          sx={{ padding: "0.5em", borderRadius: "10px", backgroundColor: "#ff0000" + "cc" }}
        >
          <Tooltip title="Die Seite befindet sich noch in der Entwicklung. Features können fehlerhaft oder nicht fertiggestellt sein.">
            <Typography>Alpha Version</Typography>
          </Tooltip>
        </Box>
        <Drawer variant="temporary" anchor="top" open={mobileOpen} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
        <Hidden smDown>
          <Box display="flex" ml="auto" sx={{ height: "100%" }}>
            {HeaderButton("faq", "pi pi-book")}
            {HeaderButton("imprint", "pi pi-id-card")}
            {HeaderButton("privacy", "pi pi-exclamation-triangle")}
          </Box>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
