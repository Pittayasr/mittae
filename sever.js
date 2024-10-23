const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// ตัวอย่าง API สำหรับรับข้อมูลจาก summary.tsx
app.post("/submit-summary", (req, res) => {
  const summaryData = req.body;
  // TODO: เชื่อมต่อและบันทึกข้อมูลลงฐานข้อมูล
  res.send("Data received!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const mysql = require("mysql2");

// สร้างการเชื่อมต่อกับฐานข้อมูล
const db = mysql.createConnection({
  host: "localhost", // หรือ IP ของ VPS
  user: "username",
  password: "password",
  database: "dbname",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// ตัวอย่างการบันทึกข้อมูล
app.post("/submit-summary", (req, res) => {
  const { usernameData, contactNumber, registrationNumber, totalCost } =
    req.body;

  const sql =
    "INSERT INTO summary (username, contact, registration, cost) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [usernameData, contactNumber, registrationNumber, totalCost],
    (err, result) => {
      if (err) throw err;
      res.send("Data inserted successfully");
    }
  );
});
