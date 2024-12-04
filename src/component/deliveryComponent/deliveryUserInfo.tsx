//deliveryUserInfo.tsx
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import FileInput from "../textFillComponent/fileInput";

interface DeliveryUserInfoProps {
  isInvalid: boolean;
  username: string;
  setUsername: (value: string) => void;
  contactNum: string;
  setContactNum: (value: string) => void;
  selectedFile: File | null;
  setSelectedFile: (value: File | null) => void;
  setIsFormValid: (isValid: boolean) => void;
  onValidateUserInfo: (validations: {
    isInvalidUsername: boolean;
    isInvalidContactNum: boolean;
  }) => void;
  showSender: boolean;
}

const DeliveryUserInfo: React.FC<DeliveryUserInfoProps> = ({
  isInvalid,
  username,
  setUsername,
  contactNum,
  setContactNum,
  selectedFile,
  setSelectedFile,
  setIsFormValid,
  onValidateUserInfo,
  showSender,
}) => {
  const [isInvalidUsername, setInvalidName] = useState(false);
  const [isInvalidContactNum, setIsInvalidContactNum] = useState(false);

  useEffect(() => {
    const validations = {
      isInvalidUsername,
      isInvalidContactNum,
    };

    const isValid = !Object.values(validations).includes(true);

    onValidateUserInfo(validations);

    setIsFormValid(isValid);
    console.log(isInvalidContactNum);
  }, [
    isInvalidUsername,
    isInvalidContactNum,

    onValidateUserInfo,
    setIsFormValid,
  ]);

  const handleUsernameChange = (value: string) => {
    const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;
    const invalid = value.length > 0 && !namePattern.test(value);

    setUsername(value);
    setInvalidName(invalid);
  };

  const handleContactNumChange = (value: string) => {
    // อนุญาตให้ใส่เฉพาะตัวเลข
    if (/^\d*$/.test(value)) {
      setContactNum(value);
    }

    // ตรวจสอบความยาว
    const isTooShort = value.length > 0 && value.length < 10;
    const isTooLong = value.length > 10;

    // ตรวจสอบรูปแบบเฉพาะกรณีที่ความยาวเท่ากับ 10
    const phonePattern = /^(06|08|09)\d{8}$/;
    const isFormatInvalid = value.length === 10 && !phonePattern.test(value);

    // กำหนดสถานะ invalid
    const invalid = isTooShort || isTooLong || isFormatInvalid;
    setIsInvalidContactNum(invalid);
  };

  return (
    <>
      <Row>
        {/* ชื่อ-นามสกุล */}
        <Col className="mb-4" xs={12} sm={6} md={6} lg={6} xl={6}>
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
        <Col className="mb-4" xs={12} sm={6} md={6} lg={6} xl={6}>
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
        {/* ส่วนที่เพิ่มช่องเพิ่มไฟล์รูปสำเนาบัตรประชาชน */}
        {showSender && (
          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-4">
            <FileInput
              label="ภาพสำเนาบัตรประชาชน (รองรับ .png, .jpg)"
              onFileSelect={(file) => setSelectedFile(file)}
              accept=".jpg, .png"
              isInvalid={isInvalid && !selectedFile}
              alertText="กรุณาเลือกไฟล์ที่ต้องการปริ้น"
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default DeliveryUserInfo;
