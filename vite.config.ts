
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",          // needed for DOM APIs
    setupFiles: "./src/setupTests.ts", // load jest-dom matchers
    globals: true,
  },
});
