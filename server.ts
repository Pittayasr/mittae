// server.ts
import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import axios from "axios";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(process.env.VITE_API_BASE_URL);

const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = process.env.UPLOADS_DIRECTORY || "uploads";

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.VITE_LINE_CHANNEL_ACCESS_TOKEN;
const X_IBM_Client_Id = process.env.VITE_X_IBM_CLIENT_ID;

app.options("*", cors()); // Allow preflight requests

// เปิดใช้งาน CORS
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin); // Debug origin
      callback(null, true); // อนุญาตทุก origin
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/update-holidays", async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const response = await axios.get(
      `https://apigw1.bot.or.th/bot/public/financial-institutions-holidays/?year=${year}`,
      {
        headers: {
          "X-IBM-Client-Id": X_IBM_Client_Id,
          Accept: "application/json",
        },
      }
    );

    const holidays = response.data;
    const filePath = path.join(__dirname, "public/data", "holidays.json");

    fs.writeFileSync(filePath, JSON.stringify(holidays, null, 2));
    console.log(`Holidays data saved to ${filePath}`);

    res.status(200).send("Holidays updated and saved successfully.");
  } catch (error) {
    console.error("Error updating holidays:", error);
    res.status(500).send("Error updating holidays.");
  }
});

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath = path.join(UPLOADS_DIR, "forms");

    //form
    if (file.fieldname === "registrationBookFile") {
      folderPath = path.join(UPLOADS_DIR, "forms", "registrationBook");
    } else if (file.fieldname === "licensePlateFile") {
      folderPath = path.join(UPLOADS_DIR, "forms", "licensePlate");
    } else if (file.fieldname === "formSlipQRcode") {
      folderPath = path.join(UPLOADS_DIR, "forms", "formSlipQRcode");

      //delivery
    } else if (file.fieldname === "passportOrIDnumberFile") {
      folderPath = path.join(UPLOADS_DIR, "deliveries", "passportOrIDnumber");
    } else if (file.fieldname === "registrationBookFileDelivery") {
      folderPath = path.join(
        UPLOADS_DIR,
        "deliveries",
        "registrationBookDelivery"
      );
    } else if (file.fieldname === "licenseFileDelivery") {
      folderPath = path.join(UPLOADS_DIR, "deliveries", "licenseDelivery");

      //transport
    } else if (file.fieldname === "passportOrIDnumberFileTransport") {
      folderPath = path.join(
        UPLOADS_DIR,
        "transports",
        "passportOrIDnumberTransport"
      );
    } else if (file.fieldname === "registrationBookFileTransport") {
      folderPath = path.join(
        UPLOADS_DIR,
        "transports",
        "registrationBookTransport"
      );
    } else if (file.fieldname === "licenseFileTransport") {
      folderPath = path.join(UPLOADS_DIR, "transports", "licenseTransport");

      //insurance
    } else if (file.fieldname === "registrationBookInsuranceCarFile") {
      folderPath = path.join(
        UPLOADS_DIR,
        "insurances",
        "registrationBookInsuranceCarFile"
      );
    } else if (file.fieldname === "registrationBookInsuranceMotorcycleFile") {
      folderPath = path.join(
        UPLOADS_DIR,
        "insurances",
        "registrationBookInsuranceMotorcycleFile"
      );
    } else if (file.fieldname === "titleDeedFile") {
      folderPath = path.join(UPLOADS_DIR, "insurances", "titleDeedFile");
    } else if (file.fieldname === "voluntaryInsuranceCarFile") {
      folderPath = path.join(
        UPLOADS_DIR,
        "insurances",
        "voluntaryInsuranceCarFile"
      );
    } else if (file.fieldname === "voluntaryInsuranceMotorcycleFile") {
      folderPath = path.join(
        UPLOADS_DIR,
        "insurances",
        "voluntaryInsuranceMotorcycleFile"
      );
    } else if (file.fieldname === "voluntaryInsuranceHouseFile") {
      folderPath = path.join(
        UPLOADS_DIR,
        "insurances",
        "voluntaryInsuranceHouseFile"
      );
    } else if (file.fieldname === "noIDcardFile") {
      folderPath = path.join(UPLOADS_DIR, "insurances", "noIDcardFile");

      //print
    } else if (
      file.fieldname == "printFile" &&
      file.mimetype === "application/pdf"
    ) {
      folderPath = path.join(UPLOADS_DIR, "prints", "pdf");
    } else if (
      file.fieldname == "printFile" &&
      ["image/jpeg", "image/png"].includes(file.mimetype)
    ) {
      folderPath = path.join(UPLOADS_DIR, "prints", "photo");
    } else if (file.fieldname === "printSlipQRcode") {
      folderPath = path.join(UPLOADS_DIR, "prints", "printSlipQRcode");
    }

    // ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created directory: ${folderPath}`);
    }

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // สุ่มตัวเลข 4 หลัก
    const ext = path.extname(file.originalname);
    const randomFileName = `${formattedDate}_${randomSuffix}${ext}`;

    cb(null, randomFileName);
  },
});

// ตั้งค่า multer
const upload = multer({ storage });

const ensureDirectoriesExist = () => {
  const directories = [
    path.join(UPLOADS_DIR, "forms"),
    path.join(UPLOADS_DIR, "forms", "registrationBook"),
    path.join(UPLOADS_DIR, "forms", "licensePlate"),
    path.join(UPLOADS_DIR, "forms", "formSlipQRcode"),
    path.join(UPLOADS_DIR, "deliveries", "passportOrIDnumber"),
    path.join(UPLOADS_DIR, "deliveries", "registrationBookDelivery"),
    path.join(UPLOADS_DIR, "deliveries", "licenseDelivery"),
    path.join(UPLOADS_DIR, "transports", "passportOrIDnumberTransport"),
    path.join(UPLOADS_DIR, "transports", "registrationBookTransport"),
    path.join(UPLOADS_DIR, "transports", "licenseTransport"),
    path.join(UPLOADS_DIR, "insurances"),
    path.join(UPLOADS_DIR, "insurances", "registrationBookInsuranceCarFile"),
    path.join(
      UPLOADS_DIR,
      "insurances",
      "registrationBookInsuranceMotorcycleFile"
    ),
    path.join(UPLOADS_DIR, "insurances", "titleDeedFile"),
    path.join(UPLOADS_DIR, "insurances", "voluntaryInsuranceCarFile"),
    path.join(UPLOADS_DIR, "insurances", "voluntaryInsuranceMotorcycleFile"),
    path.join(UPLOADS_DIR, "insurances", "voluntaryInsuranceHouseFile"),
    path.join(UPLOADS_DIR, "insurances", "noIDcardFile"),
    path.join(UPLOADS_DIR, "prints", "pdf"),
    path.join(UPLOADS_DIR, "prints", "photo"),
    path.join(UPLOADS_DIR, "prints", "printSlipQRcode"),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

ensureDirectoriesExist();

// ให้บริการไฟล์ที่อัปโหลด
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ลบไฟล์จาก server
app.delete("/delete-file", (req, res) => {
  const { fileName } = req.body; // รับชื่อไฟล์จาก client
  if (!fileName) {
    return res.status(400).json({ error: "No file name provided" });
  }

  const filePath = path.resolve(__dirname, "uploads", fileName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // ลบไฟล์
      console.log(`File deleted: ${fileName}`);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      console.error("File not found:", filePath);
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// ฟังก์ชันลดขนาดและแปลงไฟล์เป็น JPEG
const processImageFile = async (filePath: string): Promise<string> => {
  const outputFilePath = filePath.replace(/\.[^/.]+$/, ".jpeg");

  try {
    // ประมวลผลไฟล์ด้วย Sharp
    await sharp(filePath)
      .resize({ width: 1080, height: 1080, fit: "inside" })
      .jpeg({ quality: 80 })
      .toFile(outputFilePath);

    // ลองลบไฟล์ต้นฉบับ
    try {
      await fsp.unlink(filePath);
    } catch (unlinkError) {
      console.error(
        `Failed to unlink file: ${filePath}. This file may still be in use.`,
        unlinkError
      );
    }

    console.error(`outputFilePath = `, outputFilePath);
    return outputFilePath;
  } catch (sharpError) {
    console.error(`Error processing file: ${filePath}`, sharpError);
    throw new Error(`Failed to process file: ${filePath}`);
  }
};

// เพิ่ม endpoint สำหรับการอัปโหลดหลายไฟล์
app.post(
  "/upload-multiple",
  upload.fields([
    { name: "printFile", maxCount: 1 },
    { name: "printSlipQRcode", maxCount: 1 },
    { name: "passportOrIDnumberFile", maxCount: 1 },
    { name: "registrationBookFileDelivery", maxCount: 1 },
    { name: "licenseFileDelivery", maxCount: 1 },
    { name: "passportOrIDnumberFileTransport", maxCount: 1 },
    { name: "registrationBookFileTransport", maxCount: 1 },
    { name: "licenseFileTransport", maxCount: 1 },
    { name: "registrationBookFile", maxCount: 1 },
    { name: "licensePlateFile", maxCount: 1 },
    { name: "formSlipQRcode", maxCount: 1 },
    { name: "registrationBookInsuranceCarFile", maxCount: 1 },
    { name: "registrationBookInsuranceMotorcycleFile", maxCount: 1 },
    { name: "titleDeedFile", maxCount: 1 },
    { name: "voluntaryInsuranceCarFile", maxCount: 1 },
    { name: "voluntaryInsuranceMotorcycleFile", maxCount: 1 },
    { name: "voluntaryInsuranceHouseFile", maxCount: 1 },
    { name: "noIDcardFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const body = req.body;

      const processedFiles: {
        [key: string]: {
          originalName: string;
          storedFileName: string;
        } | null;
      } = {};

      // Group: Print
      const printFile = files["printFile"]?.[0];
      const printSlipQRcode = files["printSlipQRcode"]?.[0];

      // Group: Form
      const registrationBookFile = files["registrationBookFile"]?.[0];
      const licensePlateFile = files["licensePlateFile"]?.[0];
      const formSlipQRcode = files["formSlipQRcode"]?.[0];

      // Group: Delivery
      const passportOrIDnumberFile = files["passportOrIDnumberFile"]?.[0];
      const registrationBookFileDelivery =
        files["registrationBookFileDelivery"]?.[0];
      const licenseFileDelivery = files["licenseFileDelivery"]?.[0];

      // Group: Transport
      const passportOrIDnumberFileTransport =
        files["passportOrIDnumberFileTransport"]?.[0];
      const registrationBookFileTransport =
        files["registrationBookFileTransport"]?.[0];
      const licenseFileTransport = files["licenseFileTransport"]?.[0];

      // Group: Insurance
      const registrationBookInsuranceCarFile =
        files["registrationBookInsuranceCarFile"]?.[0];
      const registrationBookInsuranceMotorcycleFile =
        files["registrationBookInsuranceMotorcycleFile"]?.[0];
      const titleDeedFile = files["titleDeedFile"]?.[0];
      const voluntaryInsuranceCarFile = files["voluntaryInsuranceCarFile"]?.[0];
      const voluntaryInsuranceMotorcycleFile =
        files["voluntaryInsuranceMotorcycleFile"]?.[0];
      const voluntaryInsuranceHouseFile =
        files["voluntaryInsuranceHouseFile"]?.[0];
      const noIDcardFile = files["noIDcardFile"]?.[0];

      // Form Validation
      if (body.type === "Form") {
        if (!registrationBookFile) {
          return res.status(400).json({
            error: "registrationBookFile is required for Form.",
          });
        }
        if (!licensePlateFile) {
          return res.status(400).json({
            error: "licensePlateFile is required for Form.",
          });
        }
      }

      // Delivery Validation
      if (body.type === "Delivery") {
        if (!passportOrIDnumberFile) {
          return res.status(400).json({
            error: "passportOrIDnumberFile is required for Delivery.",
          });
        }
        if (
          body.selectDeliveryType === "ส่งรถกลับบ้าน" &&
          !registrationBookFileDelivery
        ) {
          return res.status(400).json({
            error:
              "registrationBookFileDelivery is required for 'ส่งรถกลับบ้าน'.",
          });
        }
      }

      // Transport Validation
      if (body.type === "Transport") {
        if (!passportOrIDnumberFileTransport) {
          return res.status(400).json({
            error: "passportOrIDnumberFileTransport is required for Transport.",
          });
        }
        if (
          body.selectTransportType === "ส่งรถกลับบ้าน" &&
          !registrationBookFileTransport
        ) {
          return res.status(400).json({
            error:
              "registrationBookFileTransport is required for 'ส่งรถกลับบ้าน'.",
          });
        }
      }

      // Insurance Validation
      if (body.type === "Insurance") {
        if (body.vehicleType === "รถยนต์") {
          if (!files.registrationBookInsuranceCarFile) {
            return res.status(400).json({
              error:
                "registrationBookInsuranceCarFile is required for รถยนต์ insurance.",
            });
          }
          if (
            body.hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" &&
            !files.voluntaryInsuranceCarFile
          ) {
            return res.status(400).json({
              error:
                "voluntaryInsuranceCarFile is required for รถยนต์ insurance with 'ยังมีประกันภัยภาคสมัครใจ'.",
            });
          }
        } else if (body.vehicleType === "รถจักรยานยนต์") {
          if (!files.registrationBookInsuranceMotorcycleFile) {
            return res.status(400).json({
              error:
                "registrationBookInsuranceMotorcycleFile is required for รถจักรยานยนต์ insurance.",
            });
          }
          if (
            body.hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" &&
            !files.voluntaryInsuranceMotorcycleFile
          ) {
            return res.status(400).json({
              error:
                "voluntaryInsuranceMotorcycleFile is required for รถจักรยานยนต์ insurance with 'ยังมีประกันภัยภาคสมัครใจ'.",
            });
          }
        } else if (body.vehicleType === "หอพัก บ้าน") {
          if (!files.titleDeedFile || !files.noIDcardFile) {
            return res.status(400).json({
              error:
                "titleDeedFile and noIDcardFile are required for หอพัก บ้าน insurance.",
            });
          }
          if (
            body.hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" &&
            !files.voluntaryInsuranceHouseFile
          ) {
            return res.status(400).json({
              error:
                "voluntaryInsuranceHouseFile is required for หอพัก บ้าน insurance with 'ยังมีประกันภัยภาคสมัครใจ'.",
            });
          }
        }
      }

      for (const fieldName in files) {
        const file = files[fieldName]?.[0];
        if (file) {
          try {
            const processedFilePath = await processImageFile(file.path);
            processedFiles[fieldName] = {
              originalName: file.originalname,
              storedFileName: path.basename(processedFilePath),
            };
          } catch (error) {
            console.error(
              `Error processing file for field ${fieldName}:`,
              error
            );
            processedFiles[fieldName] = null; // กำหนดค่าเป็น null หากมีข้อผิดพลาด
          }
        } else {
          console.warn(`No file found for field ${fieldName}`);
          processedFiles[fieldName] = null; // หากไม่มีไฟล์แนบมาก็ให้เป็น null
        }
      }

      // Generate print file paths
      const printFilePath = printFile
        ? `https://${req.get("host")}/uploads/${
            printFile.mimetype === "application/pdf"
              ? "prints/pdf"
              : "prints/photo"
          }/${printFile.filename}`
        : null;

      const printSlipQRcodePath = printSlipQRcode
        ? `https://${req.get("host")}/uploads/prints/printSlipQRcode/${
            printSlipQRcode.filename
          }`
        : null;

      // Generate form file paths
      const registrationBookFilePath = registrationBookFile
        ? `https://${req.get("host")}/uploads/forms/registrationBook/${
            registrationBookFile.filename
          }`
        : null;

      const licensePlateFilePath = licensePlateFile
        ? `https://${req.get("host")}/uploads/forms/licensePlate/${
            licensePlateFile.filename
          }`
        : null;

      const formSlipQRcodePath = formSlipQRcode
        ? `https://${req.get("host")}/uploads/forms/formSlipQRcode/${
            formSlipQRcode.filename
          }`
        : null;

      // Generate delivery file paths
      const passportOrIDnumberFilePath = passportOrIDnumberFile
        ? `https://${req.get("host")}/uploads/deliveries/passportOrIDnumber/${
            passportOrIDnumberFile.filename
          }`
        : null;

      const registrationBookFileDeliveryPath = registrationBookFileDelivery
        ? `https://${req.get(
            "host"
          )}/uploads/deliveries/registrationBookDelivery/${
            registrationBookFileDelivery.filename
          }`
        : null;

      const licenseFileDeliveryPath = licenseFileDelivery
        ? `https://${req.get("host")}/uploads/deliveries/licenseFileDelivery/${
            licenseFileDelivery.filename
          }`
        : null;

      // Generate transport file paths ใน server.ts
      const passportOrIDnumberFileTransportPath =
        processedFiles.passportOrIDnumberFileTransport
          ? `https://${req.get(
              "host"
            )}/uploads/transports/passportOrIDnumberTransport/${
              processedFiles.passportOrIDnumberFileTransport.storedFileName
            }`
          : null;

      const registrationBookFileTransportPath =
        processedFiles.registrationBookFileTransport
          ? `https://${req.get(
              "host"
            )}/uploads/transports/registrationBookTransport/${
              processedFiles.registrationBookFileTransport.storedFileName
            }`
          : null;

      const licenseFileTransportPath = processedFiles.licenseFileTransport
        ? `https://${req.get("host")}/uploads/transports/licenseFileTransport/${
            processedFiles.licenseFileTransport.storedFileName
          }`
        : null;

      // Generate insurance file paths
      const registrationBookInsuranceCarFilePath =
        registrationBookInsuranceCarFile
          ? `https://${req.get(
              "host"
            )}/uploads/insurances/registrationBookInsuranceCarFile/${
              registrationBookInsuranceCarFile.filename
            }`
          : null;

      const registrationBookInsuranceMotorcycleFilePath =
        registrationBookInsuranceMotorcycleFile
          ? `https://${req.get(
              "host"
            )}/uploads/insurances/registrationBookInsuranceMotorcycleFile/${
              registrationBookInsuranceMotorcycleFile.filename
            }`
          : null;

      const titleDeedFilePath = titleDeedFile
        ? `https://${req.get("host")}/uploads/insurances/titleDeedFile/${
            titleDeedFile.filename
          }`
        : null;

      const voluntaryInsuranceCarFilePath = voluntaryInsuranceCarFile
        ? `https://${req.get(
            "host"
          )}/uploads/insurances/voluntaryInsuranceCarFile/${
            voluntaryInsuranceCarFile.filename
          }`
        : null;

      const voluntaryInsuranceMotorcycleFilePath =
        voluntaryInsuranceMotorcycleFile
          ? `https://${req.get(
              "host"
            )}/uploads/insurances/voluntaryInsuranceMotorcycleFile/${
              voluntaryInsuranceMotorcycleFile.filename
            }`
          : null;

      const voluntaryInsuranceHouseFilePath = voluntaryInsuranceHouseFile
        ? `https://${req.get(
            "host"
          )}/uploads/insurances/voluntaryInsuranceHouseFile/${
            voluntaryInsuranceHouseFile.filename
          }`
        : null;

      const noIDcardFilePath = noIDcardFile
        ? `https://${req.get("host")}/uploads/insurances/noIDcardFile/${
            noIDcardFile.filename
          }`
        : null;

      // Response ของ server.ts
      const response = {
        print: {
          printFile: printFile
            ? { filePath: printFilePath, storedFileName: printFile.filename }
            : null,
          printSlipQRcode: printSlipQRcode
            ? {
                filePath: printSlipQRcodePath,
                storedFileName: printSlipQRcode.filename,
              }
            : null,
        },
        form: {
          registrationBookFile: registrationBookFile
            ? {
                filePath: registrationBookFilePath,
                storedFileName: registrationBookFile.filename,
              }
            : null,
          licensePlateFile: licensePlateFile
            ? {
                filePath: licensePlateFilePath,
                storedFileName: licensePlateFile.filename,
              }
            : null,
          formSlipQRcode: formSlipQRcode
            ? {
                filePath: formSlipQRcodePath,
                storedFileName: formSlipQRcode.filename,
              }
            : null,
        },
        delivery: {
          passportOrIDnumberFile: passportOrIDnumberFile
            ? {
                filePath: passportOrIDnumberFilePath,
                storedFileName: passportOrIDnumberFile.filename,
              }
            : null,
          registrationBookFileDelivery: registrationBookFileDelivery
            ? {
                filePath: registrationBookFileDeliveryPath,
                storedFileName: registrationBookFileDelivery.filename,
              }
            : null,
          licenseFileDelivery: licenseFileDelivery
            ? {
                filePath: licenseFileDeliveryPath,
                storedFileName: licenseFileDelivery.filename,
              }
            : null,
        },
        transport: {
          passportOrIDnumberFileTransport: passportOrIDnumberFileTransport
            ? {
                filePath: passportOrIDnumberFileTransportPath,
                storedFileName:
                  processedFiles.passportOrIDnumberFileTransport
                    ?.storedFileName,
              }
            : null,
          registrationBookFileTransport: registrationBookFileTransport
            ? {
                filePath: registrationBookFileTransportPath,
                storedFileName:
                  processedFiles.registrationBookFileTransport?.storedFileName,
              }
            : null,
          licenseFileTransport: licenseFileTransport
            ? {
                filePath: licenseFileTransportPath,
                storedFileName:
                  processedFiles.licenseFileTransport?.storedFileName,
              }
            : null,
        },
        insurances: {
          registrationBookInsuranceCarFile: registrationBookInsuranceCarFile
            ? {
                filePath: registrationBookInsuranceCarFilePath,
                storedFileName: registrationBookInsuranceCarFile.filename,
              }
            : null,
          registrationBookInsuranceMotorcycleFile:
            registrationBookInsuranceMotorcycleFile
              ? {
                  filePath: registrationBookInsuranceMotorcycleFilePath,
                  storedFileName:
                    registrationBookInsuranceMotorcycleFile.filename,
                }
              : null,
          titleDeedFile: titleDeedFile
            ? {
                filePath: titleDeedFilePath,
                storedFileName: titleDeedFile.filename,
              }
            : null,
          noIDcardFile: noIDcardFile
            ? {
                filePath: noIDcardFilePath,
                storedFileName: noIDcardFile.filename,
              }
            : null,
          voluntaryInsuranceCarFile: voluntaryInsuranceCarFile
            ? {
                filePath: voluntaryInsuranceCarFilePath,
                storedFileName: voluntaryInsuranceCarFile.filename,
              }
            : null,
          voluntaryInsuranceMotorcycleFile: voluntaryInsuranceMotorcycleFile
            ? {
                filePath: voluntaryInsuranceMotorcycleFilePath,
                storedFileName: voluntaryInsuranceMotorcycleFile.filename,
              }
            : null,
          voluntaryInsuranceHouseFile: voluntaryInsuranceHouseFile
            ? {
                filePath: voluntaryInsuranceHouseFilePath,
                storedFileName: voluntaryInsuranceHouseFile.filename,
              }
            : null,
        },
      };

      console.log("Files uploaded successfully:", response);
      res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

app.post("/webhook", async (req, res) => {
  try {
    console.log("Received request at /webhook");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));
    const { type, message, userId, events } = req.body;

    // Handle Push Message
    if (type && message && userId) {
      // ส่งข้อความ Push Message
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      };

      console.log("heraders: ", headers);

      const body = {
        to: userId,
        messages: message,
      };

      const response = await fetch(LINE_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("LINE Push Message Error:", errorText);
        return res.status(500).json({ error: "Failed to send message." });
      }

      console.log("Push message sent successfully.");
      return res.status(200).json({ success: true });
    }

    // Handle Reply Message
    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const replyToken = event.replyToken;
        const userMessage = event.message.text;

        await replyToUser(replyToken, `คุณส่งข้อความ: ${userMessage}`);
      }
    }

    // Handle LINE Verify request
    if (!events || events.length === 0) {
      console.log("Webhook verified successfully.");
      return res
        .status(200)
        .json({ message: "Webhook verified successfully." });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function replyToUser(replyToken: string, message: string) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
  };

  const body = {
    replyToken,
    messages: [{ type: "text", text: message }],
  };

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

// ตัวอย่าง route
app.get("/", (req, res) => {
  res.send("API is working!");
});

app.post("/", (req, res) => {
  res.status(200).json({ message: "POST request received!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://maps.googleapis.com; object-src 'none';"
  );
  next();
});
