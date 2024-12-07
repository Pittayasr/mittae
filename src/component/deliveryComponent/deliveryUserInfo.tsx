import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";

interface DeliveryUserInfoProps {
  isInvalid: boolean;
  username: string;
  setUsername: (value: string) => void;
  contactNum: string;
  setContactNum: (value: string) => void;
  setIsFormValid: (isValid: boolean) => void;
  onValidateUserInfo: (validations: {
    isInvalidUsername: boolean;
    isInvalidContactNum: boolean;
  }) => void;
}

const DeliveryUserInfo: React.FC<DeliveryUserInfoProps> = ({
  username,
  setUsername,
  contactNum,
  setContactNum,
  setIsFormValid,
  onValidateUserInfo,
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
  }, [isInvalidUsername, isInvalidContactNum, onValidateUserInfo, setIsFormValid]);

  const handleUsernameChange = (value: string) => {
    const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;
    const invalid = !namePattern.test(value);

    setUsername(value);
    setInvalidName(invalid);
  };

  const handleContactNumChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setContactNum(value);
    }

    const isTooShort = value.length > 0 && value.length < 10;
    const isTooLong = value.length > 10;

    const phonePattern = /^(06|08|09)\d{8}$/;
    const isFormatInvalid = value.length === 10 && !phonePattern.test(value);

    const invalid = isTooShort || isTooLong || isFormatInvalid;
    setIsInvalidContactNum(invalid);
  };

  return (
    <Row>
      <Col className="mb-4" xs={12} sm={6}>
        <TextInput
          id="username"
          label="ชื่อ-นามสกุล"
          value={username}
          placeholder="ชื่อ นามสกุล"
          onChange={(e) => handleUsernameChange(e.target.value)}
          isInvalid={isInvalidUsername }
          alertText="กรุณากรอกชื่อให้ถูกต้อง"
          required
        />
      </Col>
      <Col className="mb-4" xs={12} sm={6}>
        <TextInput
          id="contactNum"
          label="เบอร์โทรศัพท์"
          value={contactNum}
          placeholder="หมายเลขโทรศัพท์ 10 หลัก"
          onChange={(e) => handleContactNumChange(e.target.value)}
          isInvalid={isInvalidContactNum }
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
    </Row>
  );
};

export default DeliveryUserInfo;
