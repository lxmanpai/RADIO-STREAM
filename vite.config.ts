import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/RADIO-STREAM/", // 🔥 very important for github pages deployment
  plugins: [react()],
});
