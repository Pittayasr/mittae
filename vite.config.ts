import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ใช้เส้นทางหลัก หาก deploy ใน sub-path ต้องปรับเปลี่ยน
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
    open: true, // เปิดเบราว์เซอร์อัตโนมัติเมื่อเริ่มต้นเซิร์ฟเวอร์
    // proxy: {
    //   "/convert": {
    //     target: "http://localhost:3000", // เปลี่ยนเป็นโดเมนของ Backend
    //     changeOrigin: true, // เปลี่ยน origin เพื่อให้ตรงกับ backend
    //     secure: true, // ใช้ HTTPS
    //     rewrite: (path) => path.replace(/^\/convert/, ""), // ลบ "/convert" ออกจาก path หากจำเป็น
    //   },
    // },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // แยก dependencies ขนาดใหญ่
        },
      },
      external: ["sharp", "node:crypto", "node:child_process"], // ตั้งค่า external module ที่ไม่ต้องบันเดิล
    },
  },
});
