import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CampusMap } from "./CampusMap.tsx";
import CampusProvider from "./CampusProvider.tsx";
import { CityMap } from "./CityMap.tsx";
import { HTWK_LIGHT_TEXT, HTWK_YELLOW, HTWKALENDER_GRAY, ROOM } from "./Color.ts";
import "./fonts.css";
import "./index.css";
import { ErrorPage } from "./Subpages/ErrorPage.tsx";
import { FAQ } from "./Subpages/FAQ.tsx";
import { Imprint } from "./Subpages/Imprint.tsx";
import { Privacy } from "./Subpages/Privacy.tsx";

const router = createBrowserRouter([
  { path: "/", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/room/:roomID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/campus/:campusID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/city", element: <CityMap /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/imprint", element: <Imprint /> },
  { path: "/privacy", element: <Privacy /> },
]);

// text should be white
const theme = createTheme({
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CampusProvider>
        <RouterProvider router={router} />
      </CampusProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
