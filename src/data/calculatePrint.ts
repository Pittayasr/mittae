// calculatePrint.ts
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `/pdf.js/build/pdf.worker.mjs`;

// ฟังก์ชันแปลงไฟล์ Word เป็น PDF
async function convertDocToPDF(inputFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", inputFile);

  const response = await fetch("http://localhost:3000/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to convert file");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  return url; // ส่งคืน URL สำหรับดาวน์โหลดไฟล์ PDF
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

// ฟังก์ชันคำนวณเปอร์เซ็นต์สีในไฟล์ที่แปลงแล้ว
export async function calculateFileColorPercentage(
  file: File
): Promise<number> {
  const fileType = file.type.toLowerCase(); 
  console.log(`ประเภทไฟล์ที่ได้รับ: ${fileType}`);

  if (fileType === "application/pdf") {
    return calculateColorPercentage(file);
  } else if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const pdfUrl = await convertDocToPDF(file);
    console.log("File converted to PDF successfully. Download URL:", pdfUrl);
    alert(
      "ไฟล์ได้แปลงเป็น PDF แล้ว คุณสามารถดาวน์โหลดไฟล์ PDF ที่นี่: " + pdfUrl
    );

    // แปลงจาก Blob เป็น File
    const pdfBlob = await fetch(pdfUrl).then((res) => res.blob());
    const pdfFile = new File([pdfBlob], "converted.pdf", {
      type: pdfBlob.type,
    });

    return calculateColorPercentage(pdfFile); // เรียกฟังก์ชันนี้เพื่อคำนวณสีในไฟล์ PDF ที่แปลง
  } else if (fileType === "image/jpeg" || fileType === "image/png") {
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

// ตรวจสอบชนิดไฟล์และเรียกใช้ฟังก์ชันการนับจำนวนหน้า
async function getPageCount(file: File): Promise<number> {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    return await getPageCountFromPDF(file);
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const pdfUrl = await convertDocToPDF(file); // แปลง DOCX เป็น PDF
    console.log("แปลงไฟล์สำเร็จ, ดาวน์โหลด URL:", pdfUrl);

    const pdfBlob = await fetch(pdfUrl).then((res) => res.blob());
    const pdfFile = new File([pdfBlob], "converted.pdf", {
      type: "application/pdf",
    });

    console.log("เริ่มคำนวณเปอร์เซ็นต์สีใน PDF...");
    return getPageCountFromPDF(pdfFile);
  } else if (fileType === "image/jpeg" || fileType === "image/png") {
    return 1;
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
  if (!selectedFile) throw new Error("ไม่พบไฟล์");

  // ดึงจำนวนหน้า
  const pageCount = await getPageCount(selectedFile);
  const copiesCount = parseInt(copiesSetPrint) || 1;
  const totalPageCount = pageCount * copiesCount;

  // คำนวณเปอร์เซ็นต์สี
  const colorPercentage = await calculateFileColorPercentage(selectedFile);

  // คำนวณราคา
  let totalPrice = 0;
  if (selectTypePrint === "สี") {
    const pricePerPage =
      colorPercentage >= 75
        ? 20
        : colorPercentage >= 50
        ? 15
        : colorPercentage >= 25
        ? 10
        : 5;
    totalPrice = totalPageCount * pricePerPage;
  } else {
    totalPrice = totalPageCount <= 4 ? 5 * totalPageCount : totalPageCount; // ขาวดำ
  }

  console.log(`จำนวนหน้าทั้งหมด: ${totalPageCount}`);
  console.log(`ราคาทั้งหมด: ${totalPrice}`);
  return { totalPrice, pageCount: totalPageCount };
}
