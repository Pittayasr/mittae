import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import mammoth from "mammoth";

GlobalWorkerOptions.workerSrc = `/pdf.js/build/pdf.worker.mjs`;

// อ่านไฟล์ DOCX
async function extractTextFromDocx(docxFile: File): Promise<string> {
  console.log("เริ่มการดึงข้อความจากไฟล์ DOCX...");
  const { value } = await mammoth.extractRawText({
    arrayBuffer: await docxFile.arrayBuffer(),
  });
  console.log("ข้อความที่ดึงได้จาก DOCX:", value);
  return value;
}

// ฟังก์ชันตรวจสอบค่าสีขาวและดำ
const isWhiteOrBlack = (r: number, g: number, b: number): boolean => {
  // การคำนวณให้ยืดหยุ่นมากขึ้น เช่น สีที่มีค่าสีใกล้เคียงกับขาวและดำ
  const threshold = 20; // ความต่างที่ยอมรับได้ระหว่างสีขาวและดำ
  const isCloseToWhite =
    r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
  const isCloseToBlack = r <= threshold && g <= threshold && b <= threshold;

  return isCloseToWhite || isCloseToBlack;
};

// คำนวณเปอร์เซ็นต์สีในภาพที่ไม่ใช่ขาวดำ โดยใช้ Canvas
async function calculateImageColorPercentage(imageFile: File): Promise<number> {
  console.log("เริ่มการคำนวณเปอร์เซ็นต์สีในภาพ...");
  const image = new Image();
  const imageUrl = URL.createObjectURL(imageFile);
  image.src = imageUrl;

  return new Promise<number>((resolve, reject) => {
    image.onload = () => {
      console.log("โหลดภาพสำเร็จ");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        let colorCount = 0;

        // คำนวณเปอร์เซ็นต์สีที่ไม่ใช่ขาวดำ
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
          if (!isWhiteOrBlack(r, g, b)) colorCount++;
        }

        const colorPercentage =
          (colorCount / (image.width * image.height)) * 100;
        console.log(`เปอร์เซ็นต์สีในภาพ: ${colorPercentage}%`);
        resolve(colorPercentage);
      } else {
        reject(new Error("ไม่สามารถเข้าถึง context ของ canvas"));
      }
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
    return extractTextFromDocx(file).then((text) => {
      const result = text.length > 0 ? 0 : 0;
      console.log(`ผลลัพธ์จากการดึงข้อความจาก DOCX: ${result}`);
      return result;
    });
  } else if (fileType === "jpg" || fileType === "png") {
    return calculateImageColorPercentage(file);
  } else {
    console.log("ประเภทไฟล์ไม่รองรับ");
    throw new Error("ประเภทไฟล์ไม่รองรับ");
  }
}

// คำนวณราคาตามเปอร์เซ็นต์สี
export async function calculatePrice(
  selectTypePrint: string,
  pagePrint: string,
  copiesSetPrint: string,
  selectedFile: File | null
): Promise<number> {
  if (!selectedFile) {
    console.log("ไม่พบไฟล์ที่เลือก");
    return 0;
  }
  const pageCount = parseInt(pagePrint) || 1;
  const copiesCount = parseInt(copiesSetPrint) || 1;
  const totalPageCount = pageCount * copiesCount;
  let totalPrice = 0;

  console.log(`คำนวณราคาตามประเภทการพิมพ์: ${selectTypePrint}`);
  console.log(`จำนวหน้า: ${pagePrint}`);
  console.log(`จำนวนชุด: ${copiesSetPrint}`);
  console.log(`ชื่อไฟล์: ${selectedFile}`);

  // คำนวณเปอร์เซ็นต์สีก่อน
  let colorPercentage = 0;
  if (selectTypePrint === "สี") {
    try {
      colorPercentage = await calculateFileColorPercentage(selectedFile);
      console.log(`เปอร์เซ็นต์สีในไฟล์: ${colorPercentage}%`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการคำนวณเปอร์เซ็นต์สี:", error);
    }
  }

  // คำนวณราคาตามประเภทการพิมพ์
  if (selectTypePrint === "ขาวดำ") {
    const pricePerPage = totalPageCount <= 4 ? 5 : 1; // 1-4 แผ่น = 5 บาท, 5 แผ่นขึ้นไป = 1 บาท
    totalPrice = pricePerPage * totalPageCount;
  } else if (selectTypePrint === "สี") {
    // ปรับเงื่อนไขการคำนวณราคาให้เหมาะสม
    let pricePerPage = 1; // กำหนดราคาต่ำสุดไว้ก่อน
    if (colorPercentage >= 75) {
      pricePerPage = 20; // สีมากกว่า 75% คิดราคาตามนี้
    } else if (colorPercentage >= 50) {
      pricePerPage = 15; // สี 50% ขึ้นไป
    } else if (colorPercentage >= 25) {
      pricePerPage = 10; // สี 25% ขึ้นไป
    }

    totalPrice = pricePerPage * totalPageCount;
  }

  console.log(`ราคาที่คำนวณได้: ${totalPrice} บาท`);
  return totalPrice;
}
