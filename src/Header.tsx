import ContactMailIcon from "@mui/icons-material/ContactMail";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuIcon from "@mui/icons-material/Menu";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
import { Link as RouterLink } from "react-router-dom";
import { useCampusState } from "./campus-context";
import { HTWKALENDER_GRAY } from "./Color";
import { roomZoomEventHandler } from "./ZoomHandler";
import htwkLogo from "/Assets/htwkLogo.svg";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dispatch({
        type: "UPDATE_ROOM_ZOOM_READY",
        roomZoomReady: false,
      });
      stateRef.current.dispatch({
        type: "UPDATE_INITIAL_ZOOM_REACHED",
        initialZoomReached: false,
      });
      roomZoomEventHandler(stateRef, searchValue);
    }
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
      <MuiLink to="/faq" component={RouterLink}>
        <ListItemButton>
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
          <ListItemText primary="faq" sx={{ textDecoration: "none" }} />
        </ListItemButton>
      </MuiLink>

      <MuiLink to="/imprint" component={RouterLink}>
        <ListItemButton>
          <ListItemIcon>
            <ContactMailIcon />
          </ListItemIcon>
          <ListItemText primary="imprint" />
        </ListItemButton>
      </MuiLink>

      <MuiLink to="/privacy" component={RouterLink}>
        <ListItemButton>
          <ListItemIcon>
            <WarningAmberIcon />
          </ListItemIcon>
          <ListItemText primary="privacy" />
        </ListItemButton>
      </MuiLink>
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
              onKeyDown={handleSearchKeyPress}
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
            <MuiLink to="/faq" component={RouterLink}>
              <ListItemButton>
                <ListItemIcon>
                  <i className="pi pi-book" style={{ fontSize: "1.2rem" }} />
                </ListItemIcon>
                <ListItemText primary="faq" />
              </ListItemButton>
            </MuiLink>

            <MuiLink to="/imprint" component={RouterLink}>
              <ListItemButton>
                <ListItemIcon>
                  <i className="pi pi-id-card" style={{ fontSize: "1.2rem" }} />
                </ListItemIcon>
                <ListItemText primary="imprint" />
              </ListItemButton>
            </MuiLink>

            <MuiLink to="/privacy" component={RouterLink}>
              <ListItemButton>
                <ListItemIcon>
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: "1.2rem" }} />
                </ListItemIcon>
                <ListItemText primary="privacy" />
              </ListItemButton>
            </MuiLink>
          </Box>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
