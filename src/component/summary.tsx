// summary.tsx
import React from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/th"; // สำหรับภาษาไทย
import axios from "axios";

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  const formattedDate = dayjs(date).locale("th").format("D MMMM YYYY");
  const buddhistYear = dayjs(date).year() + 543;
  return formattedDate.replace(`${dayjs(date).year()}`, `${buddhistYear}`);
};

interface SummaryProps {
  ownerData: string;
  usernameData: string;
  engineSize: string;
  contactNumber: string;
  registrationNumber: string;
  CCorWeight: string;
  carOrMotorcycleLabel: string;
  registrationDate: Date | null;
  expirationDate: Date | null;
  latestTaxPaymentDate: Date | null;
  selectedRadio: string | null;
  bikeTypeOrDoorCount: string | null;
  selectedCarType: string | null;
  totalCost: number | null;
  prbCost: number | null; // ค่าพรบ.สุทธิ
  taxCost: number | null; // ค่าภาษีสุทธิ
  lateFee: number | null; // ค่าปรับล่าช้า
  inspectionCost: number | null; // ค่าตรวจสภาพ
  processingCost: number | null; // ค่าดำเนินการ
  carAge: { years: number; months: number; days: number };
  onBack: () => void; // ฟังก์ชันสำหรับย้อนกลับ
  onConfirm: () => void; // ฟังก์ชันสำหรับส่งข้อมูล
}

const Summary: React.FC<SummaryProps> = ({
  ownerData,
  usernameData,
  engineSize,
  contactNumber,
  registrationNumber,
  registrationDate,
  expirationDate,
  CCorWeight,
  carOrMotorcycleLabel,
  latestTaxPaymentDate,
  selectedRadio,
  bikeTypeOrDoorCount,
  selectedCarType,
  totalCost,
  prbCost,
  taxCost,
  lateFee,
  inspectionCost,
  processingCost,
  carAge,
  onBack,
  onConfirm,
}) => {
  const handleConfirm = async () => {
    const data = {
      ownerData,
      usernameData,
      engineSize,
      contactNumber,
      registrationNumber,
      registrationDate,
      expirationDate,
      latestTaxPaymentDate,
      selectedRadio,
      bikeTypeOrDoorCount,
      selectedCarType,
      totalCost,
      prbCost,
      taxCost,
      lateFee,
      inspectionCost,
      processingCost,
      carAge,
    };

    try {
      const response = await axios.post(
        "http://your-vps-ip-address:5000/submit-summary", // เปลี่ยนเป็น IP ของ VPS
        data
      );
      console.log("Data sent successfully:", response.data);
      onConfirm(); // ฟังก์ชันสำหรับการส่งข้อมูลสำเร็จ
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  return (
    <Form>
      <h2 className="text-center mb-4">สรุปข้อมูล</h2>
      <Row>
        <Col md={6}>
          <h5 className="mb-3">ข้อมูลรถ</h5>
          <ul className="list-unstyled">
            <li className="mb-1">
              <strong>ชื่อเจ้าของรถ:</strong> {usernameData}
            </li>
            <li className="mb-1">
              <strong>ประเภทรถ:</strong> {selectedCarType}
            </li>
            <li className="mb-1">
              <strong>{carOrMotorcycleLabel}:</strong> {bikeTypeOrDoorCount}
            </li>
            <li className="mb-1">
              <strong>{CCorWeight}:</strong> {engineSize}
            </li>
            <li className="mb-1">
              <strong>หมายเลขทะเบียนรถ:</strong> {registrationNumber}
            </li>
            <li className="mb-1">
              <strong>วันที่จดทะเบียน:</strong> {formatDate(registrationDate)}
            </li>
            <li className="mb-1">
              <strong>วันสิ้นอายุ:</strong> {formatDate(expirationDate)}
            </li>
            <li className="mb-1">
              <strong>วันต่อภาษีล่าสุด:</strong>{" "}
              {formatDate(latestTaxPaymentDate)}
            </li>
            <li className="mb-4">
              <strong>อายุรถ:</strong> {carAge.years} ปี, {carAge.months} เดือน,{" "}
              {carAge.days} วัน
            </li>
          </ul>
        </Col>

        <Col md={6}>
          <h5 className="mb-3">ข้อมูลเพิ่มเติม</h5>
          <ul className="list-unstyled">
            <li className="mb-1">
              <strong>หมายเลขโทรศัพท์ติดต่อ:</strong> {contactNumber}
            </li>
            <li className="mb-1">
              <strong>{selectedRadio}:</strong> {ownerData} {/* ประเภทข้อมูลเจ้าของรถ */}
            </li>
          </ul>

          {totalCost !== null && (
            <ul className="list-unstyled mt-4">
              <h5 className="mt-3">ค่าใช้จ่าย</h5>
              <li className="mb-1">
                <strong>ค่าพรบ.สุทธิ:</strong> {prbCost} บาท
              </li>
              <li className="mb-1">
                <strong>ค่าภาษีสุทธิ:</strong> {taxCost?.toFixed(2)} บาท
              </li>
              <li className="mb-1">
                <strong>ค่าปรับล่าช้า:</strong> {lateFee?.toFixed(2)} บาท
              </li>
              <li className="mb-1">
                <strong>ค่าตรวจสภาพ:</strong> {inspectionCost} บาท
              </li>
              <li className="mb-1">
                <strong>ค่าดำเนินการ:</strong> {processingCost} บาท
              </li>
              <li className="mb-1">
                <strong>ค่าใช้จ่ายทั้งหมด:</strong> {totalCost?.toFixed(2)} บาท
              </li>
            </ul>
          )}
        </Col>
      </Row>

      <hr className="my-4" />

      <footer>
        <Row className="justify-content-end">
          <Col xs="auto" style={{ minWidth: "120px" }}>
            <Button className="w-100" variant="secondary" onClick={onBack}>
              ย้อนกลับ
            </Button>
          </Col>
          <Col xs="auto" style={{ minWidth: "120px" }}>
            <Button className="w-100" variant="primary" onClick={handleConfirm}>
              ตกลง
            </Button>
          </Col>
        </Row>
      </footer>
    </Form>
  );
};

export default Summary;
