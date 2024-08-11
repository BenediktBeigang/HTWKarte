import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./fonts.css";
import "./index.css";
import { CampusMap } from "./Map/CampusMap.tsx";
import RedirectToRoom from "./RedirectToRoom.tsx";
import CampusProvider from "./State/CampusProvider.tsx";
import { ErrorPage } from "./Subpages/ErrorPage.tsx";
import { FAQ } from "./Subpages/FAQ.tsx";
import { Imprint } from "./Subpages/Imprint.tsx";
import { Privacy } from "./Subpages/Privacy.tsx";
import { theme } from "./UI/theme.ts";

const router = createBrowserRouter([
  { path: "/", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/room/:roomID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/:anything", element: <RedirectToRoom /> },
  { path: "/campus/:campusID", element: <CampusMap />, errorElement: <ErrorPage /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/imprint", element: <Imprint /> },
  { path: "/privacy", element: <Privacy /> },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CampusProvider>
          <RouterProvider router={router} />
        </CampusProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
