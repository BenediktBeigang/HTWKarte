import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  keyframes,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "primeicons/primeicons.css";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCampusState } from "../State/campus-context";
import { ContactInJson } from "../State/RoomMapping";
import { HTWKALENDER_GRAY } from "./Color";
import htwkKarte from "/favicon.ico";
import lncLogo from "/Icons/lnc.svg";

const correctRoomSearchTerm = (searchedRoomID: string) => {
  const match = searchedRoomID.match(/^([^0-9]*)([0-9].*)$/);
  if (!match) return searchedRoomID.replace(/\s/g, "").toUpperCase();

  const partBeforeNumber = match[1].toUpperCase();
  const partAfterNumber = match[2];
  const roomID = partBeforeNumber + partAfterNumber;
  const roomIDWithoutSpaces = roomID.replace(/\s/g, "");
  return roomIDWithoutSpaces;
};

const backgroundColorTransition = keyframes`
  from {
    background-color: inherit;
  }
  to {
    background-color: #454c7f;
  }
`;

const HeaderButton = (subPage: string, iconName: string, selected: boolean) => {
  return (
    <MuiLink to={`/${subPage}`} component={RouterLink}>
      <ListItemButton
        sx={{
          backgroundColor: selected ? "#454c7f" : "inherit",
          borderRadius: "5px",
          animation: selected ? `${backgroundColorTransition} 1s ease` : "none",
          "&:hover": { backgroundColor: selected ? "#454c7f" : "" },
        }}
      >
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
  const [searchResults, setSearchResults] = useState<ContactInJson[]>([]);
  const [state, dispatch] = useCampusState();
  const stateRef = useRef({ state, dispatch });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentSubPage = window.location.pathname.split("/")[1];
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchResultButtonPress = (roomID: string) => {
    setSearchValue(roomID);
    if (window.location.pathname === `/room/${roomID}`) window.location.reload();
    else navigate(`/room/${roomID}`);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const correctedRoomID: string = correctRoomSearchTerm(searchValue);
    setSearchValue(correctedRoomID);
    if (window.location.pathname === `/room/${correctedRoomID}`) window.location.reload();
    else navigate(`/room/${correctedRoomID}`);
    if (inputRef.current) inputRef.current.blur();
  };

  useEffect(() => {
    stateRef.current = { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    if (!searchValue || !state.contactInfo) {
      setSearchResults([]);
      return;
    }

    const searchParts = searchValue.split(" ");
    let results = state.contactInfo;

    searchParts.forEach((part) => {
      results = results.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(part.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(part.toLowerCase()),
      );
    });

    setSearchResults(results);
  }, [searchValue, state.contactInfo]);

  const drawer = (
    <Box sx={{ margin: "0.5em" }}>
      <Typography sx={{ marginX: "0.5em", fontSize: "2em" }}>HTWKarte</Typography>
      <Divider />
      {HeaderButton("faq", "pi pi-book", currentSubPage === "faq")}
      {HeaderButton("imprint", "pi pi-id-card", currentSubPage === "imprint")}
      {HeaderButton("privacy", "pi pi-exclamation-triangle", currentSubPage === "privacy")}
    </Box>
  );

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: HTWKALENDER_GRAY + "00" }}>
      <Toolbar>
        <Box display="flex">
          <Box m={1}>
            <MuiLink to="/" component={RouterLink}>
              <IconButton edge="start" color="inherit" aria-label="logo">
                {state.lncMode ? (
                  <img src={lncLogo} alt="LNC-Logo" style={{ height: "2em" }} />
                ) : (
                  <img src={htwkKarte} alt="HTWK-Logo" style={{ height: "2em" }} />
                )}
              </IconButton>
            </MuiLink>
          </Box>
        </Box>
        {isLargeScreen && <Typography sx={{ fontSize: "2em", mr: "0.5em" }}>HTWKarte</Typography>}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
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
            {searchResults.length > 0 && (
              <List
                sx={{
                  position: "absolute",
                  top: "100%",
                  backgroundColor: HTWKALENDER_GRAY + "aa",
                  borderRadius: "5px",
                }}
              >
                {searchResults.map((result) => (
                  <ListItem
                    key={`${result.firstName}-${result.lastName}-${result.roomID}`}
                    sx={{ pb: 0, pt: 0 }}
                  >
                    <Button
                      onClick={() => handleSearchResultButtonPress(result.roomID)}
                      sx={{ padding: "auto" }}
                    >
                      {result.firstName} {result.lastName} - {result.roomID}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
        {/* <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          sx={{
            padding: "0.5em",
            borderRadius: "10px",
            backgroundColor: state.devMode ? "#00ff00cc" : "#ff0000cc",
          }}
          onClick={() => dispatch({ type: "TOGGLE_DEV_MODE" })}
        >
          <Tooltip title="Die Seite befindet sich noch in der Entwicklung. Sind Features fehlerhaft melde dies bitte.">
            <Typography>Beta Version</Typography>
          </Tooltip>
        </Box> */}
        <Drawer variant="temporary" anchor="top" open={mobileOpen} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
        {isLargeScreen && (
          <Box display="flex" ml="auto" sx={{ height: "100%" }}>
            {HeaderButton("faq", "pi pi-book", currentSubPage === "faq")}
            {HeaderButton("imprint", "pi pi-id-card", currentSubPage === "imprint")}
            {HeaderButton("privacy", "pi pi-exclamation-triangle", currentSubPage === "privacy")}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
