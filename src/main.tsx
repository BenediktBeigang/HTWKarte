import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CampusMap } from "./CampusMap.tsx";
import CampusProvider from "./CampusProvider.tsx";
import { CityMap } from "./CityMap.tsx";
import "./fonts.css";
import "./index.css";
import RedirectToRoom from "./RedirectToRoom.tsx";
import { ErrorPage } from "./Subpages/ErrorPage.tsx";
import { FAQ } from "./Subpages/FAQ.tsx";
import { Imprint } from "./Subpages/Imprint.tsx";
import { Privacy } from "./Subpages/Privacy.tsx";
import { theme } from "./theme.ts";

const router = createBrowserRouter([
  { path: "/", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/room/:roomID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/:anything", element: <RedirectToRoom /> },
  { path: "/campus/:campusID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/city", element: <CityMap /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/imprint", element: <Imprint /> },
  { path: "/privacy", element: <Privacy /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CampusProvider>
        <RouterProvider router={router} />
      </CampusProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
