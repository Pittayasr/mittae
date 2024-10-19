// UserInfo.tsx
import React from "react";
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
}

const UserInfo: React.FC<UserInfoProps> = ({
  usernameData,
  setUsernameData,
  selectedProvince,
  setSelectedProvince,
  selectedCarType,
  setSelectedCarType,
}) => (
  <Row className="mt-3">
    <Col className="mb-4" md={4} xs={12}>
      <TextInput
        label="ชื่อเจ้าของรถ"
        id="userName"
        value={usernameData}
        onChange={(e) => setUsernameData(e.target.value)}
        required
      />
    </Col>
    <Col className="mb-4" md={4} xs={6}>
      <TextSelect
        value={selectedProvince || ""}
        label="จังหวัด"
        id="province"
        options={provinces}
        onChange={(value) => setSelectedProvince(value)}
        required
      />
    </Col>
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
          "รถแทรกเตอร์"
        ]}
        onChange={(value) => setSelectedCarType(value)}
        required
      />
    </Col>
  </Row>
);

export default UserInfo;
