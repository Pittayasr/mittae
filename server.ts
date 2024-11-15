import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";

const app = express();
const port = 3001;

// ตั้งค่าการอัพโหลดไฟล์
const upload = multer();

// ฟังก์ชันคำนวณเปอร์เซ็นต์ของสี
const calculateImageColorPercentage = async (
  imageBuffer: Buffer
): Promise<number> => {
  const image = sharp(imageBuffer);
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });
  let colorCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (!isWhiteOrBlack(r, g, b)) colorCount++;
  }

  return (colorCount / (info.width * info.height)) * 100;
};

// ฟังก์ชันเช็คสีขาวและดำ
const isWhiteOrBlack = (r: number, g: number, b: number): boolean => {
  return r === g && g === b && (r === 0 || r === 255);
};

// API สำหรับรับไฟล์ภาพและคำนวณเปอร์เซ็นต์ของสี
app.post(
  "/upload-image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      // ตรวจสอบว่า `req.file` มีข้อมูลหรือไม่
      const imageBuffer = req.file?.buffer;
      if (imageBuffer) {
        const colorPercentage = await calculateImageColorPercentage(
          imageBuffer
        );
        res.json({ colorPercentage });
      } else {
        res.status(400).json({ error: "No image file uploaded" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error processing image" });
    }
  }
);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
