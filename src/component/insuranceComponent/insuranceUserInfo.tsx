import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";

interface InsuranceUserInfoProps {
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  houseNumber: string;
  setHouseNumber: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  isInvalid: boolean;
  setIsInvalid: (value: boolean) => void;
  label: string;
  isShowRegistrationNumber: boolean;
  isShowHouseNumber: boolean;
}

const InsuranceUserInfo: React.FC<InsuranceUserInfoProps> = ({
  registrationNumber,
  setRegistrationNumber,
  contactNumber,
  setContactNumber,
  label,
  isShowRegistrationNumber,
  houseNumber,
  setHouseNumber,
  isShowHouseNumber,
}) => {
  const [hasTouchedRegistration, setHasTouchedRegistration] = useState(false);
  const [hasTouchedContact, setHasTouchedContact] = useState(false);
  const [hasTouchedHouseNumber, setHasTouchedHouseNumber] = useState(false);

  const validateRegistrationNumber = (value: string) =>
    /^[ก-ฮ0-9]+$/.test(value);

  const validateContactNumber = (value: string) =>
    /^(06|08|09)\d{8}$/.test(value);

  const validateHouseNumber = (value: string) =>
    /^[เ-ไก-ฮa-zA-Z0-9\-/]+$/.test(value);

  // useEffect(() => {
  //   // ตรวจสอบว่าเลขทะเบียนและหมายเลขโทรศัพท์กรอกถูกต้อง
  //   const invalid = !/^[ก-ฮ0-9]+$/.test(registrationNumber); // เงื่อนไขเลขทะเบียน
  //   const contactNumberInvalid = !/^(06|08|09)\d{8}$/.test(contactNumber); // หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก
  //   setIsInvalid(invalid);
  //   setIsInvalidContact(contactNumberInvalid);
  // }, [registrationNumber, contactNumber, setIsInvalid]);

  return (
    <Row>
      {isShowRegistrationNumber && (
        <Col md={4} sm={6} xs={12} className="mb-3">
          <TextInput
            label={label}
            id="registrationNumber"
            placeholder={"กรอก" + label}
            value={registrationNumber}
            onChange={(e) => {
              setRegistrationNumber(e.target.value);
              setHasTouchedRegistration(true); // ระบุว่าผู้ใช้เริ่มกรอกข้อมูล
            }}
            isInvalid={
              hasTouchedRegistration &&
              !validateRegistrationNumber(registrationNumber)
            }
            required
            alertText="กรุณากรอกเลขทะเบียน (เฉพาะตัวอักษรไทยและตัวเลข)"
          />
        </Col>
      )}

      {isShowHouseNumber && (
        <Col md={4} sm={6} xs={12} className="mb-3">
          <TextInput
            label="บ้านเลขที่"
            id="้houseNumber"
            placeholder="กรอกบ้านเลขที่"
            value={houseNumber}
            onChange={(e) => {
              setHouseNumber(e.target.value);
              setHasTouchedHouseNumber(true); // ระบุว่าผู้ใช้เริ่มกรอกข้อมูล
            }}
            isInvalid={
              hasTouchedHouseNumber && !validateHouseNumber(houseNumber)
            }
            required
            alertText="กรุณากรอกเลขทะเบียน (เฉพาะตัวอักษรไทยและตัวเลข)"
          />
        </Col>
      )}

      {/* หมายเลขโทรศัพท์ */}
      <Col md={4} sm={6} xs={12} className="mb-3">
        <TextInput
          label="หมายเลขโทรศัพท์"
          id="contactNumber"
          placeholder="กรอกหมายเลขโทรศัพท์"
          value={contactNumber}
          onChange={(e) => {
            setContactNumber(e.target.value);
            setHasTouchedContact(true); // ระบุว่าผู้ใช้เริ่มกรอกข้อมูล
          }}
          isInvalid={hasTouchedContact && !validateContactNumber(contactNumber)}
          required
          alertText={
            hasTouchedContact
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
