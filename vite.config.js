import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { accomodationsApiPlugin } from "./vite-plugin-accomodations-api.js";
import { contentApiPlugin } from "./vite-plugin-content-api.js";

export default defineConfig({
  plugins: [react(), accomodationsApiPlugin(), contentApiPlugin()],
  base: "/",
  server: { port: 5173, host: "127.0.0.1", open: true }
});

