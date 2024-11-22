//deliveryAddress.tsx
import React from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import { provinces } from "../../data/provinces";

interface AddressProps {
  isInvalid: boolean;
  houseNo: string;
  setHouseNo: (value: string) => void;
  soi: string;
  setSoi: (value: string) => void;
  villageNo: string;
  setVillageNo: (value: string) => void;
  dormitory: string;
  setDormitory: (value: string) => void;
  subDistrict: string;
  setSubDistrict: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  selectedProvince: string | null;
  setSelectedProvince: (value: string | null) => void;
}

interface DeliveryAddressProps {
  senderAddress: AddressProps;
  receiverAddress: AddressProps;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  senderAddress,
  receiverAddress,
}) => {
  const renderAddressFields = (address: AddressProps, title: string) => (
    <>
      <h5>{title}</h5>
      <Row className="mt-3">
        {/* บ้านเลขที่ */}
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label="บ้านเลขที่"
            id="houseNo"
            value={address.houseNo}
            placeholder="กรอกบ้านเลขที่"
            onChange={(e) => address.setHouseNo(e.target.value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณากรอกบ้านเลขที่"
          />
        </Col>

        {/* ซอย */}
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label="ซอย"
            id="soi"
            value={address.soi}
            placeholder="กรอกซอย"
            onChange={(e) => address.setSoi(e.target.value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณากรอกซอย"
          />
        </Col>

        {/* หมู่ที่ */}
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label="หมู่ที่"
            id="villageNo"
            value={address.villageNo}
            placeholder="กรอกหมู่ที่"
            onChange={(e) => address.setVillageNo(e.target.value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณากรอกหมู่ที่"
          />
        </Col>

        {/* ตำบล(แขวง) */}
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label="ตำบล(แขวง)"
            id="subDistrict"
            value={address.subDistrict}
            placeholder="กรอกตำบล(แขวง)"
            onChange={(e) => address.setSubDistrict(e.target.value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณากรอกตำบล(แขวง)"
          />
        </Col>

        {/* อำเภอ(เขต) */}
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label="อำเภอ(เขต)"
            id="district"
            value={address.district}
            placeholder="กรอกอำเภอ(เขต)"
            onChange={(e) => address.setDistrict(e.target.value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณากรอกอำเภอ(เขต)"
          />
        </Col>

        {/* จังหวัด */}
        <Col className="mb-4" md={4} xs={12}>
          <TextSelect
            value={address.selectedProvince || ""}
            label="จังหวัด"
            id="province"
            options={provinces}
            placeholder="ค้นหา..."
            onChange={(value) => address.setSelectedProvince(value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณาเลือกจังหวัด"
          />
        </Col>

        {/* รหัสไปรษณีย์ */}
        <Col className="mb-4" md={4} xs={12}>
          <TextInput
            label="รหัสไปรษณีย์"
            id="postalCode"
            value={address.postalCode}
            placeholder="กรอกรหัสไปรษณีย์"
            onChange={(e) => address.setPostalCode(e.target.value)}
            required
            isInvalid={address.isInvalid}
            alertText="กรุณากรอกรหัสไปรษณีย์"
          />
        </Col>
      </Row>
    </>
  );

  return (
    <div>
      {renderAddressFields(senderAddress, "ข้อมูลผู้ส่ง")}
      {renderAddressFields(receiverAddress, "ข้อมูลผู้รับ")}
    </div>
  );
};

export default DeliveryAddress;
