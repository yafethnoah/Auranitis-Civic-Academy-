import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  // Load env vars from .env files + process env
  const env = loadEnv(mode, process.cwd(), "");

  // Prefer VITE_GEMINI_API_KEY (client-safe Vite convention)
  const geminiKey =
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    "";

  return {
    // GitHub Pages project site: https://USERNAME.github.io/REPO_NAME/
    base: "/Auranitis-Civic-Academy-/",

    plugins: [react()],

    // If any code still references process.env.* in the browser,
    // this maps it at build time (Vite "define" static replacement).
    define: {
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(geminiKey),
      "process.env.GEMINI_API_KEY": JSON.stringify(geminiKey),
    },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./", import.meta.url)),
      },
    },
  };
});
