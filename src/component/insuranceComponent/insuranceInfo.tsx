import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import TextSelect from "../textFillComponent/textSelect";


interface InsuranceInfoProps {
  insuranceType: string | null;
  setInsuranceType: (value: string | null) => void;
  insuranceCompany: string | null;
  setInsuranceCompany: (value: string | null) => void;
  insuranceCategory: string | null;
  setInsuranceCategory: (value: string | null) => void;
  isInvalid: boolean;
  setIsInvalid: (value: boolean) => void;
}

const InsuranceInfo: React.FC<InsuranceInfoProps> = ({
  insuranceType,
  setInsuranceType,
  insuranceCompany,
  setInsuranceCompany,
  insuranceCategory,
  setInsuranceCategory,
  // isInvalid,
  setIsInvalid,
}) => {
  useEffect(() => {
    // ตรวจสอบว่าแต่ละช่องกรอกข้อมูลครบถ้วน
    const invalid = !insuranceType || !insuranceCompany || !insuranceCategory;
    setIsInvalid(invalid);
  }, [insuranceType, insuranceCompany, insuranceCategory, setIsInvalid]);

  return (
    <Row className="mt-4">
      {/* ประเภทประกัน */}
      <Col xl={4} sm={6} lg={4} md={4} xs={12} className="mb-3">
        <TextSelect
          label="เลือกประเภทประกัน"
          id="insuranceType"
          options={[
            { label: "ประเภท 1", value: "ประเภท 1" },
            { label: "ประเภท 2", value: "ประเภท 2" },
            { label: "ประเภท 2+", value: "ประเภท 2+" },
            { label: "ประเภท 3+", value: "ประเภท 3+" },
            { label: "ประเภท 3", value: "ประเภท 3" },
            { label: "ประกันบ้าน หอพัก", value: "ประกันบ้าน หอพัก" },
            { label: "อุบัติเหตุ", value: "อุบัติเหตุ" },
          ]}
          value={insuranceType}
          onChange={setInsuranceType}
          placeholder="เลือกประเภทประกัน"
          // isInvalid={isInvalid && !insuranceType}
          required
          alertText="กรุณาเลือกประเภทประกัน"
        />
      </Col>

      {/* บริษัทประกัน */}
      <Col xl={4} sm={6} lg={4} md={4} xs={12} className="mb-3">
        <TextSelect
          label="เลือกบริษัทประกัน"
          id="insuranceCompany"
          options={[
            { label: "มิตรแท้ประกันภัย", value: "มิตรแท้ประกันภัย" },
            { label: "เทเวศ ประกันภัย", value: "เทเวศ ประกันภัย" },
            { label: "เออร์โกประกันภัย", value: "เออร์โกประกันภัย" },
            { label: "ทิพยประกันภัย", value: "ทิพยประกันภัย" },
          ]}
          value={insuranceCompany}
          onChange={setInsuranceCompany}
          placeholder="เลือกบริษัทประกัน"
          // isInvalid={isInvalid && !insuranceCompany}
          required
          alertText="กรุณาเลือกบริษัทประกัน"
        />
      </Col>

      {/* ประเภท */}
      <Col xl={4} lg={4} md={4} xs={12} className="mb-3">
        <TextSelect
          label="ประเภท"
          id="insuranceCategory"
          options={[
            { label: "รถยนต์", value: "รถยนต์" },
            { label: "รถจักรยานยนต์", value: "รถจักรยานยนต์" },
            { label: "หอพัก บ้าน", value: "หอพัก บ้าน" },
            {
              label: "ประกันภัยทางทะเลและขนส่ง",
              value: "ประกันภัยทางทะเลและขนส่ง",
            },
            { label: "ประกันภัยเบ็ดเตล็ด", value: "ประกันภัยเบ็ดเตล็ด" },
          ]}
          value={insuranceCategory}
          onChange={setInsuranceCategory}
          placeholder="เลือกประเภท"
          required
          alertText="กรุณาเลือกประเภท"
        />
      </Col>
    </Row>
  );
};

export default InsuranceInfo;
