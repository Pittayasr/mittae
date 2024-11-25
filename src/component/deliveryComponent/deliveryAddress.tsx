import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import provinces from "../../data/provinces.json";
import subdistricts from "../../data/subdistricts.json";
import districts from "../../data/districts.json";

type District = {
  id: number;
  provinceCode: number;
  districtCode: number;
  districtNameEn: string;
  districtNameTh: string;
  postalCode: number;
};

type SubDistrict = {
  id: number;
  provinceCode: number;
  districtCode: number;
  subdistrictCode: number;
  subdistrictNameEn: string;
  subdistrictNameTh: string;
  postalCode: number;
};

interface DeliveryAddressProps {
  houseNo: string;
  soi: string;
  villageNo: string;
  dormitory: string;
  selectedProvince: string | null;
  selectedDistrict: string | null;
  selectedSubDistrict: string | null;
  postalCode: string;
  isInvalid: boolean;
  setHouseNo: (value: string) => void;
  setSoi: (value: string) => void;
  setVillageNo: (value: string) => void;
  setDormitory: (value: string) => void;
  setPostalCode: (value: string ) => void;
  setSelectedProvince: (value: string | null) => void;
  setSelectedSubDistrict: (value: string | null) => void;
  setSelectedDistrict: (value: string | null) => void;
  setIsFormValid: (isValid: boolean) => void;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  isInvalid,
  houseNo,
  soi,
  villageNo,
  dormitory,
  selectedProvince,
  selectedSubDistrict,
  selectedDistrict,
  postalCode,
  setHouseNo,
  setSoi,
  setVillageNo,
  setDormitory,
  setSelectedProvince,
  setSelectedSubDistrict,
  setSelectedDistrict,
  setPostalCode,
  setIsFormValid,
}) => {
  // State สำหรับตัวเลือก Address
  const [provinceList] = useState(provinces);
  const [subDistrictList, setSubDistrictList] = useState<SubDistrict[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);

  // ค่า Province, Amphure, District ที่เลือก
  // const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  // const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  // const [selectedSubDistrict, setSelectedSubDistrict] = useState<string | null>(
  //   null
  // );

  const [isInvalidHouseNo, setInvalidHouseNo] = useState(false);
  const [isInvalidSoi, setInvalidSoi] = useState(false);
  const [isInvalidVillageNo, setInvalidVillageNo] = useState(false);
  const [isInvalidDormitory, setInvalidDormitory] = useState(false);
  const [isInvalidPostalCode, setInvalidPostalCode] = useState(false);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);

    // ถ้าเลือกจังหวัดแล้ว จะกรองอำเภอตาม provinceCode
    const filteredDistricts = districts.filter(
      (district) => district.provinceCode.toString() === value
    );
    setDistrictList(filteredDistricts);

    // ถ้ายังไม่ได้เลือกอำเภอ ให้แสดงตำบลทั้งหมด
    if (selectedDistrict) {
      const filteredSubDistricts = subdistricts.filter(
        (subdistrict) =>
          subdistrict.districtCode.toString() === selectedDistrict
      );
      setSubDistrictList(filteredSubDistricts);
    } else {
      setSubDistrictList(subdistricts); // แสดงทั้งหมดหากยังไม่เลือกอำเภอ
    }

    // ถ้าไม่เลือกจังหวัด ค่าต่าง ๆ จะยังคงเดิม
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setPostalCode("");
  };

  const handleDistrictChange = (value: string | null) => {
    setSelectedDistrict(value);
    setSelectedSubDistrict(null);
    setPostalCode("");

    // กรองตำบลตาม districtCode
    const filteredSubDistricts = subdistricts.filter(
      (subdistrict) => subdistrict.districtCode.toString() === value
    );
    setSubDistrictList(filteredSubDistricts);
  };

  const handleSubDistrictChange = (value: string) => {
    setSelectedSubDistrict(value);

    // หาและตั้งค่ารหัสไปรษณีย์
    const selectedSub = subdistricts.find(
      (subdistrict) => subdistrict.subdistrictCode.toString() === value
    );
    if (selectedSub) {
      setPostalCode(selectedSub.postalCode.toString());
    } else {
      setPostalCode("");
    }
  };

  const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;

  // ฟังก์ชั่นสำหรับ handle การกรอกข้อมูลและการ validation
  const handleTextInputChange = (value: string, field: string) => {
    const invalidText = value.length > 0 && !namePattern.test(value);
    const invalidNum = value.length > 0 && isNaN(Number(value));
    switch (field) {
      case "houseNo":
        setHouseNo(value);
        setInvalidHouseNo(invalidNum);
        break;
      case "soi":
        setSoi(value);
        setInvalidSoi(invalidText);
        break;
      case "villageNo":
        setVillageNo(value);
        setInvalidVillageNo(invalidNum);
        break;
      case "dormitory":
        setDormitory(value);
        setInvalidDormitory(invalidText);
        break;
      case "postalCode":
        setPostalCode(value);
        setInvalidPostalCode(invalidNum);
        break;
      default:
        break;
    }

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    setIsFormValid(
      houseNo !== "" &&
        soi !== "" &&
        villageNo !== "" &&
        dormitory !== "" &&
        selectedSubDistrict !== null &&
        selectedDistrict !== null &&
        postalCode !== "" &&
        selectedProvince !== null
    );
  };
  return (
    <Row>
      <Col className="mb-4" md={4} xs={12}>
        <TextInput
          label="หอพัก"
          id="Dormitory"
          value={dormitory}
          placeholder="กรอกชื่อหอพัก"
          onChange={(e) => handleTextInputChange(e.target.value, "dormitory")}
          required
          isInvalid={isInvalid || isInvalidDormitory}
          alertText="กรุณากรอกชื่อหอพัก"
        />
      </Col>
      <Col className="mb-4" md={4} xs={12}>
        <TextInput
          label="ซอย"
          id="Soi"
          value={soi}
          placeholder="กรอกซอย"
          onChange={(e) => handleTextInputChange(e.target.value, "soi")}
          required
          isInvalid={isInvalid || isInvalidSoi}
          alertText="กรุณากรอกซอย"
        />
      </Col>
      <Col className="mb-4" md={4} xs={6}>
        <TextInput
          label="บ้านเลขที่"
          id="HouseNo"
          value={houseNo}
          placeholder="กรอกบ้านเลขที่"
          onChange={(e) => handleTextInputChange(e.target.value, "houseNo")}
          required
          isInvalid={isInvalid || isInvalidHouseNo}
          alertText="กรุณากรอกบ้านเลขที่"
        />
      </Col>

      <Col className="mb-4" md={4} xs={6}>
        <TextInput
          label="หมู่ที่"
          id="VillageNo"
          value={villageNo}
          placeholder="กรอกหมู่ที่"
          onChange={(e) => handleTextInputChange(e.target.value, "villageNo")}
          required
          isInvalid={isInvalid || isInvalidVillageNo}
          alertText="กรุณากรอกหมู่ที่"
        />
      </Col>

      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedProvince || ""}
          label="จังหวัด"
          id="Province"
          options={provinceList.map((p) => ({
            value: p.provinceCode.toString(),
            label: p.provinceNameTh,
          }))}
          placeholder="ค้นหา..."
          onChange={(value) => {
            if (value !== null) handleProvinceChange(value);
            console.log("Selected:", value);
          }}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกจังหวัด"
        />
      </Col>
      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedDistrict || ""}
          label="อำเภอ(เขต)"
          id="District"
          options={districtList.map((d) => ({
            value: d.districtCode.toString(),
            label: d.districtNameTh,
          }))}
          placeholder="เลือกอำเภอ"
          onChange={(value) => {
            if (value !== null) handleDistrictChange(value);
            console.log("Selected:", value);
          }}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกอำเภอ"
        />
      </Col>
      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedSubDistrict || ""}
          label="ตำบล(แขวง)"
          id="SubDistrict"
          options={subDistrictList.map((s) => ({
            value: s.subdistrictCode.toString(),
            label: s.subdistrictNameTh,
          }))}
          placeholder="เลือกตำบล"
          onChange={(value) => {
            if (value !== null) handleSubDistrictChange(value);
            console.log("Selected:", value);
          }}
          required
          isInvalid={isInvalid}
          alertText="กรุณาเลือกตำบล"
        />
      </Col>

      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="รหัสไปรษณีย์"
          id="PostalCode"
          value={postalCode}
          placeholder="กรอกรหัสไปรษณีย์"
          onChange={(e) => handleTextInputChange(e.target.value, "postalCode")}
          required
          isInvalid={isInvalid || isInvalidPostalCode}
          alertText="กรุณากรอกรหัสไปรษณีย์"
        />
      </Col>
    </Row>
  );
};

export default DeliveryAddress;
