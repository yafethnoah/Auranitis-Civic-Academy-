import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load all env variables (including from GitHub Actions)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    /**
     * REQUIRED for GitHub Pages project sites
     * Format:
     * https://<username>.github.io/<repo-name>/
     */
    base: "/Auranitis-Civic-Academy-/",

    plugins: [react()],

    /**
     * Make the Gemini API key available at build time
     * (Vite replaces this statically in the bundle)
     */
    define: {
      "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY || ""
      ),
    },

    /**
     * Optional but recommended for stability
     */
    build: {
      outDir: "dist",
      sourcemap: false,
      emptyOutDir: true,
    },
  };
});
