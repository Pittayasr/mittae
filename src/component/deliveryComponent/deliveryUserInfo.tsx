//deliveryUserInfo.tsx
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";

interface DeliveryUserInfoProps {
  isInvalid: boolean;
  username: string;
  setUsername: (value: string) => void;
  contactNum: string;
  setContactNum: (value: string) => void;
  NoIDcard: string;
  setNoIDcard: (value: string) => void;
  setIsFormValid: (isValid: boolean) => void;
}

const DeliveryUserInfo: React.FC<DeliveryUserInfoProps> = ({
  isInvalid,
  username,
  setUsername,
  contactNum,
  setContactNum,
  NoIDcard,
  setNoIDcard,
  setIsFormValid,
}) => {
  const [isInvalidUsername, setInvalidName] = useState(false);
  const [isInvalidContactNum, setIsInvalidContactNum] = useState(false);
  const [isInvalidNoIDcard, setIsInvalidNoIDcard] = useState(false);

  const handleUsernameChange = (value: string) => {
    const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;
    const invalid = value.length > 0 && !namePattern.test(value);

    setUsername(value);
    setInvalidName(invalid);

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormValid(!invalid && !isInvalidNoIDcard && !isInvalidContactNum);
  };

  const handleContactNumChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setContactNum(value);
    }

    // เพิ่มการตรวจสอบความยาวของหมายเลขโทรศัพท์
    const phonePattern = /^(06|08|09)\d{8}$/;
    const isFormatInvalid = value.length >= 10 && !phonePattern.test(value);
    const isLengthInvalid = value.length > 0 && value.length < 10;

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidContactNum(invalid);

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormValid(!invalid && !isInvalidUsername && !isInvalidNoIDcard);
  };

  const handleNoIDcardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let invalid = false;

    const idCardPattern = /^\d{13}$/; // ID card pattern
    invalid = value.length > 0 && !idCardPattern.test(value);

    if (!invalid) {
      // ตรวจสอบการคำนวณเลขหลักที่ 13
      const idArray = value.split("").map(Number); // แยกตัวเลขแต่ละหลัก
      let sum = 0;

      for (let i = 0; i < 12; i++) {
        sum += idArray[i] * (13 - i); // คูณเลขแต่ละหลักด้วยตำแหน่งที่สอดคล้อง
      }

      const checkDigit = (11 - (sum % 11)) % 10; // คำนวณเลขตรวจสอบ (หลักที่ 13)

      // ตรวจสอบว่าเลขหลักที่ 13 ตรงกับเลขตรวจสอบหรือไม่
      invalid = idArray[12] !== checkDigit;
    }

    setNoIDcard(value);
    setIsInvalidNoIDcard(invalid);

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormValid(!invalid && !isInvalidUsername && !isInvalidContactNum);
  };

  return (
    <Row>
      {/* ชื่อ-นามสกุล */}
      <Col className="mb-4" md={4} xs={12}>
        <TextInput
          id="username"
          label="ชื่อ-นามสกุล"
          value={username}
          placeholder="ชื่อ นามสกุล"
          onChange={(e) => handleUsernameChange(e.target.value)}
          isInvalid={isInvalidUsername || isInvalid}
          alertText="กรุณากรอกชื่อให้ถูกต้อง"
          required
        />
      </Col>
      {/* เบอร์โทรศัพท์ */}
      <Col className="mb-4" md={4} xs={12}>
        <TextInput
          id="contactNum"
          label="เบอร์โทรศัพท์"
          value={contactNum}
          placeholder="หมายเลขโทรศัพท์10หลัก"
          onChange={(e) => handleContactNumChange(e.target.value)}
          isInvalid={isInvalidContactNum || isInvalid}
          alertText={
            isInvalidContactNum
              ? contactNum.length > 10
                ? "กรุณากรอกหมายเลขโทรศัพท์ 10 หลักและเริ่มด้วย 06, 08 หรือ 09"
                : "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
              : ""
          }
          required
          type="tel"
        />
      </Col>
      {/* หมายเลขบัตรประชาชน */}
      <Col className="mb-4" md={4} xs={12}>
        <TextInput
          id="userName"
          label="กรอกหมายเลขบัตรประชาชน"
          value={NoIDcard}
          placeholder="กรอกหมายเลขบัตรประชาชน"
          onChange={handleNoIDcardChange}
          isInvalid={isInvalidNoIDcard || isInvalid}
          alertText={
            isInvalidNoIDcard
              ? NoIDcard.length < 13
                ? "กรอกหมายเลขบัตรประชาชนให้ครบถ้วน"
                : "หมายเลขบัตรประชาชนไม่ถูกต้อง"
              : ""
          }
          required
          type="numeric"
        />
      </Col>
    </Row>
  );
};

export default DeliveryUserInfo;
