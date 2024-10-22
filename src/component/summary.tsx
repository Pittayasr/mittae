// summary.tsx
import React from "react";
import Button from "./button";
import { Row, Col } from "react-bootstrap";

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
          <strong>ชื่อเจ้าของ:</strong> {ownerData}
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
      <Row className="justify-content-end">
        <Col xs={2}>
          <Button
            label="ย้อนกลับ"
            className="w-100 mb-2" // เพิ่ม margin ด้านล่าง
            variant="secondary"
            type="button" // ประเภทปุ่มเป็น 'button'
            onClick={onBack} // เรียกใช้ฟังก์ชันย้อนกลับ
          />
        </Col>
        <Col xs={2}>
          <Button
            label="ตกลง"
            className="w-100"
            variant="primary"
            type="submit" // ประเภทปุ่มเป็น 'submit'
            onClick={onConfirm} // เรียกใช้ฟังก์ชันตกลง
          />
        </Col>
      </Row>
    </div>
  );
};

export default Summary;
