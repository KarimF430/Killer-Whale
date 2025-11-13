import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Production-safe config - only load Replit plugins in development
const getPlugins = async () => {
  const plugins = [react()];
  
  // Only load Replit plugins in development and when REPL_ID exists
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
    try {
      const { default: runtimeErrorOverlay } = await import("@replit/vite-plugin-runtime-error-modal");
      plugins.push(runtimeErrorOverlay());
      
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer.cartographer());
      
      const devBanner = await import("@replit/vite-plugin-dev-banner");
      plugins.push(devBanner.devBanner());
    } catch (error) {
      console.warn("Replit plugins not available, skipping...");
    }
  }
  
  return plugins;
};

export default defineConfig(async () => ({
  plugins: await getPlugins(),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
