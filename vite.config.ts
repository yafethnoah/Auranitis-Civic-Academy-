import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env vars (including VITE_* if present)
  loadEnv(mode, process.cwd(), "");

  return {
    // IMPORTANT for GitHub Pages project sites:
    // https://USERNAME.github.io/REPO/
    base: "/Auranitis-Civic-Academy-/",

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
