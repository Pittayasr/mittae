import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import provinces from "../../data/provinces.json";
import subdistricts from "../../data/subdistricts.json";
import districts from "../../data/districts.json";

//deliveryAddress.tsx
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
  selectedProvinceName: string | null;
  selectedDistrictName: string | null;
  selectedSubDistrictName: string | null;
  postalCode: string;
  selectDeliveryType: string | null;
  isInvalid: boolean;
  setHouseNo: (value: string) => void;
  setSoi: (value: string) => void;
  setVillageNo: (value: string) => void;
  setDormitory: (value: string) => void;
  setPostalCode: (value: string) => void;
  setSelectedProvince: (value: string | null) => void;
  setSelectedSubDistrict: (value: string | null) => void;
  setSelectedDistrict: (value: string | null) => void;
  setSelectedDeliveryType: (value: string | null) => void;
  setSelectedProvinceName: (value: string | null) => void;
  setSelectedDistrictName: (value: string | null) => void;
  setSelectedSubDistrictName: (value: string | null) => void;
  showSender: boolean;
  setIsFormValid: (isValid: boolean) => void;
  onValidateAddress: (validations: {
    isInvalidHouseNo: boolean;
    isInvalidSoi: boolean;
    isInvalidVillageNo: boolean;
    isInvalidDormitory: boolean;
    isInvalidPostalCode: boolean;
  }) => void;
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
  selectDeliveryType,
  postalCode,
  setHouseNo,
  setSoi,
  setVillageNo,
  setDormitory,
  setSelectedProvince,
  setSelectedSubDistrict,
  setSelectedDistrict,
  setPostalCode,
  setSelectedDeliveryType,
  selectedProvinceName,
  selectedDistrictName,
  selectedSubDistrictName,
  setSelectedProvinceName,
  setSelectedDistrictName,
  setSelectedSubDistrictName,
  showSender,
  setIsFormValid,
  onValidateAddress,
}) => {
  // State สำหรับตัวเลือก Address
  const [provinceList] = useState(provinces);
  const [subDistrictList, setSubDistrictList] = useState<SubDistrict[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);

  const [isInvalidHouseNo, setInvalidHouseNo] = useState(false);
  const [isInvalidSoi, setInvalidSoi] = useState(false);
  const [isInvalidVillageNo, setInvalidVillageNo] = useState(false);
  const [isInvalidDormitory, setInvalidDormitory] = useState(false);
  const [isInvalidPostalCode, setInvalidPostalCode] = useState(false);

  // const [selectedProvinceName, setSelectedProvinceName] = useState<
  //   string | null
  // >(null);
  // const [selectedDistrictName, setSelectedDistrictName] = useState<
  //   string | null
  // >(null);
  // const [selectedSubDistrictName, setSelectedSubDistrictName] = useState<
  //   string | null
  // >(null);

  useEffect(() => {
    setDistrictList(districts); // แสดงอำเภอทั้งหมด
    setSubDistrictList(subdistricts); // แสดงตำบลทั้งหมด

    if (selectedProvince) {
      const filteredDistricts = districts.filter(
        (district) => district.provinceCode.toString() === selectedProvince
      );
      setDistrictList(filteredDistricts);

      if (selectedDistrict) {
        const filteredSubDistricts = subdistricts.filter(
          (subdistrict) =>
            subdistrict.districtCode.toString() === selectedDistrict
        );
        setSubDistrictList(filteredSubDistricts);
      } else {
        setSubDistrictList([]);
      }
    }

    // ตรวจสอบเงื่อนไขการกรอกข้อมูล
    const validations = {
      isInvalidHouseNo,
      isInvalidSoi,
      isInvalidVillageNo,
      isInvalidDormitory,
      isInvalidPostalCode,
    };

    const isValid = !Object.values(validations).includes(true);

    // ส่งค่ากลับไปยัง Delivery.tsx
    onValidateAddress(validations);

    // ส่งสถานะความถูกต้องกลับไปยัง Delivery.tsx
    setIsFormValid(isValid);
  }, [
    selectedProvince,
    selectedProvinceName,
    selectedDistrict,
    selectedDistrictName,
    selectedSubDistrict,
    selectedSubDistrictName,
    isInvalidHouseNo,
    isInvalidSoi,
    isInvalidVillageNo,
    isInvalidDormitory,
    isInvalidPostalCode,
    setIsFormValid,
    onValidateAddress,
  ]);

  const handleProvinceChange = (value: string) => {
    const selectedProvinceObj = provinces.find(
      (province) => province.provinceCode.toString() === value
    );

    if (selectedProvinceObj) {
      setSelectedProvince(value); // เก็บ provinceCode
      setSelectedProvinceName(selectedProvinceObj.provinceNameTh); // เก็บชื่อจังหวัด
    } else {
      setSelectedProvince(null);
      setSelectedProvinceName(null);
    }

    const filteredDistricts = districts.filter(
      (district) => district.provinceCode.toString() === value
    );
    setDistrictList(filteredDistricts);

    setSelectedDistrict(null);
    setSelectedDistrictName(null);
    setSelectedSubDistrict(null);
    setSelectedSubDistrictName(null);
    setPostalCode("");
  };

  const handleDistrictChange = (value: string | null) => {
    const selectedDistrictObj = districts.find(
      (district) => district.districtCode.toString() === value
    );

    if (selectedDistrictObj) {
      setSelectedDistrict(value); // เก็บ districtCode
      setSelectedDistrictName(selectedDistrictObj.districtNameTh); // เก็บชื่ออำเภอ
    } else {
      setSelectedDistrict(null);
      setSelectedDistrictName(null);
    }

    setSelectedSubDistrict(null);
    setSelectedSubDistrictName(null);
    setPostalCode("");

    const filteredSubDistricts = subdistricts.filter(
      (subdistrict) => subdistrict.districtCode.toString() === value
    );
    setSubDistrictList(filteredSubDistricts);
  };

  const handleSubDistrictChange = (value: string) => {
    const selectedSubDistrictObj = subdistricts.find(
      (subdistrict) => subdistrict.subdistrictCode.toString() === value
    );

    if (selectedSubDistrictObj) {
      setSelectedSubDistrict(value); // เก็บ subdistrictCode
      setSelectedSubDistrictName(selectedSubDistrictObj.subdistrictNameTh); // เก็บชื่อตำบล
      setPostalCode(selectedSubDistrictObj.postalCode.toString());
    } else {
      setSelectedSubDistrict(null);
      setSelectedSubDistrictName(null);
      setPostalCode("");
    }
  };

  const dormitoryPattern = /^(?![่-๋])[เ-ไก-ฮ-A-Za-z0-9]{1}[ก-ฮะ-์A-Za-z0-9\s\-/]*$/;
  const soiPattern = /^[เ-ไก-ฮa-zA-Z0-9\s\-/]+$/; // สามารถใช้แบบนี้ได้
  const houseNoPattern = /^[เ-ไก-ฮa-zA-Z0-9\-/]+$/; // สามารถใช้แบบนี้ได้เช่นกัน
  const villageNoPattern = /^\d{1,10}$/;
  const PostalCode = /^\d{5,5}$/;
  // const namePattern = /^(?![่-๋])[เ-ไก-ฮ]{1}[ก-ฮะ-์A-Za-z\s]*$/;

  // ฟังก์ชั่นสำหรับ handle การกรอกข้อมูลและการ validation
  const handleTextInputChange = (value: string, field: string) => {
    // const invalidText = value.length > 0 && !namePattern.test(value);
    const invalidDormitory = value.length > 0 && !dormitoryPattern.test(value);
    const invalidSoi = value.length > 0 && !soiPattern.test(value);
    const invalidHouseNo = value.length > 0 && !houseNoPattern.test(value);
    const isInvalidVillageNo =
      value.length > 0 && !villageNoPattern.test(value);
    const invalidPostalCode = value.length > 0 && !PostalCode.test(value);

    switch (field) {
      case "houseNo":
        setHouseNo(value);
        setInvalidHouseNo(invalidHouseNo);
        break;
      case "soi":
        setSoi(value);
        setInvalidSoi(invalidSoi);
        break;
      case "villageNo":
        setVillageNo(value);
        setInvalidVillageNo(isInvalidVillageNo);
        break;
      case "dormitory":
        setDormitory(value);
        setInvalidDormitory(invalidDormitory);
        break;
      case "postalCode":
        setPostalCode(value);
        setInvalidPostalCode(invalidPostalCode);
        break;
      default:
        break;
    }

    // ตรวจสอบสถานะฟอร์มที่ครบถ้วนว่าถูกต้องหรือไม่
    // setIsFormValid(
    //   houseNo !== "" &&
    //     soi !== "" &&
    //     villageNo !== "" &&
    //     dormitory !== "" &&
    //     selectedSubDistrict !== null &&
    //     selectedDistrict !== null &&
    //     postalCode !== "" &&
    //     selectedProvince !== null
    // );
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
          alertText="กรุณากรอกชื่อหอพักให้ถูกต้อง"
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
          alertText="กรุณากรอกซอยให้ถูกต้อง"
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
          alertText="กรุณากรอกบ้านเลขที่ให้ถูกต้อง"
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
          alertText="กรุณากรอกหมู่ที่ให้ถูกต้อง"
        />
      </Col>

      <Col className="address-Input mb-4" md={4} xs={6}>
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
      <Col className="address-Input mb-4" md={4} xs={6}>
        <TextSelect
          value={selectedDistrict || ""}
          label="อำเภอ (เขต)"
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
          label="ตำบล (แขวง)"
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
          alertText="กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง"
        />
      </Col>

      {!showSender && (
        <Col className="register-and-contract-number mb-4" md={4} xs={12}>
          <TextSelect
            value={selectDeliveryType || ""}
            label="ประเภทของที่ส่ง"
            id="DeliveryType"
            options={[
              { label: "ส่งของปกติ", value: "ส่งของปกติ" },
              { label: "ส่งรถกลับบ้าน", value: "ส่งรถกลับบ้าน" },
            ]}
            placeholder="เลือกประเภทของที่ส่ง"
            onChange={(value) => {
              if (value !== null) setSelectedDeliveryType(value);
            }}
            required
            isInvalid={isInvalid}
            alertText="กรุณาเลือกอำเภอ"
          />
        </Col>
      )}
    </Row>
  );
};

export default DeliveryAddress;
