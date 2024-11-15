import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-mime-types",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith(".mjs")) {
            res.setHeader("Content-Type", "application/javascript");
          }
          next();
        });
      },
    },
  ],
  server: {
    proxy: {
      "/upload-image": "http://localhost:3001", // ตั้งค่าให้การเรียก API ไปที่เซิร์ฟเวอร์
    },
  },
  build: {
    rollupOptions: {
      external: ['sharp', 'node:crypto', 'node:child_process'],
    },
  },
});
