import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // กำหนด base path สำหรับการใช้งานในโปรเจกต์
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
    open: true,
    proxy: {
      "/upload-image": "http://localhost:4229", // ตั้งค่าให้การเรียก API ไปที่เซิร์ฟเวอร์
    },
  },
  build: {
    rollupOptions: {
      external: ["sharp", "node:crypto", "node:child_process"],
    },
  },
});
