import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js";

let cachedColorPercentage: number;
let cachedFileHash: string;
let cachedPageCount: number;

function getFileHash(file: File): string {
  return `${file.name}_${file.lastModified}`;
}

// ฟังก์ชันตรวจสอบค่าสีขาวและดำ โดยใช้ค่าความสว่าง
const isWhiteOrBlack = (r: number, g: number, b: number): boolean => {
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness > 240 || brightness < 30; // สีขาวสว่างมาก และสีดำมืดมาก
};

// ดึงข้อมูลภาพจาก PDF และคำนวณสีในหน้า
async function getImageDataFromPDF(
  pdfFile: File,
  pageNum: number,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): Promise<number> {
  const typedArray = new Uint8Array(await pdfFile.arrayBuffer());
  const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
  const page = await pdfDocument.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.0 });

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  let colorPixelCount = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b] = [
      imageData.data[i],
      imageData.data[i + 1],
      imageData.data[i + 2],
    ];
    if (!isWhiteOrBlack(r, g, b)) {
      colorPixelCount++;
    }
  }

  return (colorPixelCount / (canvas.width * canvas.height)) * 100;
}

// คำนวณเปอร์เซ็นต์สีใน PDF
async function calculateColorPercentage(pdfFile: File): Promise<number> {
  console.log("เริ่มคำนวณเปอร์เซ็นต์สีทั้งหมดใน PDF...");
  const fileHash = getFileHash(pdfFile);

  // ใช้ข้อมูล Cache ถ้ามี
  if (cachedFileHash === fileHash) {
    console.log("ใช้เปอร์เซ็นต์สีที่คำนวณไว้แล้วจาก Cache");
    return cachedColorPercentage;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  const typedArray = new Uint8Array(await pdfFile.arrayBuffer());
  const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;

  const totalPages = pdfDocument.numPages;
  let totalColorPercentage = 0;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const colorPercentage = await getImageDataFromPDF(
      pdfFile,
      pageNum,
      canvas,
      context
    );
    totalColorPercentage += colorPercentage;
  }

  cachedFileHash = fileHash;
  cachedColorPercentage = totalColorPercentage / totalPages;

  console.log(`เปอร์เซ็นต์สีเฉลี่ยใน PDF: ${cachedColorPercentage}%`);
  return cachedColorPercentage;
}

// คำนวณเปอร์เซ็นต์สีในรูปภาพ (PNG/JPEG)
async function calculateImageColorPercentage(imageFile: File): Promise<number> {
  const image = new Image();
  const imageUrl = URL.createObjectURL(imageFile);
  image.src = imageUrl;

  return new Promise<number>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0, image.width, image.height);

      const imageData = context!.getImageData(0, 0, image.width, image.height);

      let colorPixelCount = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const [r, g, b] = [
          imageData.data[i],
          imageData.data[i + 1],
          imageData.data[i + 2],
        ];
        if (!isWhiteOrBlack(r, g, b)) {
          colorPixelCount++;
        }
      }

      URL.revokeObjectURL(imageUrl);
      resolve((colorPixelCount / (image.width * image.height)) * 100);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("ไม่สามารถโหลดภาพ"));
    };
  });
}

// ฟังก์ชันหลัก: ตรวจสอบประเภทไฟล์ และคำนวณเปอร์เซ็นต์สี
export async function calculateFileColorPercentage(
  file: File
): Promise<number> {
  const fileType = file.type.toLowerCase();
  console.log("กำลังคำนวณสีของไฟล์...");
  console.log(`ประเภทไฟล์ที่ได้รับ: ${fileType}`);

  if (fileType === "application/pdf") {
    return calculateColorPercentage(file);
  } else if (fileType === "image/jpeg" || fileType === "image/png") {
    return calculateImageColorPercentage(file);
  } else {
    throw new Error("ประเภทไฟล์ไม่รองรับ");
  }
}

// คำนวณราคาจากประเภทการปริ้น และจำนวน
export async function calculatePrice(
  selectTypePrint: string,
  copiesSetPrint: string,
  selectedFile: File
): Promise<{ totalPrice: number; pageCount: number }> {
  const pageCount = await getPageCount(selectedFile);

  const colorPercentage =
    selectedFile.type === "application/pdf"
      ? await calculateColorPercentage(selectedFile)
      : await calculateImageColorPercentage(selectedFile);

  const copiesCount = parseInt(copiesSetPrint, 10) || 1;

  const pricePerPage =
    selectTypePrint === "สี"
      ? colorPercentage >= 75
        ? 20
        : colorPercentage >= 50
        ? 15
        : colorPercentage >= 25
        ? 10
        : 5
      : 1; // ขาวดำ

  const totalPrice = pageCount * pricePerPage * copiesCount;

  return { totalPrice, pageCount };
}

async function getPageCount(file: File): Promise<number> {
  const fileHash = getFileHash(file);
  if (cachedPageCount && cachedFileHash === fileHash) {
    return cachedPageCount;
  }

  if (file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    cachedPageCount = pdf.numPages;
  } else {
    cachedPageCount = 1; // สำหรับไฟล์รูปภาพ
  }

  cachedFileHash = fileHash;
  return cachedPageCount;
}
