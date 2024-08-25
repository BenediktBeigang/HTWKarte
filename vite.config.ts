import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const ONE_DAY_IN_SEC = 60 * 60 * 24;
const ONE_WEEK_IN_SEC = ONE_DAY_IN_SEC * 7;

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "Buildings/**",
        "Data/**",
        "Fonts/**",
        "Icons/**",
        "Images/**",
      ],
      manifest: {
        name: "HTWKarte",
        short_name: "htwkarte",
        description: "Interaktive Campus-Karte der HTWK Leipzig",
        theme_color: "#454c7f",
        background_color: "#1b2022",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,woff2,json}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: ONE_WEEK_IN_SEC,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === "https://app.htwk-leipzig.de" &&
              url.pathname.startsWith("/api/telephone"),
            handler: "NetworkFirst",
            options: {
              cacheName: "htwk-api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: ONE_WEEK_IN_SEC,
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === "https://cal.htwk-leipzig.de" &&
              url.pathname.startsWith("/api/schedule") &&
              url.searchParams.has("from") &&
              url.searchParams.has("to") &&
              url.searchParams.get("mapped") === "true" &&
              !url.searchParams.has("room"),
            handler: "NetworkFirst",
            options: {
              cacheName: "htwk-schedule-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: ONE_WEEK_IN_SEC,
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
