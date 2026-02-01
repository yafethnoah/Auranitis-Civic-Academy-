import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env vars (including VITE_GEMINI_API_KEY) at build time
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // IMPORTANT for GitHub Pages project site:
    // https://<user>.github.io/<repo>/
    base: "/Auranitis-Civic-Academy-/",

    plugins: [react()],

    // If your code uses process.env.GEMINI_API_KEY (template style),
    // this maps it to the VITE_ var safely at build time.
    define: {
      "process.env.GEMINI_API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY || ""),
      "process.env.API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY || ""),
    },
  };
});
