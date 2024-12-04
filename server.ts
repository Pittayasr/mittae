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

// server.ts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ตรวจสอบ path จาก endpoint หรือพารามิเตอร์ที่ส่งมา
    const formType = req.body.formType; // ใช้ formType ใน request body
    let folderPath = "uploads/"; // Default folder

    if (formType === "forms") folderPath = "uploads/forms/";
    else if (formType === "prints") folderPath = "uploads/prints/";
    else if (formType === "deliveries") folderPath = "uploads/deliveries/";

    cb(null, folderPath); // กำหนดโฟลเดอร์ที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    const randomFileName = `${Date.now()}_${Math.floor(
      1000000000 + Math.random() * 9000000000
    )}`;
    const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
    cb(null, `${randomFileName}${ext}`); // ใช้เลขสุ่ม + นามสกุล
  },
});

const ensureDirectoriesExist = () => {
  const directories = ["uploads/forms", "uploads/prints", "uploads/deliveries"];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

ensureDirectoriesExist();

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

    const formType = req.body.formType || "unknown";
    console.log(`Form type: ${formType}`); // ตรวจสอบค่า formType

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${encodeURIComponent(file.filename)}`;
    console.log(
      `File uploaded successfully: ${file.originalname}, accessible at: ${fileUrl}`
    );

    res.status(200).json({
      message: "File uploaded successfully",
      fileName: file.originalname,
      storedFileName: file.filename,
      filePath: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
