// VehicleInfo.tsx
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";

interface VehicleInfoProps {
  isInvalid: boolean;
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  engineSize: string;
  setEngineSize: (value: string) => void;
  selectedCarType: string | null;
  selectedFuelType: string | null;
  setIsFormValid: (isValid: boolean) => void;
  CCorWeight: string;
  setCCorWeight: React.Dispatch<React.SetStateAction<string>>;
  onValidateVehicleInfo: (validations: {
    isInvalidContact: boolean;
    isInvalidLicense: boolean;
    isInvalidEngineSize: boolean;
  }) => void;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  isInvalid,
  registrationNumber,
  setRegistrationNumber,
  contactNumber,
  setContactNumber,
  engineSize,
  setEngineSize,
  selectedCarType,
  selectedFuelType,
  // setIsFormValid,
  CCorWeight,
  setCCorWeight,
  onValidateVehicleInfo,
}) => {
  const [isInvalidContact, setIsInvalidContact] = useState(false);
  const [isInvalidLicense, setIsInvalidLicense] = useState(false);
  const [isInvalidEngineSize, setIsInvalidEngineSize] = useState(false);

  const handleLicenseChange = (value: string) => {
    setRegistrationNumber(value);

    // รูปแบบของทะเบียนรถไทย: เลข 1-2 ตัว (ถ้ามี) + ตัวอักษรไทย 1-2 ตัว + ตัวเลข 1-4 ตัว
    const licensePlatePattern = /^(\d{1,2})?[ก-ฮ]{1,2}\d{1,4}$/;

    // ตรวจสอบความยาวขั้นต่ำ (ไม่ควรน้อยกว่า 3 ตัวอักษร)
    const isLengthInvalid = value.length > 0 && value.length < 3;

    // ตรวจสอบรูปแบบที่ไม่ถูกต้อง
    const isFormatInvalid = !licensePlatePattern.test(value);

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidLicense(invalid);

    // ตรวจสอบความถูกต้องของฟอร์มทั้งหมด
    // setIsFormValid(!isInvalidContact && !invalid && !isInvalidEngineSize);
  };

  const handleContactChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setContactNumber(value);
    }

    // เพิ่มการตรวจสอบความยาวของหมายเลขโทรศัพท์
    const phonePattern = /^(06|08|09)\d{8}$/;
    const isFormatInvalid = value.length >= 10 && !phonePattern.test(value);
    const isLengthInvalid = value.length > 0 && value.length < 10;

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidContact(invalid);

    // setIsFormValid(!isInvalidLicense && !invalid && !isInvalidEngineSize); // เช็คความถูกต้อง
  };

  const handleEngineSizeChange = (value: string) => {
    setEngineSize(value);
    const invalid = value.length > 0 && isNaN(Number(value));
    setIsInvalidEngineSize(invalid);
    // setIsFormValid(!isInvalidLicense && !isInvalidContact && !invalid); // เช็คความถูกต้อง
  };

  // Update label when selectedCarType changes
  useEffect(() => {
    if (selectedCarType) {
      // ตั้งค่าป้ายข้อความ
      const label =
        selectedCarType === "รถบรรทุก" ||
        selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
        selectedCarType === "รถไฮบริด" ||
        selectedCarType === "รถไฟฟ้า"
          ? "น้ำหนักรถ (กิโลกรัม)"
          : "ขนาดความจุ CC";

      setCCorWeight(label);

      // ล้างค่าเมื่อเปลี่ยนประเภท
      // setEngineSize(""); // ล้างขนาดเครื่องยนต์
    }

    const validations = {
      isInvalidContact,
      isInvalidLicense,
      isInvalidEngineSize,
    };

    onValidateVehicleInfo(validations);
  }, [
    selectedCarType,
    setCCorWeight,
    setEngineSize,
    isInvalidContact,
    isInvalidLicense,
    isInvalidEngineSize,
    onValidateVehicleInfo,
  ]);

  return (
    <Row>
      {/* หมายเลขทะเบียนรถ */}
      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="หมายเลขทะเบียนรถ"
          id="registrationNumber"
          value={registrationNumber}
          onChange={(e) => handleLicenseChange(e.target.value)}
          required
          placeholder="ตัวอย่าง: 1กข9xxx"
          isInvalid={isInvalidLicense || isInvalid}
          alertText={
            isInvalidLicense
              ? registrationNumber.length < 3
                ? "กรุณากรอกหมายเลขทะเบียนรถให้ครบถ้วน"
                : "กรุณากรอกหมายเลขทะเบียนรถให้ถูกต้อง"
              : ""
          }
        />
      </Col>

      {/* หมายเลขโทรศัพท์ผู้กรอกข้อมูล */}
      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="หมายเลขโทรศัพท์ผู้กรอก"
          id="contactNumber"
          value={contactNumber}
          type="numeric"
          inputMode="numeric"
          onChange={(e) => handleContactChange(e.target.value)}
          placeholder="หมายเลขโทรศัพท์10หลัก"
          required
          isInvalid={isInvalidContact || isInvalid}
          alertText={
            isInvalidContact
              ? contactNumber.length > 10
                ? "กรุณากรอกหมายเลขโทรศัพท์ 10 หลักและเริ่มด้วย 06, 08 หรือ 09"
                : "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
              : ""
          }
          isPhoneNumber
        />
      </Col>

      {/* น้ำหนักรถหรือCC */}
      {selectedCarType && (
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label={CCorWeight}
            placeholder={
              selectedCarType === "รถบรรทุก" ||
              selectedCarType === "รถกระบะ" ||
              selectedFuelType === "ไฮบริด" ||
              selectedFuelType === "ไฟฟ้า"
                ? "กรอกน้ำหนักรถ(กิโลกรัม)"
                : selectedCarType === "รถพ่วง" ||
                  // selectedCarType === "รถบดถนน" ||
                  selectedCarType === "รถแทรกเตอร์"
                ? "ไม่ต้องใส่"
                : "กรอกความจุของรถ(CC)"
            }
            id="engineSize"
            value={engineSize}
            onChange={(e) => handleEngineSizeChange(e.target.value)}
            required
            isInvalid={isInvalidEngineSize || isInvalid}
            alertText="กรุณากรอกขนาดเครื่องยนต์ให้ถูกต้อง"
            type="numeric"
            inputMode="numeric"
            disabled={
              selectedCarType === "รถพ่วง" ||
              // selectedCarType === "รถบดถนน" ||
              selectedCarType === "รถแทรกเตอร์"
            } // เพิ่มเงื่อนไขล็อค
            isNumericWithComma
          />
        </Col>
      )}
    </Row>
  );
};

export default VehicleInfo;
