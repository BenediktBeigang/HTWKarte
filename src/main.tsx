import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CampusMap } from "./CampusMap.tsx";
import CampusProvider from "./CampusProvider.tsx";
import { CityMap } from "./CityMap.tsx";
import { HTWKALENDER_GRAY, ROOM } from "./Color.ts";
import { ErrorPage } from "./ErrorPage.tsx";
import "./fonts.css";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/room/:roomID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/campus/:campusID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/city", element: <CityMap /> },
]);

// text should be white
const theme = createTheme({
  palette: {
    primary: {
      main: HTWKALENDER_GRAY,
    },
    secondary: {
      main: ROOM,
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
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#bec3c6",
          borderRadius: "10px 10px 0 0",
          "& .MuiInputBase-input": {
            color: "black",
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
