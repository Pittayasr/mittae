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
    let folderPath = "";

    if (file.fieldname === "registrationBookFile") {
      folderPath = "uploads/forms/registrationBook/";
    } else if (file.fieldname === "licenseFile") {
      folderPath = "uploads/forms/licensePlate/";
    } else if (
      file.fieldname == "printFile" &&
      file.mimetype === "application/pdf"
    ) {
      folderPath = "uploads/prints/pdf/";
    } else if (
      file.fieldname == "printFile" &&
      ["image/jpeg", "image/png"].includes(file.mimetype)
    ) {
      folderPath = "uploads/prints/photo/";
    }

    // ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created directory: ${folderPath}`);
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const randomFileName = `${Date.now()}_${Math.floor(
      1000000000 + Math.random() * 9000000000
    )}`;
    const ext = path.extname(file.originalname);
    cb(null, `${randomFileName}${ext}`);
  },
});

// ตั้งค่า multer
const upload = multer({ storage });

const ensureDirectoriesExist = () => {
  const directories = [
    "uploads/forms",
    "uploads/forms/registrationBook",
    "uploads/forms/licensePlate",
    "uploads/prints/pdf",
    "uploads/prints/photo",
    "uploads/deliveries",
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

ensureDirectoriesExist();

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
app.post(
  "/upload",
  upload.fields([{ name: "printFile", maxCount: 1 }]),
  (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const printFile = files["printFile"]?.[0];

      if (!printFile) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = `${req.protocol}://${req.get("host")}/uploads/${
        printFile.mimetype === "application/pdf" ? "prints/pdf" : "prints/photo"
      }/${printFile.filename}`;

      console.log(
        `File uploaded successfully: ${printFile.originalname}, accessible at: ${filePath}`
      );

      res.status(200).json({
        printFile: {
          filePath: filePath,
          storedFileName: printFile.filename,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// เพิ่ม endpoint สำหรับการอัปโหลดหลายไฟล์
app.post(
  "/upload-multiple",
  upload.fields([
    { name: "registrationBookFile", maxCount: 1 },
    { name: "licenseFile", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const registrationBookFile = files["registrationBookFile"]?.[0];
      const licenseFile = files["licenseFile"]?.[0];

      if (!registrationBookFile || !licenseFile) {
        return res.status(400).json({ error: "Required files not uploaded" });
      }

      const registrationBookFilePath = `${req.protocol}://${req.get(
        "host"
      )}/uploads/forms/registrationBook/${registrationBookFile.filename}`;
      const licenseFilePath = `${req.protocol}://${req.get(
        "host"
      )}/uploads/forms/licensePlate/${licenseFile.filename}`;

      console.log(
        `File uploaded successfully: ${registrationBookFile.originalname}, accessible at: ${registrationBookFilePath}`,
        `File uploaded successfully: ${licenseFile.originalname}, accessible at: ${licenseFilePath}`
      );

      res.status(200).json({
        registrationBookFile: {
          filePath: registrationBookFilePath,
          storedFileName: registrationBookFile.filename,
        },
        licenseFile: {
          filePath: licenseFilePath,
          storedFileName: licenseFile.filename,
        },
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
