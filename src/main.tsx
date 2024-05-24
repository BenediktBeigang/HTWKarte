import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CampusMap } from "./CampusMap.tsx";
import CampusProvider from "./CampusProvider.tsx";
import { CityMap } from "./CityMap.tsx";
import { HTWK_LIGHT_TEXT, HTWK_YELLOW, HTWKALENDER_GRAY, ROOM } from "./Color.ts";
import { ErrorPage } from "./ErrorPage.tsx";
import { FAQ } from "./faq.tsx";
import "./fonts.css";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/room/:roomID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/campus/:campusID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/city", element: <CityMap /> },
  { path: "/faq", element: <FAQ /> },
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
            // color: "inherit", // behält die ursprüngliche Textfarbe bei
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
