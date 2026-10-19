import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Keep Vite config minimal for fast local development.
export default defineConfig({
  // React plugin enables JSX transform and fast refresh.
  plugins: [react()],
});
