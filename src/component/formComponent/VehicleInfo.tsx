// VehicleInfo.tsx
import React, { useEffect, useState } from "react";
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
  setIsFormValid: (isValid: boolean) => void;
  CCorWeight: string;
  setVehicleLabel: React.Dispatch<React.SetStateAction<string>>; // Add this line
  setCCorWeight: React.Dispatch<React.SetStateAction<string>>;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  registrationNumber,
  setRegistrationNumber,
  contactNumber,
  setContactNumber,
  engineSize,
  setEngineSize,
  selectedCarType,
  setIsFormValid,
  CCorWeight,
  setCCorWeight,
  setVehicleLabel, // Add this line
}) => {
  const [isInvalidContact, setIsInvalidContact] = useState(false);
  const [isInvalidLicense, setIsInvalidLicense] = useState(false);
  const [isInvalidEngineSize, setIsInvalidEngineSize] = useState(false);

  const handleLicenseChange = (value: string) => {
    setRegistrationNumber(value);
    const licensePlatePattern = /^[A-Za-z0-9ก-ฮ]{1,8}$/;
    const isLengthInvalid = value.length > 0 && value.length < 3;
    const isFormatInvalid =
      value.length > 3 && !licensePlatePattern.test(value);

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidLicense(invalid);

    setIsFormValid(!isInvalidContact && !invalid && !isInvalidEngineSize); // เช็คความถูกต้อง
  };

  const handleContactChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setContactNumber(value);
    }

    // เพิ่มการตรวจสอบความยาวของหมายเลขโทรศัพท์
    const phonePattern = /^(06|08|09)\d{8}$/;
    const isLengthInvalid = value.length > 0 && value.length < 10;
    const isFormatInvalid = value.length >= 10 && !phonePattern.test(value);

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidContact(invalid);

    setIsFormValid(!isInvalidLicense && !invalid && !isInvalidEngineSize); // เช็คความถูกต้อง
  };

  const handleEngineSizeChange = (value: string) => {
    setEngineSize(value);
    const invalid = value.length > 0 && isNaN(Number(value));
    setIsInvalidEngineSize(invalid);
    setIsFormValid(!isInvalidLicense && !isInvalidContact && !invalid); // เช็คความถูกต้อง
  };

  // Update label when selectedCarType changes
  useEffect(() => {
    if (selectedCarType) {
      const label =
        selectedCarType === "รถบรรทุก" ||
        selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
        selectedCarType === "รถไฮบริด" ||
        selectedCarType === "รถไฟฟ้า"
          ? "น้ำหนักรถ (กิโลกรัม)"
          : "ขนาดความจุ CC";

      setCCorWeight(label); // Set label for engine size or weight
      setVehicleLabel(label); // Save label to use in summary.tsx
    }
  }, [selectedCarType, setCCorWeight, setVehicleLabel]);

  return (
    <Row>
      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="หมายเลขทะเบียนรถ"
          id="registrationNumber"
          value={registrationNumber}
          onChange={(e) => handleLicenseChange(e.target.value)}
          required
          placeholder="กรอกหมายเลขทะเบียนรถ"
          isInvalid={isInvalidLicense}
          alertText={
            isInvalidLicense
              ? registrationNumber.length < 3
                ? "กรุณากรอกหมายเลขทะเบียนรถให้ครบถ้วน"
                : "กรอกเกินจำนวน กรุณากรอกหมายเลขทะเบียนรถให้ถูกต้อง"
              : ""
          }
        />
      </Col>

      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="เบอร์โทรศัพท์ผู้กรอกข้อมูล"
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => handleContactChange(e.target.value)}
          placeholder="กรอกหมายเลขโทรศัพท์"
          required
          isInvalid={isInvalidContact}
          alertText={
            isInvalidContact
              ? contactNumber.length > 10
                ? "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง (เริ่มด้วย 06, 08 หรือ 09)"
                : "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
              : ""
          }
        />
      </Col>

      <Col className="mb-4" md={4} xs={12}>
        {selectedCarType && (
          <TextInput
            label={CCorWeight}
            placeholder={
              selectedCarType === "รถบรรทุก" ||
              selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
              selectedCarType === "รถไฮบริด" ||
              selectedCarType === "รถไฟฟ้า"
                ? "กรอกน้ำหนักรถ(กิโลกรัม)"
                : "กรอกความจุของรถ(CC)"
            }
            id="engineSize"
            value={
              selectedCarType === "รถพ่วง" ||
              selectedCarType === "รถบดถนน" ||
              selectedCarType === "รถแทรกเตอร์"
                ? engineSize === "1"
                  ? "1" // ใช้ "0" แทน ""
                  : engineSize
                : engineSize
            }
            onChange={(e) => handleEngineSizeChange(e.target.value)}
            required
            isInvalid={isInvalidEngineSize}
            alertText="กรุณากรอกขนาดเครื่องยนต์ให้ถูกต้อง"
            disabled={
              selectedCarType === "รถพ่วง" ||
              selectedCarType === "รถบดถนน" ||
              selectedCarType === "รถแทรกเตอร์"
            } // เพิ่มเงื่อนไขล็อค
          />
        )}
      </Col>
    </Row>
  );
};

export default VehicleInfo;
