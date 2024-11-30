import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// เสิร์ฟไฟล์จาก public folder
app.use(express.static(path.join(__dirname, "dist"))); // หรือที่เก็บไฟล์ของ Vite

// ส่งกลับ index.html สำหรับเส้นทางที่ไม่ได้ระบุ
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
