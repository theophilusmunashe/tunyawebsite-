import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { accomodationsApiPlugin } from "./vite-plugin-accomodations-api.js";
import { bookRequestApiPlugin } from "./vite-plugin-book-request.js";
import { contentApiPlugin } from "./vite-plugin-content-api.js";
import { workspaceApiPlugin } from "./vite-plugin-workspace-api.js";

export default defineConfig({
  plugins: [react(), accomodationsApiPlugin(), bookRequestApiPlugin(), contentApiPlugin(), workspaceApiPlugin()],
  base: "/",
  server: { port: 5173, host: "127.0.0.1", open: true }
});

