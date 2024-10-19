// VehicleInfo.tsx
import React from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textInput";


interface VehicleInfoProps {
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  engineSize: string;
  setEngineSize: (value: string) => void;
  selectedCarType: string | null;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  registrationNumber,
  setRegistrationNumber,
  contactNumber,
  setContactNumber,
  engineSize,
  setEngineSize,
  selectedCarType,
}) => (
  <Row>
    <Col className="register-and-contract-number mb-4" md={4} xs={6}>
      <TextInput
        label="หมายเลขทะเบียนรถ"
        id="registrationNumber"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
        required
      />
    </Col>

    <Col className="register-and-contract-number mb-4" md={4} xs={6}>
      <TextInput
        label="เบอร์โทรศัพท์ผู้กรอกข้อมูล"
        id="contactNumber"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        required
      />
    </Col>

    <Col className="mb-4" md={4} xs={12}>
      {selectedCarType && (
        <TextInput
          label={
            selectedCarType === "รถบรรทุก" ||
            selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
            selectedCarType === "รถไฮบริด" ||
            selectedCarType === "รถไฟฟ้า"
              ? "น้ำหนักรถ (กิโลกรัม)"
              : "ขนาดความจุ CC"
          }
          id="engineSize"
          value={engineSize}
          onChange={(e) => setEngineSize(e.target.value)}
          required
        />
      )}
    </Col>
  </Row>
);

export default VehicleInfo;
