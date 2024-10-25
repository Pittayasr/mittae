// server.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors"; // เพิ่ม CORS เพื่อรองรับการเชื่อมต่อข้ามโดเมน
import mysql from "mysql2";
import dayjs from "dayjs";

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  const formattedDate = dayjs(date).locale("th").format("D MMMM YYYY");
  const buddhistYear = dayjs(date).year() + 543;
  return formattedDate.replace(`${dayjs(date).year()}`, `${buddhistYear}`);
};

const app = express();
const PORT = process.env.PORT || 5000;

// ตั้งค่า middleware
app.use(bodyParser.json());
app.use(cors()); // อนุญาตให้ React เชื่อมต่อได้

// เชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: "localhost", // หรือ IP ของ VPS
  user: "yourUsername",
  password: "yourPassword",
  database: "yourDatabase",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// Endpoint สำหรับรับข้อมูลจาก React (summary.tsx)
app.post("/submit-summary", (req: Request, res: Response) => {
  const {
    ownerData,
    usernameData,
    engineSize,
    contactNumber,
    registrationNumber,
    registrationDate,
    expirationDate,
    latestTaxPaymentDate,
    bikeTypeOrDoorCount,
    selectedCarType,
    totalCost,
    prbCost,
    taxCost,
    lateFee,
    inspectionCost,
    processingCost,
    carAge,
  } = req.body;

  const sql = `
    INSERT INTO summary (
      ownerName, vehicleType, doorCount, engineSize, registrationNumber,
      registrationDate, expirationDate, latestTaxDate, carAgeYears, carAgeMonths, carAgeDays,
      contactNumber, passportOrIDcardNumber,
      prbCost, taxCost, lateFee, inspectionCost, processingCost, totalCost
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      usernameData, // ชื่อเจ้าของรถ
      selectedCarType, // ประเภทรถ
      bikeTypeOrDoorCount, // จำนวนประตูรถยนต์
      engineSize, // ขนาดความจุ CC
      registrationNumber, // หมายเลขทะเบียนรถ
      formatDate(registrationDate), // วันที่จดทะเบียน
      formatDate(expirationDate), // วันสิ้นอายุ
      formatDate(latestTaxPaymentDate), // วันต่อภาษีล่าสุด
      carAge.years, // อายุรถ ปี
      carAge.months, // อายุรถ เดือน
      carAge.days, // อายุรถ วัน
      contactNumber, // หมายเลขโทรศัพท์ติดต่อ
      ownerData, // หมายเลขบัตรประชาชนเจ้าของรถล่าสุด
      prbCost, // ค่าพรบ.สุทธิ
      taxCost, // ค่าภาษีสุทธิ
      lateFee, // ค่าปรับล่าช้า
      inspectionCost, // ค่าตรวจสภาพ
      processingCost, // ค่าดำเนินการ
      totalCost, // ค่าใช้จ่ายทั้งหมด
    ],
    (err) => {
      if (err) {
        res.status(500).send("Error inserting data");
        throw err;
      }
      res.send("Data inserted successfully");
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
