import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Loads .env, .env.production, etc. into process.env (build-time)
  // NOTE: Only variables prefixed with VITE_ are exposed to client via import.meta.env
  loadEnv(mode, process.cwd(), "");

  return {
    // GitHub Pages project site (repo name must match exactly)
    base: "/Auranitis-Civic-Academy-/",

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    // Optional: avoids some GH Pages caching weirdness while you’re iterating
    build: {
      sourcemap: false,
    },
  };
});
