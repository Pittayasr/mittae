// calculatePrint.ts
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js";

// let cachedPdfFile: File;
let cachedColorPercentage: number;
let cachedFileHash: string;
let cachedPageCount: number;

function getFileHash(file: File): string {
  return `${file.name}_${file.lastModified}`;
}

// ฟังก์ชันตรวจสอบค่าสีขาวและดำ
const isWhiteOrBlack = (r: number, g: number, b: number): boolean => {
  const threshold = 20;
  const isCloseToWhite =
    r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
  const isCloseToBlack = r <= threshold && g <= threshold && b <= threshold;

  return isCloseToWhite || isCloseToBlack;
};

function calculatePixelColors(imageData: ImageData): number {
  const { data } = imageData;
  let colorCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (!isWhiteOrBlack(r, g, b)) {
      colorCount++;
    }
  }

  return colorCount;
}

// คำนวณเปอร์เซ็นต์สีในภาพ
async function calculateImageColorPercentage(imageFile: File): Promise<number> {
  const image = new Image();
  const imageUrl = URL.createObjectURL(imageFile);
  image.src = imageUrl;

  return new Promise<number>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0, image.width, image.height);

      const imageData = context!.getImageData(0, 0, image.width, image.height);
      const colorCount = calculatePixelColors(imageData);

      const colorPercentage = (colorCount / (image.width * image.height)) * 100;
      URL.revokeObjectURL(imageUrl);
      resolve(colorPercentage);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("ไม่สามารถโหลดภาพ"));
    };
  });
}

// ดึงข้อมูลภาพจากหน้า PDF
async function getImageDataFromPDF(
  pdfFile: File,
  pageNum: number
): Promise<ImageData> {
  console.log(`เริ่มดึงข้อมูลภาพจากหน้า PDF ที่ ${pageNum}...`);
  const typedArray = new Uint8Array(await pdfFile.arrayBuffer());
  const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
  const page = await pdfDocument.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.0 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;

  console.log(`ดึงข้อมูลจากหน้า PDF ${pageNum} เสร็จสิ้น`);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

// คำนวณเปอร์เซ็นต์สีในหน้า PDF แต่ละหน้า
async function calculatePageColorPercentage(
  pdfFile: File,
  pageNum: number
): Promise<number> {
  console.log(`เริ่มคำนวณเปอร์เซ็นต์สีในหน้า PDF ${pageNum}...`);
  const imageData = await getImageDataFromPDF(pdfFile, pageNum);
  let coloredPixelCount = 0;
  const totalPixelCount = imageData.data.length / 4;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b] = [
      imageData.data[i],
      imageData.data[i + 1],
      imageData.data[i + 2],
    ];
    if (!isWhiteOrBlack(r, g, b)) coloredPixelCount++;
  }

  const colorPercentage = (coloredPixelCount / totalPixelCount) * 100;
  console.log(`เปอร์เซ็นต์สีในหน้า PDF ${pageNum}: ${colorPercentage}%`);
  return colorPercentage;
}

// คำนวณเปอร์เซ็นต์สีทั้งหมดใน PDF
async function calculateColorPercentage(pdfFile: File): Promise<number> {
  console.log("เริ่มคำนวณเปอร์เซ็นต์สีทั้งหมดใน PDF...");
  const typedArray = new Uint8Array(await pdfFile.arrayBuffer());
  const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;

  const totalPages = pdfDocument.numPages;

  // ใช้ Promise.all เพื่อคำนวณทุกหน้าแบบขนาน
  const pageColorPercentages = await Promise.all(
    Array.from({ length: totalPages }, (_, index) =>
      calculatePageColorPercentage(pdfFile, index + 1)
    )
  );

  const totalColorPercentage = pageColorPercentages.reduce(
    (sum, percentage) => sum + percentage,
    0
  );

  const averageColorPercentage = totalColorPercentage / totalPages;
  console.log(`เปอร์เซ็นต์สีเฉลี่ยใน PDF: ${averageColorPercentage}%`);
  cachedColorPercentage = averageColorPercentage;
  return cachedColorPercentage;
}

// ฟังก์ชันคำนวณเปอร์เซ็นต์สีในไฟล์ที่แปลงแล้ว
export async function calculateFileColorPercentage(
  file: File
): Promise<number> {
  const fileType = file.type.toLowerCase();
  console.log("กำลังคำนวณสีของไฟล์...");
  console.log(`ประเภทไฟล์ที่ได้รับ: ${fileType}`);

  if (fileType === "application/pdf") {
    return calculateColorPercentage(file);
  } else if (fileType === "image/jpeg" || fileType === "image/png") {
    return calculateImageColorPercentage(file); // คำนวณสีโดยตรงสำหรับรูปภาพ
  } else {
    console.log("ประเภทไฟล์ไม่รองรับ");
    throw new Error("ประเภทไฟล์ไม่รองรับ");
  }
}

// ตรวจสอบชนิดไฟล์และเรียกใช้ฟังก์ชันการนับจำนวนหน้า
async function getPageCount(file: File): Promise<number> {
  if (cachedPageCount && cachedFileHash === getFileHash(file)) {
    console.log("ใช้จำนวนหน้าที่ Cache ไว้");
    return cachedPageCount;
  }

  if (file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    cachedPageCount = pdf.numPages;
  } else if (file.type === "image/jpeg" || file.type === "image/png") {
    return 1; // ไฟล์รูปภาพถือว่าเป็น 1 หน้า
  } else {
    throw new Error("ชนิดไฟล์ไม่รองรับสำหรับการดึงจำนวนหน้า");
  }

  cachedFileHash = getFileHash(file);
  return cachedPageCount;
}

// ปรับปรุงฟังก์ชัน calculatePrice
export async function calculatePrice(
  selectTypePrint: string,
  copiesSetPrint: string,
  selectedFile: File
): Promise<{ totalPrice: number; pageCount: number }> {
  // await uploadFileToServer(selectedFile);
  const uploadedFile: File = selectedFile;

  // ดึงจำนวนหน้า
  const pageCount = await getPageCount(uploadedFile);

  // คำนวณเปอร์เซ็นต์สี
  let colorPercentage = 0;
  if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png") {
    colorPercentage = await calculateImageColorPercentage(uploadedFile);
  } else {
    colorPercentage = await calculateFileColorPercentage(uploadedFile);
  }

  const copiesCount = parseInt(copiesSetPrint, 10) || 1;

  // คำนวณราคาทั้งหมด
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

  console.log(`ราคาทั้งหมด: ${totalPrice}`);
  return { totalPrice, pageCount: pageCount * copiesCount };
}
