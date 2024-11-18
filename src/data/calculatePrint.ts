// calculatePrint.ts
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
// import mammoth from "mammoth";
import JSZip from "jszip";
// import { Document, Packer, Paragraph } from "docx";

GlobalWorkerOptions.workerSrc = `/pdf.js/build/pdf.worker.mjs`;

// อ่านไฟล์ DOCX
// async function extractTextFromDocx(docxFile: File): Promise<string> {
//   console.log("เริ่มการดึงข้อความจากไฟล์ DOCX...");
//   const { value } = await mammoth.extractRawText({
//     arrayBuffer: await docxFile.arrayBuffer(),
//   });
//   console.log("ข้อความที่ดึงได้จาก DOCX:", value);
//   return value;
// }

// ดึงข้อมูลภาพจากไฟล์ DOCX
async function extractImagesFromDocx(docxFile: File): Promise<Blob[]> {
  console.log("เริ่มดึงภาพจากไฟล์ DOCX...");
  const images: Blob[] = [];
  const arrayBuffer = await docxFile.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  for (const fileName of Object.keys(zip.files)) {
    if (
      fileName.startsWith("word/media/") &&
      /\.(jpg|jpeg|png|bmp|gif)$/.test(fileName)
    ) {
      const fileData = await zip.files[fileName].async("blob");
      images.push(fileData);
    }
  }

  console.log(`พบภาพจำนวน ${images.length} ใน DOCX`);
  return images;
}

// คำนวณเปอร์เซ็นต์สีใน DOCX
async function calculateDocxColorPercentage(docxFile: File): Promise<number> {
  const images = await extractImagesFromDocx(docxFile);
  console.log("ดึงภาพได้จำนวน:", images.length);

  if (images.length === 0) {
    console.log("ไม่พบภาพในไฟล์ DOCX");
    return 0;
  }

  let totalColorPercentage = 0;

  for (const image of images) {
    totalColorPercentage += await calculateImageColorPercentage(
      new File([image], "image")
    );
  }

  const averageColorPercentage = totalColorPercentage / images.length;
  console.log(`เปอร์เซ็นต์สีเฉลี่ยใน DOCX: ${averageColorPercentage}%`);
  return averageColorPercentage;
}

// ฟังก์ชันตรวจสอบค่าสีขาวและดำ
const isWhiteOrBlack = (r: number, g: number, b: number): boolean => {
  const threshold = 20;
  const isCloseToWhite =
    r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
  const isCloseToBlack = r <= threshold && g <= threshold && b <= threshold;

  return isCloseToWhite || isCloseToBlack;
};

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
      const data = imageData.data;
      let colorCount = 0;

      // คำนวณเปอร์เซ็นต์สี
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        if (!isWhiteOrBlack(r, g, b)) colorCount++;
      }

      const colorPercentage = (colorCount / (image.width * image.height)) * 100;
      resolve(colorPercentage);
    };

    image.onerror = () => {
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

  let totalColorPercentage = 0;
  const totalPages = pdfDocument.numPages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const pageColorPercentage = await calculatePageColorPercentage(
      pdfFile,
      pageNum
    );
    console.log(`เปอร์เซ็นต์สีในหน้า PDF ${pageNum}: ${pageColorPercentage}%`);
    totalColorPercentage += pageColorPercentage;
  }

  const averageColorPercentage = totalColorPercentage / totalPages;
  console.log(`เปอร์เซ็นต์สีเฉลี่ยใน PDF: ${averageColorPercentage}%`);
  return averageColorPercentage;
}

// คำนวณเปอร์เซ็นต์สีตามประเภทไฟล์
export async function calculateFileColorPercentage(
  file: File
): Promise<number> {
  const fileType = file.name.split(".").pop()?.toLowerCase();
  console.log(`ประเภทไฟล์ที่ได้รับ: ${fileType}`);

  if (fileType === "pdf") {
    return calculateColorPercentage(file);
  } else if (fileType === "docx" || fileType === "doc") {
    return calculateDocxColorPercentage(file);
  } else if (fileType === "jpg" || fileType === "png") {
    return calculateImageColorPercentage(file);
  } else {
    console.log("ประเภทไฟล์ไม่รองรับ");
    throw new Error("ประเภทไฟล์ไม่รองรับ");
  }
}

// คำนวณจำนวนหน้าจาก PDF
async function getPageCountFromPDF(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}

// คำนวณจำนวนหน้าจาก DOCX
async function calculatePageCountFromDocx(docxFile: File): Promise<number> {
  const arrayBuffer = await docxFile.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docFile = zip.files["word/document.xml"];

  if (!docFile) {
    throw new Error("ไม่พบเอกสารหลักในไฟล์ DOCX");
  }

  const documentXML = await docFile.async("text");
  const paragraphs = documentXML.match(/<w:p[^>]*>/g)?.length || 0;
  const estimatedCharactersPerPage = 800; // สมมติว่าหน้าหนึ่งมี 800 ตัวอักษร
  const estimatedPages = Math.ceil(
    (paragraphs * 50) / estimatedCharactersPerPage
  );

  return estimatedPages;
}

// ตรวจสอบชนิดไฟล์และเรียกใช้ฟังก์ชันการนับจำนวนหน้า
async function getPageCount(file: File): Promise<number> {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    return await getPageCountFromPDF(file);
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await calculatePageCountFromDocx(file);
  } else {
    throw new Error("ชนิดไฟล์ไม่รองรับสำหรับการดึงจำนวนหน้า");
  }
}

// คำนวณราคาและจำนวนหน้าจากไฟล์
export async function calculatePrice(
  selectTypePrint: string,
  copiesSetPrint: string,
  selectedFile: File | null
): Promise<{ totalPrice: number; pageCount: number }> {
  if (!selectedFile) {
    return { totalPrice: 0, pageCount: 0 };
  }

  let pageCount = 1;
  try {
    pageCount = await getPageCount(selectedFile);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการนับจำนวนหน้า:", error);
    return { totalPrice: 0, pageCount: 0 };
  }

  const copiesCount = parseInt(copiesSetPrint) || 1;
  const totalPageCount = pageCount * copiesCount;
  let totalPrice = 0;

  let colorPercentage = 0;
  if (selectTypePrint === "สี") {
    try {
      colorPercentage = await calculateFileColorPercentage(selectedFile);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการคำนวณเปอร์เซ็นต์สี:", error);
    }
  }

  console.log(`จำนวนหน้าทั้งหมดของเอกสาร: ${totalPageCount}`);
  console.log(`เปอร์เซ็นต์สีในเอกสาร: ${colorPercentage}%`);

  // คำนวณราคา (สมมติว่าใช้ราคาตามเปอร์เซ็นต์สี)
  totalPrice = totalPageCount * colorPercentage * 0.1;

  return { totalPrice, pageCount: totalPageCount };
}
