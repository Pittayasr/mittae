// server.ts
import express from "express";
import { exec } from "child_process";
import path from "path";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

  // ใช้ __dirname เพื่อสร้าง output path
  const outputPath = path.join(__dirname, "output.pdf");
  const command = `libreoffice --headless --convert-to pdf "${inputPath}" --outdir "${path.dirname(
    outputPath
  )}"`;
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
    res.download(outputPath, "output.pdf", (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
