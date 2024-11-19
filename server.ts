// server.ts
import express from "express";
import { exec } from "child_process";
import path from "path";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const app = express();
const PORT = 3000; // กำหนดพอร์ตเป็น 3000

// หา __dirname ในโมดูล ESM โดยใช้ import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup CORS middleware
app.use(cors());

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.post("/convert", upload.single("file"), (req, res) => {
  const inputPath = req.file?.path; // Path to uploaded file
  if (!inputPath) {
    return res.status(400).json({ error: "No file provided" });
  }

  const outputDir = path.dirname(inputPath);
  const outputFileName = `${path.basename(
    inputPath,
    path.extname(inputPath)
  )}.pdf`;
  const outputPath = path.join(outputDir, outputFileName);

  const command = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;
  console.log(`Running command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res
        .status(500)
        .json({ error: "Conversion failed", details: error.message });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);

    // ส่งไฟล์ PDF ให้ผู้ใช้
    res.download(outputPath, "converted.pdf", (err) => {
      // ลบไฟล์หลังการดาวน์โหลด
      fs.unlink(inputPath, (unlinkErr) => {
        if (unlinkErr)
          console.error(`Failed to delete input file: ${unlinkErr}`);
      });
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr)
          console.error(`Failed to delete output file: ${unlinkErr}`);
      });

      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
