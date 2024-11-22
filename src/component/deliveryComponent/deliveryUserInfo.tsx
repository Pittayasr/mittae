//deliveryUserInfo.tsx
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";

interface UserInfo {
  username: string;
  idCard: string;
  contact: string;
}

interface DeliveryUserInfoProps {
  sender: UserInfo;
  receiver: UserInfo;
  setSender: (data: UserInfo) => void;
  setReceiver: (data: UserInfo) => void;
  setIsFormValid: (isValid: boolean) => void;
}

const DeliveryUserInfo: React.FC<DeliveryUserInfoProps> = ({
  sender,
  receiver,
  setSender,
  setReceiver,
  setIsFormValid,
}) => {
  const [isInvalidSender, setIsInvalidSender] = useState({
    username: false,
    idCard: false,
    contact: false,
  });
  const [isInvalidReceiver, setIsInvalidReceiver] = useState({
    username: false,
    idCard: false,
    contact: false,
  });

  const validateUserInfo = (
    user: UserInfo,
    invalid: typeof isInvalidSender
  ) => {
    const isFormValid =
      !invalid.username &&
      !invalid.idCard &&
      !invalid.contact &&
      !!user.username &&
      !!user.idCard &&
      !!user.contact;
    setIsFormValid(isFormValid);
  };

  const handleChange = (
    type: "sender" | "receiver",
    field: keyof UserInfo,
    value: string
  ) => {
    const setUser = type === "sender" ? setSender : setReceiver;
    const invalidState =
      type === "sender" ? isInvalidSender : isInvalidReceiver;
    const setInvalidState =
      type === "sender" ? setIsInvalidSender : setIsInvalidReceiver;

    const userInfo = type === "sender" ? sender : receiver;

    const updatedUser = { ...userInfo, [field]: value };
    setUser(updatedUser);

    // Validation logic
    let isInvalid = false;
    if (field === "username") {
      isInvalid = value.length > 0 && !/^[เ-ไก-ฮA-Za-z\s]+$/.test(value);
    } else if (field === "idCard") {
      const idPattern = /^\d{13}$/;
      isInvalid =
        value.length > 0 &&
        (!idPattern.test(value) ||
          (value.length === 13 && !isValidIdCard(value)));
    } else if (field === "contact") {
      const phonePattern = /^(06|08|09)\d{8}$/;
      isInvalid = value.length >= 10 && !phonePattern.test(value);
    }

    const updatedInvalid = { ...invalidState, [field]: isInvalid };
    setInvalidState(updatedInvalid);
    validateUserInfo(updatedUser, updatedInvalid);
  };

  const isValidIdCard = (id: string) => {
    const digits = id.split("").map(Number);
    const sum = digits
      .slice(0, 12)
      .reduce((acc, digit, idx) => acc + digit * (13 - idx), 0);
    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === digits[12];
  };

  return (
    <Row>
      {["sender", "receiver"].map((type) => (
        <React.Fragment key={type}>
          <Col md={6} xs={12}>
            <h5>{type === "sender" ? "ข้อมูลผู้ส่ง" : "ข้อมูลผู้รับ"}</h5>
            <TextInput
              id="userName"
              label="ชื่อ"
              value={type === "sender" ? sender.username : receiver.username}
              placeholder="กรอกชื่อ"
              onChange={(e) =>
                handleChange(
                  type as "sender" | "receiver",
                  "username",
                  e.target.value
                )
              }
              isInvalid={
                type === "sender"
                  ? isInvalidSender.username
                  : isInvalidReceiver.username
              }
              alertText="กรุณากรอกชื่อให้ถูกต้อง"
              required
            />
            <TextInput
              id="IDcard"
              label="หมายเลขบัตรประชาชน"
              value={type === "sender" ? sender.idCard : receiver.idCard}
              placeholder="กรอกเลขบัตรประชาชน"
              onChange={(e) =>
                handleChange(
                  type as "sender" | "receiver",
                  "idCard",
                  e.target.value
                )
              }
              isInvalid={
                type === "sender"
                  ? isInvalidSender.idCard
                  : isInvalidReceiver.idCard
              }
              alertText="หมายเลขบัตรประชาชนไม่ถูกต้อง"
              required
            />
            <TextInput
              id="contactNum"
              label="หมายเลขโทรศัพท์"
              value={type === "sender" ? sender.contact : receiver.contact}
              placeholder="กรอกหมายเลขโทรศัพท์"
              onChange={(e) =>
                handleChange(
                  type as "sender" | "receiver",
                  "contact",
                  e.target.value
                )
              }
              isInvalid={
                type === "sender"
                  ? isInvalidSender.contact
                  : isInvalidReceiver.contact
              }
              alertText="กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"
              required
            />
          </Col>
        </React.Fragment>
      ))}
    </Row>
  );
};

export default DeliveryUserInfo;
