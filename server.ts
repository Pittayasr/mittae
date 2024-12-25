// server.ts
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(process.env.VITE_API_BASE_URL);

const PORT = process.env.PORT || 3000; // ใช้ PORT จากไฟล์ .env หรือค่าดีฟอลต์ 3000
const UPLOADS_DIR = process.env.UPLOADS_DIRECTORY || "uploads";

// เปิดใช้งาน CORS
app.use(
  cors({
    origin: [
      "https://www.mittaemaefahlung88.com",
      "https://api.mittaemaefahlung88.com",
      "http://localhost:3000/",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// server.ts
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

// เพิ่ม endpoint สำหรับการอัปโหลดหลายไฟล์
app.post(
  "/upload-multiple",
  upload.fields([
    { name: "printFile", maxCount: 1 },
    { name: "printSlipQRcode", maxCount: 1 },
    { name: "passportOrIDnumberFile", maxCount: 1 },
    { name: "registrationBookFileDelivery", maxCount: 1 },
    { name: "licenseFileDelivery", maxCount: 1 },
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
  (req, res) => {
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const body = req.body;

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

      // Generate print file paths
      const printFilePath = printFile
        ? `${req.protocol}://${req.get("host")}/uploads/${
            printFile.mimetype === "application/pdf"
              ? "prints/pdf"
              : "prints/photo"
          }/${printFile.filename}`
        : null;

      const printSlipQRcodePath = printSlipQRcode
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/prints/printSlipQRcode/${printSlipQRcode.filename}`
        : null;

      // Generate form file paths
      const registrationBookFilePath = registrationBookFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/forms/registrationBook/${registrationBookFile.filename}`
        : null;

      const licensePlateFilePath = licensePlateFile
        ? `${req.protocol}://${req.get("host")}/uploads/forms/licensePlate/${
            licensePlateFile.filename
          }`
        : null;

      const formSlipQRcodePath = formSlipQRcode
        ? `${req.protocol}://${req.get("host")}/uploads/forms/formSlipQRcode/${
            formSlipQRcode.filename
          }`
        : null;
      
      // Generate delivery file paths
      const passportOrIDnumberFilePath = passportOrIDnumberFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/deliveries/passportOrIDnumber/${
            passportOrIDnumberFile.filename
          }`
        : null;

      const registrationBookFileDeliveryPath = registrationBookFileDelivery
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/deliveries/registrationBookDelivery/${
            registrationBookFileDelivery.filename
          }`
        : null;

      const licenseFileDeliveryPath = licenseFileDelivery
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/deliveries/licenseFileDelivery/${
            licenseFileDelivery.filename
          }`
        : null;

      // Generate insurance file paths  
      const registrationBookInsuranceCarFilePath =
        registrationBookInsuranceCarFile
          ? `${req.protocol}://${req.get(
              "host"
            )}/uploads/insurances/registrationBookInsuranceCarFile/${
              registrationBookInsuranceCarFile.filename
            }`
          : null;

      const registrationBookInsuranceMotorcycleFilePath =
        registrationBookInsuranceMotorcycleFile
          ? `${req.protocol}://${req.get(
              "host"
            )}/uploads/insurances/registrationBookInsuranceMotorcycleFile/${
              registrationBookInsuranceMotorcycleFile.filename
            }`
          : null;

      const titleDeedFilePath = titleDeedFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/insurances/titleDeedFile/${titleDeedFile.filename}`
        : null;

      const voluntaryInsuranceCarFilePath = voluntaryInsuranceCarFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/insurances/voluntaryInsuranceCarFile/${
            voluntaryInsuranceCarFile.filename
          }`
        : null;

      const voluntaryInsuranceMotorcycleFilePath =
        voluntaryInsuranceMotorcycleFile
          ? `${req.protocol}://${req.get(
              "host"
            )}/uploads/insurances/voluntaryInsuranceMotorcycleFile/${
              voluntaryInsuranceMotorcycleFile.filename
            }`
          : null;

      const voluntaryInsuranceHouseFilePath = voluntaryInsuranceHouseFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/insurances/voluntaryInsuranceHouseFile/${
            voluntaryInsuranceHouseFile.filename
          }`
        : null;

      const noIDcardFilePath = noIDcardFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/insurances/noIDcardFile/${noIDcardFile.filename}`
        : null;

      // Response object
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
      res.status(200).json(response);
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

// ตัวอย่าง route
app.get("/", (req, res) => {
  res.send("API is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
