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
  Toolbar
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { HTWKALENDER_GRAY } from "./Color";
import htwkLogo from "/Assets/htwkLogo.svg";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: HTWKALENDER_GRAY + "ee" }}>
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
        <Box display="flex" justifyContent="center"  flexWrap="wrap">
          <Box m={1}>
            <TextField label="Raum suchen..." variant="outlined" sx={{ minWidth: "5em" }} />
          </Box>
        </Box>
        <Drawer variant="temporary" anchor="top" open={mobileOpen} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
        <Hidden smDown>
          <Box display="flex" ml="auto" sx={{ height: "100%" }}>
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
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
