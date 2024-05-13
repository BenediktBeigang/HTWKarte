import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CampusMap } from "./CampusMap.tsx";
import CampusProvider from "./CampusProvider.tsx";
import { CityMap } from "./CityMap.tsx";
import { HTWK_GRAY, ROOM } from "./Color.ts";
import { ErrorPage } from "./ErrorPage.tsx";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/room/:roomID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/campus/:campusID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/city", element: <CityMap /> },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: HTWK_GRAY,
    },
    secondary: {
      main: ROOM,
    },
  },
  typography: {
    fontFamily: ["Source Sans 3", "sans-serif"].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Source Sans 3';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Source Sans 3'), local('SourceSans3-Regular'), url(/fonts/SourceSans3.ttf) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
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
