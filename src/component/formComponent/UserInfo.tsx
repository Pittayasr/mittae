// UserInfo.tsx
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textInput";
import TextSelect from "../textSelect";
import { provinces } from "../../data/provinces";

interface UserInfoProps {
  usernameData: string;
  setUsernameData: (value: string) => void;
  selectedProvince: string | null;
  setSelectedProvince: (value: string | null) => void;
  selectedCarType: string | null;
  setSelectedCarType: (value: string | null) => void;
  setIsFormValid: (isValid: boolean) => void; // เพิ่ม prop สำหรับเช็คความถูกต้อง
}

const UserInfo: React.FC<UserInfoProps> = ({
  usernameData,
  setUsernameData,
  selectedProvince,
  setSelectedProvince,
  selectedCarType,
  setSelectedCarType,
  setIsFormValid,
}) => {
  const [isInvalidName, setInvalidName] = useState(false);

  const handleNameChange = (value: string) => {
    const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;
    const invalid = value.length > 0 && !namePattern.test(value);
  
    setUsernameData(value);
    setInvalidName(invalid);
    
    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormValid(
      !invalid &&
      selectedProvince !== null &&
      selectedCarType !== null
    );
  };
  

  return (
    <Row className="mt-3">
      {/* ชื่อเจ้าของรถ */}
      <Col className="mb-4" md={4} xs={12}>
        <TextInput
          label="ชื่อเจ้าของรถ"
          id="userName"
          value={usernameData}
          placeholder="ชื่อ นามสกุล"
          onChange={(e) => handleNameChange(e.target.value)}
          isInvalid={isInvalidName} // เช็คความถูกต้อง
          alertText="กรุณากรอกชื่อเป็นตัวหนังสือภาษาไทยเท่านั้น" // ข้อความแจ้งเตือน
          required
        />
      </Col>

      {/* จังหวัด */}
      <Col className="mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedProvince || ""}
          label="จังหวัด"
          id="province"
          options={provinces}
          placeholder="ค้นหา..."
          onChange={(value) => setSelectedProvince(value)}
          required
        />
      </Col>

      {/* ประเภทรถ */}
      <Col className="mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedCarType || ""}
          label="ประเภทรถ"
          id="carType"
          options={[
            "รถยนต์",
            "รถจักรยานยนต์",
            "รถบรรทุก",
            "รถบรรทุก(เกิน7ที่นั่ง)",
            "รถไฮบริด",
            "รถไฟฟ้า",
            "รถบดถนน",
            "รถพ่วง",
            "รถแทรกเตอร์",
          ]}
          placeholder="ค้นหา..."
          onChange={(value) => setSelectedCarType(value)}
          required
        />
      </Col>
    </Row>
  );
};

export default UserInfo;
