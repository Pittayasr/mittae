// server.ts
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// เปิดใช้งาน CORS
app.use(cors());
app.use(express.json());

// กำหนดตำแหน่งเก็บไฟล์ที่อัปโหลด และกำหนดชื่อไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // กำหนดโฟลเดอร์เก็บไฟล์
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // เอานามสกุลไฟล์เดิม
    const baseName = path.basename(file.originalname, ext); // เอาชื่อไฟล์โดยไม่มีนามสกุล
    const safeBaseName = Buffer.from(baseName, "utf-8").toString("utf-8"); // จัดการชื่อภาษาไทย
    cb(null, `${safeBaseName}${ext}`); // ใช้ชื่อไฟล์เดิมพร้อมนามสกุล
  },
});

// ตั้งค่า multer ใช้ storage ที่กำหนด
const upload = multer({ storage });

// ลบไฟล์จาก server
app.delete("/delete-file", (req, res) => {
  const { fileName } = req.body; // รับชื่อไฟล์จาก client
  const filePath = path.resolve(__dirname, "uploads", fileName); // หา path ของไฟล์

  try {
    fs.unlinkSync(filePath); // ลบไฟล์
    console.log(`File deleted: ${fileName}`);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// ให้บริการไฟล์ที่อัปโหลด
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint สำหรับอัปโหลดไฟล์
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${encodeURIComponent(file.filename)}`;
    console.log(
      `File uploaded successfully: ${file.originalname}, accessible at: ${fileUrl}`
    );

    res.status(200).json({
      message: "File uploaded successfully",
      fileName: file.originalname, // ชื่อไฟล์ต้นฉบับ
      storedFileName: file.filename, // ชื่อไฟล์ที่เก็บในระบบ
      filePath: fileUrl, // URL สำหรับไฟล์
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
