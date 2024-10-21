// VehicleInfo.tsx
import React from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textInput";

interface VehicleInfoProps {
  registrationNumber: string;
  setRegistrationNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  contactNumber: string;
  setContactNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  engineSize: string;
  setEngineSize: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        onChange={setRegistrationNumber}
        required
      />
    </Col>

    <Col className="register-and-contract-number mb-4" md={4} xs={6}>
      <TextInput
        label="เบอร์โทรศัพท์ผู้กรอกข้อมูล"
        id="contactNumber"
        value={contactNumber}
        onChange={setContactNumber}
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
          onChange={setEngineSize}
          required
        />
      )}
    </Col>
  </Row>
);

export default VehicleInfo;
