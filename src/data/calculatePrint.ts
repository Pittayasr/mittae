import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

// ตั้งค่า workerSrc ให้ตรงกับตำแหน่งที่แท้จริงของไฟล์ pdf.worker.mjs
GlobalWorkerOptions.workerSrc = `/pdf.js/build/pdf.worker.mjs`;

// ฟังก์ชันคำนวณเปอร์เซ็นต์สีทั้งหมดในเอกสาร PDF
export const calculateColorPercentage = async (pdfFile: File) => {
  if (!pdfFile) {
    alert("กรุณาเลือกไฟล์ PDF");
    return 0;
  }

  const fileReader = new FileReader();
  return new Promise<number>((resolve, reject) => {
    fileReader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;

        let totalColorPercentage = 0;
        const totalPages = pdfDocument.numPages;
        console.log("Total Pages:", totalPages); // ตรวจสอบจำนวนหน้าทั้งหมด

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const pageColorPercentage = await calculatePageColorPercentage(
            pdfFile,
            pageNum
          );
          totalColorPercentage += pageColorPercentage;
        }

        const averageColorPercentage = totalColorPercentage / totalPages;
        console.log("Average Color Percentage:", averageColorPercentage); // ตรวจสอบเปอร์เซ็นต์สีเฉลี่ย
        resolve(averageColorPercentage);
      } catch (error) {
        console.error("Error in calculateColorPercentage:", error);
        reject("ไม่สามารถคำนวณสีจากไฟล์ PDF ได้");
      }
    };

    fileReader.readAsArrayBuffer(pdfFile);
  });
};

// ฟังก์ชันคำนวณเปอร์เซ็นต์สีของหน้า PDF
export const calculatePageColorPercentage = async (
  pdfFile: File,
  pageNum: number
): Promise<number> => {
  try {
    const imageData = await getImageDataFromPDF(pdfFile, pageNum);
    const textColorPercentage = await calculateTextColorPercentage(
      pdfFile,
      pageNum
    );
    const imageColorPercentage = calculateImageColorPercentage(imageData);

    // แทนที่จะคำนวณค่าเฉลี่ย การใช้ค่า imageColorPercentage ถ้ามีค่ามากกว่า 90%
    let totalPercentage = imageColorPercentage;
    if (imageColorPercentage < 90) {
      totalPercentage = (textColorPercentage + imageColorPercentage) / 2;
    }

    console.log(
      `Page ${pageNum} - Text Color Percentage:`,
      textColorPercentage
    );
    console.log(
      `Page ${pageNum} - Image Color Percentage:`,
      imageColorPercentage
    );
    console.log(`Page ${pageNum} - Total Color Percentage:`, totalPercentage);

    return totalPercentage;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการคำนวณ:", error);
    return 0;
  }
};

// Interface สำหรับ TextItem
interface TextItem {
  styles: {
    color?: string;
  };
}

// ฟังก์ชันคำนวณเปอร์เซ็นต์สีจากข้อความใน PDF
export const calculateTextColorPercentage = async (
  pdfFile: File,
  pageNum: number
): Promise<number> => {
  const fileReader = new FileReader();
  return new Promise<number>((resolve, reject) => {
    fileReader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
        const page = await pdfDocument.getPage(pageNum);

        const textContent = await page.getTextContent();
        const totalText = textContent.items.length;
        let coloredTextCount = 0;

        for (const item of textContent.items) {
          if ("styles" in item && (item as TextItem).styles?.color) {
            const color = (item as TextItem).styles.color;
            if (color && !isWhiteOrBlack(color)) {
              coloredTextCount++;
            }
          }
        }

        const textColorPercentage = (coloredTextCount / totalText) * 100;
        console.log(
          `Page ${pageNum} - Text Color Percentage:`,
          textColorPercentage
        ); // ตรวจสอบเปอร์เซ็นต์สีจากข้อความ
        resolve(textColorPercentage);
      } catch (error) {
        console.error("Error in calculateTextColorPercentage:", error);
        reject("เกิดข้อผิดพลาดในการคำนวณ");
      }
    };
    fileReader.readAsArrayBuffer(pdfFile);
  });
};

// ฟังก์ชันตรวจสอบค่าสีขาวและดำ
const isWhiteOrBlack = (color: string): boolean => {
  return (
    color === "rgb(255, 255, 255)" ||
    color === "rgb(0, 0, 0)" ||
    color === "#000000" ||
    color === "#ffffff"
  );
};

// ฟังก์ชันคำนวณเปอร์เซ็นต์ของสีที่ไม่ใช่สีขาวและดำในภาพ
export const calculateImageColorPercentage = (imageData: ImageData): number => {
  let coloredPixelCount = 0;
  let totalPixelCount = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    if (!isWhiteOrBlack(`rgb(${r}, ${g}, ${b})`)) {
      coloredPixelCount++;
    }

    totalPixelCount++;
  }

  return (coloredPixelCount / totalPixelCount) * 100;
};

// ฟังก์ชันดึงข้อมูลภาพจากหน้า PDF
const getImageDataFromPDF = async (pdfFile: File, pageNum: number) => {
  const typedArray = new Uint8Array(await pdfFile.arrayBuffer());
  const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
  const page = await pdfDocument.getPage(pageNum);

  const viewport = page.getViewport({ scale: 1.0 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({ canvasContext: context, viewport }).promise;
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

// ฟังก์ชันตรวจสอบว่าเอกสารทั้งหมดมีแต่สีขาวและดำหรือไม่
const isAllPagesBlackAndWhite = async (pdfFile: File): Promise<boolean> => {
  const typedArray = new Uint8Array(await pdfFile.arrayBuffer());
  const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
  const totalPages = pdfDocument.numPages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const imageData = await getImageDataFromPDF(pdfFile, pageNum);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      if (!isWhiteOrBlack(`rgb(${r}, ${g}, ${b})`)) {
        // ถ้าพบว่ามีสีอื่นที่ไม่ใช่ขาวดำ ให้คืนค่า false
        return false;
      }
    }
  }

  // ถ้าไม่พบสีอื่นเลย คืนค่า true
  return true;
};

// ฟังก์ชันคำนวณราคาตามเปอร์เซ็นต์สีและการตรวจสอบขาวดำทั้งหมด
export const calculatePrice = async (
  selectedFile: File | null,
  pagePrint: string,
  copiesSetPrint: string
) => {
  if (!selectedFile) return 0;

  const pageCount =
    isNaN(Number(pagePrint)) || Number(pagePrint) <= 0
      ? 1
      : parseInt(pagePrint, 10);
  const copiesCount =
    isNaN(Number(copiesSetPrint)) || Number(copiesSetPrint) <= 0
      ? 1
      : parseInt(copiesSetPrint, 10);

  if (pageCount <= 0 || copiesCount <= 0) {
    return 0;
  }

  const totalPageCount = pageCount * copiesCount;

  let totalPrice = 0;

  const isBlackAndWhiteOnly = await isAllPagesBlackAndWhite(selectedFile);

  if (isBlackAndWhiteOnly) {
    const pricePerPage = totalPageCount <= 4 ? 5 : 1;
    totalPrice = pricePerPage * totalPageCount;
  } else {
    const colorPercentage = await calculateColorPercentage(selectedFile);
    console.log("Color Percentage:", colorPercentage);

    let pricePerPage = 0;
    if (colorPercentage >= 100) {
      pricePerPage = 20;
    } else if (colorPercentage >= 75) {
      pricePerPage = 15;
    } else if (colorPercentage >= 50) {
      pricePerPage = 10;
    } else if (colorPercentage >= 25) {
      pricePerPage = 5;
    } else {
      pricePerPage = 1;
    }

    totalPrice = pricePerPage * totalPageCount;
  }

  return totalPrice;
};
