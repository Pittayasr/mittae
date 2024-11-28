import express from "express";
import path from "path";
import multer from "multer";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;

// Setup CORS
app.use(
  cors({
    origin: ["http://localhost:5173"], // URL ของ frontend
    methods: ["POST"],
  })
);

app.use(express.json());

// Setup multer
const upload = multer({
  dest: "uploads/", // เก็บไฟล์ในโฟลเดอร์ uploads
});

// ฟังก์ชันตรวจสอบค่าสีขาวและดำ
const isWhiteOrBlack = (r: number, g: number, b: number): boolean => {
  const threshold = 20;
  return (
    (r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold) ||
    (r <= threshold && g <= threshold && b <= threshold)
  );
};

// ฟังก์ชันคำนวณเปอร์เซ็นต์สีในไฟล์ภาพ
function calculateImageColorPercentage(filePath: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const { createCanvas, loadImage } = require("canvas");
    loadImage(filePath)
      .then((image: any) => {
        const canvas = createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;

        let colorCount = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
          if (!isWhiteOrBlack(r, g, b)) colorCount++;
        }

        const totalPixels = image.width * image.height;
        resolve((colorCount / totalPixels) * 100);
      })
      .catch((err: Error) => reject(err));
  });
}

// Endpoint สำหรับอัปโหลดและคำนวณเปอร์เซ็นต์สี
app.post("/analyze", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path;
  const fileType = req.file?.mimetype;

  if (!filePath || !fileType) {
    return res.status(400).json({ error: "No file provided or invalid type" });
  }

  try {
    let pageCount = 1; // ตั้งค่าเริ่มต้นเป็น 1 หน้า
    let colorPercentage = 0;

    // คำนวณสำหรับไฟล์ภาพ
    if (fileType === "image/jpeg" || fileType === "image/png") {
      colorPercentage = await calculateImageColorPercentage(filePath);
    } else {
      return res
        .status(400)
        .json({ error: "Unsupported file type. Only images are allowed." });
    }

    res.json({
      pageCount,
      colorPercentage,
      filePath, // ส่งคืน path ไฟล์ที่เก็บไว้ใน server
    });
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: "Failed to analyze file", details: err });
  }
});

// Endpoint สำหรับดาวน์โหลดไฟล์
app.post("/analyze", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    let pageCount = 1;
    let colorPercentage = 0;

    if (file.mimetype === "application/pdf") {
      // นับจำนวนหน้าและคำนวณสีใน PDF
      pageCount = await countPdfPages(file.path);
      colorPercentage = await calculatePdfColorPercentage(file.path);
    } else if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      // ไฟล์ภาพถือว่าเป็น 1 หน้า
      pageCount = 1;
      colorPercentage = await calculateImageColorPercentage(file.path);
    } else {
      throw new Error("Unsupported file type");
    }

    res.json({ pageCount, colorPercentage });
  } catch (error) {
    console.error("Error analyzing file:", error);
    res.status(500).json({ error: "Failed to analyze file" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
