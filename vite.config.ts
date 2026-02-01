import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    // GitHub Pages project site base: https://USERNAME.github.io/REPO/
    base: "/Auranitis-Civic-Academy-/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
