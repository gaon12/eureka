import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/@ckeditor") ||
            id.includes("node_modules/ckeditor5")
          ) {
            return "ckeditor";
          }

          if (
            id.includes("node_modules/antd") ||
            id.includes("node_modules/@ant-design")
          ) {
            return "antd";
          }

          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react";
          }
        },
      },
    },
  },
});
