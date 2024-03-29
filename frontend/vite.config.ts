/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: path.resolve(__dirname, "/setupTests.ts"),
  },
});
