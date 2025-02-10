// UserInfo.tsx
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import provinces from "../../data/provinces.json";

interface UserInfoProps {
  usernameData: string;
  setUsernameData: (value: string) => void;
  selectedProvince: string | null;
  setSelectedProvince: (value: string | null) => void;
  selectedProvinceName: string | null;
  setSelectedProvinceName: (value: string | null) => void;
  selectedCarType: string | null;
  setSelectedCarType: (value: string | null) => void;
  selectedFuelType: string | null;
  setSelectedFuelType: (value: string | null) => void;
  selectedCarSeat: string | null;
  setSelectedCarSeat: (value: string | null) => void;
  isInvalid: boolean;
  setIsFormValid: (isValid: boolean) => void;
  onValidateUserInfo: (validations: { isInvalidName: boolean }) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  isInvalid,
  usernameData,
  setUsernameData,
  selectedProvince,
  setSelectedProvince,
  setSelectedProvinceName,
  selectedCarType,
  setSelectedCarType,
  selectedFuelType,
  setSelectedFuelType,
  selectedCarSeat,
  setSelectedCarSeat,
  onValidateUserInfo,
  // setIsFormValid,
}) => {
  const [isInvalidName, setInvalidName] = useState(false);
  const [provinceList] = useState(provinces);

  const responsiveCarType = ["รถแทรกเตอร์(การเกษตร)", "รถพ่วง", null].includes(
    selectedCarType as string
  );

  const responsiveMotorcycle = ["รถจักรยานยนต์"].includes(
    selectedCarType as string
  );

  const handleNameChange = (value: string) => {
    const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;
    const invalid = value.length > 0 && !namePattern.test(value);

    setUsernameData(value);
    setInvalidName(invalid);
  };

  useEffect(() => {
    const validations = {
      isInvalidName,
    };

    onValidateUserInfo(validations);
  }, [isInvalidName, onValidateUserInfo]);

  const handleProvinceChange = (value: string) => {
    const selectedProvinceObj = provinces.find(
      (province) => province.provinceCode.toString() === value
    );

    if (selectedProvinceObj) {
      setSelectedProvince(value); // เก็บ provinceCode
      setSelectedProvinceName(selectedProvinceObj.provinceNameTh); // เก็บชื่อจังหวัด
    }
  };

  return (
    <Row className="mt-3">
      {/* ชื่อเจ้าของรถ */}
      <Col className="mb-4" xl={6} lg={6} sm={6} md={6} xs={12}>
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
      <Col className="mb-4" xl={6} lg={6} sm={6} md={6} xs={12}>
        <TextSelect
          value={selectedProvince || ""}
          label="จังหวัด"
          id="province"
          options={provinceList.map((p) => ({
            value: p.provinceCode.toString(),
            label: p.provinceNameTh,
          }))}
          placeholder="ค้นหา..."
          onChange={(value) => {
            if (value !== null) handleProvinceChange(value);
          }}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกจังหวัด"
        />
      </Col>

      {/* ประเภทรถ */}
      <Col
        className="mb-4"
        xl={4}
        sm={responsiveCarType || responsiveMotorcycle ? 6 : 4}
        md={responsiveCarType || responsiveMotorcycle ? 6 : 4}
        xs={12}
      >
        <TextSelect
          value={selectedCarType || ""}
          label="ประเภทรถ"
          id="carType"
          options={[
            { label: "รถยนต์", value: "รถยนต์" },
            { label: "รถจักรยานยนต์", value: "รถจักรยานยนต์" },
            { label: "รถกระบะ", value: "รถกระบะ" },
            // { label: "รถตู้", value: "รถตู้" },
            // { label: "รถบรรทุกส่วนบุคคล", value: "รถบรรทุกส่วนบุคคล" },
            // {
            //   label: "รถบรรทุกเฉพาะทาง (น้ำมัน, เครน)",
            //   value: "รถบรรทุกเฉพาะทาง (น้ำมัน, เครน)",
            // },
            // { label: "รถพ่วงทั่วไป", value: "รถพ่วงทั่วไป" },
            // { label: "รถแทรกเตอร์", value: "รถแทรกเตอร์" },
          ]}
          placeholder="เลือกประเภทรถ"
          onChange={(value) => {
            if (value !== null) setSelectedCarType(value);
          }}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกประเภทรถ"
        />
      </Col>

      {/* ประเภทเชื้อเพลิง */}
      {selectedCarType && !["รถพ่วง"].includes(selectedCarType as string) && (
        <Col
          className="mb-4"
          xl={4}
          sm={responsiveMotorcycle ? 6 : 4}
          md={responsiveMotorcycle ? 6 : 4}
          xs={12}
        >
          <TextSelect
            value={selectedFuelType || ""}
            label={
              selectedCarType === "รถแทรกเตอร์"
                ? "ประเภทรถแทรกเตอร์"
                : "ประเภทเชื้อเพลิง"
            }
            id="fuelType"
            options={
              selectedCarType === "รถแทรกเตอร์"
                ? [
                    { label: "ใช้งานทั่วไป", value: "มิใช่การเกษตร" },
                    { label: "สำหรับการเกษตร", value: "สำหรับการเกษตร" },
                  ]
                : [
                    { label: "เบนซิน", value: "เบนซิน" },
                    { label: "ดีเซล", value: "ดีเซล" },
                    { label: "ไฟฟ้า", value: "ไฟฟ้า" },
                    ...(selectedCarType !== "รถจักรยานยนต์"
                      ? [
                          { label: "ไฮบริด", value: "ไฮบริด" },
                          { label: "แก๊ส", value: "แก๊ส" },
                        ]
                      : []),
                  ]
            }
            placeholder="เลือก..."
            onChange={(value) => setSelectedFuelType(value)}
            required
            isInvalid={isInvalid}
            alertText="กรุณาเลือกประเภทเชื้อเพลิง"
          />
        </Col>
      )}

      {/* จำนวนที่นั่ง */}
      {selectedCarType &&
        !["รถแทรกเตอร์", "รถพ่วง", "รถจักรยานยนต์"].includes(
          selectedCarType as string
        ) && (
          <Col className="mb-4" sm={4} md={4} xs={12}>
            <TextSelect
              value={selectedCarSeat || ""}
              label="จำนวนที่นั่ง"
              id="carSeat"
              options={[
                { label: "ไม่เกิน 7 ที่นั่ง", value: "ไม่เกิน 7 ที่นั่ง" },
                { label: "เกิน 7 ที่นั่ง", value: "เกิน 7 ที่นั่ง" },
              ]}
              placeholder="เลือกจำนวนที่นั่ง"
              onChange={(value) => setSelectedCarSeat(value)}
              required
              isInvalid={isInvalid}
              alertText="กรุณาเลือกจำนวนที่นั่ง"
            />
          </Col>
        )}
    </Row>
  );
};

export default UserInfo;
