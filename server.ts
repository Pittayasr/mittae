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

// ตั้งค่า storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // โฟลเดอร์ที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    const randomFileName = `${Date.now()}_${Math.floor(
      1000000000 + Math.random() * 9000000000
    )}`; // วันที่ปัจจุบัน + เลขสุ่ม 10 หลัก
    const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
    cb(null, `${randomFileName}${ext}`); // ใช้เลขสุ่ม + นามสกุล
  },
});

// ตั้งค่า multer
const upload = multer({ storage });

// ให้บริการไฟล์ที่อัปโหลด
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ลบไฟล์จาก server
app.delete("/delete-file", (req, res) => {
  const { fileName } = req.body; // รับชื่อไฟล์จาก client
  if (!fileName) {
    return res.status(400).json({ error: "No file name provided" });
  }

  const filePath = path.resolve(__dirname, "uploads", fileName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // ลบไฟล์
      console.log(`File deleted: ${fileName}`);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      console.error("File not found:", filePath);
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

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
