// UserInfo.tsx
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import provinces from "../../data/provinces.json";

interface UserInfoProps {
  usernameData: string;
  setUsernameData: (value: string) => void;
  selectedProvince: string | null;
  setSelectedProvince: (value: string | null) => void;
  selectedCarType: string | null;
  setSelectedCarType: (value: string | null) => void;
  isInvalid: boolean;
  setIsFormValid: (isValid: boolean) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  isInvalid,
  usernameData,
  setUsernameData,
  selectedProvince,
  setSelectedProvince,
  selectedCarType,
  setSelectedCarType,
  setIsFormValid,
}) => {
  const [isInvalidName, setInvalidName] = useState(false);
  const [provinceList] = useState(provinces);

  const handleNameChange = (value: string) => {
    const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;
    const invalid = value.length > 0 && !namePattern.test(value);

    setUsernameData(value);
    setInvalidName(invalid);

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormValid(!invalid && !selectedProvince && !selectedCarType);
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
          required
          isInvalid={isInvalidName || isInvalid} // เช็คความถูกต้อง
          alertText="กรุณากรอกชื่อเป็นตัวหนังสือภาษาไทยเท่านั้น" // ข้อความแจ้งเตือน
        />
      </Col>

      {/* จังหวัด */}
      <Col className="mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedProvince || ""}
          label="จังหวัด"
          id="province"
          options={provinceList.map((p) => ({
            value: p.provinceCode.toString(),
            label: p.provinceNameTh,
          }))}
          placeholder="ค้นหา..."
          onChange={(value) => setSelectedProvince(value)}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกจังหวัด"
        />
      </Col>

      {/* ประเภทรถ */}
      <Col className="mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedCarType || ""}
          label="ประเภทรถ"
          id="carType"
          options={[
            { label: "รถยนต์", value: "รถยนต์" },
            { label: "รถจักรยานยนต์", value: "รถจักรยานยนต์" },
            { label: "รถบรรทุก", value: "รถบรรทุก" },
            {
              label: "รถบรรทุก(เกิน7ที่นั่ง)",
              value: "รถบรรทุก(เกิน7ที่นั่ง)",
            },
            { label: "รถไฮบริด", value: "รถไฮบริด" },
            { label: "รถไฟฟ้า", value: "รถไฟฟ้า" },
            { label: "รถบดถนน", value: "รถบดถนน" },
            { label: "รถพ่วง", value: "รถพ่วง" },
            { label: "รถแทรกเตอร์", value: "รถแทรกเตอร์" },
            { label: "รถแก๊ส", value: "รถแก๊ส" },
          ]}
          placeholder="ค้นหา..."
          onChange={(value) => setSelectedCarType(value)}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกจังหวัด"
        />
      </Col>
    </Row>
  );
};

export default UserInfo;
