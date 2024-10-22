// summary.tsx
import React from "react";
import { Col, Row, Button } from "react-bootstrap";

interface SummaryProps {
  ownerData: string;
  usernameData: string;
  engineSize: string;
  contactNumber: string;
  registrationNumber: string;
  carOrMotorcycleLabel: string;
  registrationDate: Date | null;
  expirationDate: Date | null;
  latestTaxPaymentDate: Date | null;
  selectedRadio: string | null;
  bikeTypeOrDoorCount: string | null;
  selectedCarType: string | null;
  totalCost: number | null;
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
  carOrMotorcycleLabel,
  latestTaxPaymentDate,
  selectedRadio,
  bikeTypeOrDoorCount,
  selectedCarType,
  totalCost,
  carAge,
  onBack,
  onConfirm,
}) => {
  return (
    <div>
      <h2 className="text-center">สรุปข้อมูล</h2>
      <ul className="list-unstyled">
        <li>
          <strong>ชื่อเจ้าของรถ:</strong> {usernameData}
        </li>
        <li>
          <li>
            <strong>ประเภทรถ:</strong> {selectedCarType}
          </li>
          <strong>ขนาดเครื่องยนต์:</strong> {engineSize} CC
        </li>
        <li>
          <strong>หมายเลขโทรศัพท์ติดต่อ:</strong> {contactNumber}
        </li>
        <li>
          <strong>หมายเลขทะเบียนรถ:</strong> {registrationNumber}
        </li>
        <li>
          <strong>วันที่จดทะเบียน:</strong>{" "}
          {registrationDate?.toLocaleDateString()}
        </li>
        <li>
          <strong>วันสิ้นอายุ:</strong> {expirationDate?.toLocaleDateString()}
        </li>
        <li>
          <strong>วันต่อภาษีล่าสุด:</strong>{" "}
          {latestTaxPaymentDate?.toLocaleDateString()}
        </li>
        <li>
          <strong>อายุรถ:</strong> {carAge.years} ปี {carAge.months} เดือน{" "}
          {carAge.days} วัน {/* Display the car age here */}
        </li>
        <li>
          <strong>{selectedRadio}:</strong> {ownerData}
        </li>
        <li>
          <strong>{carOrMotorcycleLabel}:</strong> {bikeTypeOrDoorCount}
        </li>
      </ul>

      {totalCost !== null && (
        <div className="mb-3">
          <strong>ค่าใช้จ่ายทั้งหมด:</strong> {totalCost} บาท
        </div>
      )}

      <hr className="my-4" />
      <footer>
        <Row className="justify-content-end">
          <Col xs="auto" style={{ minWidth: "120px" }}>
            <Button className="w-100" variant="reset" onClick={onBack}>
              ย้อนกลับ
            </Button>
          </Col>
          <Col xs="auto" style={{ minWidth: "120px" }}>
            <Button className="w-100" variant="primary" onClick={onConfirm}>
              ตกลง
            </Button>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default Summary;
