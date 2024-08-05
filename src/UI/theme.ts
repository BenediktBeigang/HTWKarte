import { createTheme } from "@mui/material";
import { HTWK_LIGHT_TEXT, HTWK_YELLOW, HTWKALENDER_GRAY, ROOM } from "./Color";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: HTWK_LIGHT_TEXT,
    },
    secondary: {
      main: ROOM,
    },
    background: {
      default: HTWKALENDER_GRAY,
    },
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    fontSize: 16,
    subtitle1: {
      fontWeight: 650,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          variant: "contained",
          textTransform: "none",
          "&.Mui-focusVisible": {
            textDecoration: "underline",
            textDecorationColor: "yellow",
            color: HTWK_YELLOW,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            borderRadius: "6px",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          marginRight: "-1.5em",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: HTWK_LIGHT_TEXT,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInput-underline:after": {
            borderBottomColor: HTWK_YELLOW,
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: HTWK_YELLOW,
            },
          },
        },
      },
    },
  },
});
