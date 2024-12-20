import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";

interface InsuranceUserInfoProps {
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  isInvalid: boolean;
  setIsInvalid: (value: boolean) => void;
}

const InsuranceUserInfo: React.FC<InsuranceUserInfoProps> = ({
  registrationNumber,
  setRegistrationNumber,
  contactNumber,
  setContactNumber,
  isInvalid,
  setIsInvalid,
}) => {
  const [isInvalidContact, setIsInvalidContact] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าเลขทะเบียนและหมายเลขโทรศัพท์กรอกถูกต้อง
    const invalid = !/^[ก-ฮ0-9]+$/.test(registrationNumber); // เงื่อนไขเลขทะเบียน
    const contactNumberInvalid = !/^(06|08|09)\d{8}$/.test(contactNumber); // หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก
    setIsInvalid(invalid);
    setIsInvalidContact(contactNumberInvalid);
  }, [registrationNumber, contactNumber, setIsInvalid]);

  return (
    <Row>
      {/* เลขทะเบียน */}
      <Col md={6} sm={6} xs={12} className="mb-3">
        <TextInput
          label="เลขทะเบียน"
          id="registrationNumber"
          placeholder="กรอกเลขทะเบียน"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          isInvalid={isInvalid && !/^[ก-ฮ0-9]+$/.test(registrationNumber)}
          required
          alertText="กรุณากรอกเลขทะเบียน (เฉพาะตัวอักษรไทยและตัวเลข)"
        />
      </Col>
      {/* หมายเลขโทรศัพท์ */}
      <Col md={6} sm={6} xs={12} className="mb-3">
        <TextInput
          label="หมายเลขโทรศัพท์"
          id="contactNumber"
          placeholder="กรอกหมายเลขโทรศัพท์"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          isInvalid={isInvalid && !/^(06|08|09)\d{8}$/.test(contactNumber)}
          required
          alertText={
            isInvalidContact
              ? contactNumber.length > 10
                ? "กรุณากรอกหมายเลขโทรศัพท์ 10 หลักและเริ่มด้วย 06, 08 หรือ 09"
                : "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
              : ""
          }
        />
      </Col>
    </Row>
  );
};

export default InsuranceUserInfo;
