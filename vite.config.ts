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
      "/convert": "http://localhost:3000", // ให้ Proxy ไปยังเซิร์ฟเวอร์ที่ใช้ API
    },
  },
  build: {
    rollupOptions: {
      external: ["sharp", "node:crypto", "node:child_process"],
    },
  },
});
