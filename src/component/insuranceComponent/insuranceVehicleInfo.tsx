import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import FileInput from "../textFillComponent/fileInput";
import RadioButton from "../textFillComponent/radioButton";
import provinces from "../../data/provinces.json";

interface InsuranceVehicleInfoProps {
  vehicleType: string;
  selectedProvinceRegistered: string | null;
  setSelectedProvinceRegistered: (value: string | null) => void;
  selectedProvinceDriver: string | null;
  setSelectedProvinceDriver: (value: string | null) => void;
  selectedProvinceLocation: string | null;
  setSelectedProvinceLocation: (value: string | null) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  customGender: string;
  setCustomGender: (value: string) => void;
  maritalStatus: string;
  setMaritalStatus: (value: string) => void;
  occupation: string;
  setOccupation: (value: string) => void;
  licenseAge: string;
  setLicenseAge: (value: string) => void;
  vehicleBrand: string;
  setVehicleBrand: (value: string) => void;
  vehicleModel: string;
  setVehicleModel: (value: string) => void;
  engineSize: string;
  setEngineSize: (value: string) => void;
  vehicleYear: string;
  setVehicleYear: (value: string) => void;
  vehiclePurpose: string;
  setVehiclePurpose: (value: string) => void;
  hasDashCam: string;
  setHasDashCam: (value: string) => void;
  hasVoluntaryInsurance: string;
  setHasVoluntaryInsurance: (value: string) => void;
  propertyValue: string;
  setPropertyValue: (value: string) => void;
  registrationBookInsuranceCarFile: File | null;
  setRegistrationBookInsuranceCarFile: (value: File) => void;
  registrationBookInsuranceMotorcycleFile: File | null;
  setRegistrationBookInsuranceMotorcycleFile: (value: File) => void;
  titleDeedFile: File | null;
  setTitleDeedFile: (value: File) => void;
  voluntaryInsuranceCarFile: File | null;
  setVoluntaryInsuranceCarFile: (value: File) => void;
  voluntaryInsuranceMotorcycleFile: File | null;
  setVoluntaryInsuranceMotorcycleFile: (value: File) => void;
  voluntaryInsuranceHouseFile: File | null;
  setVoluntaryInsuranceHouseFile: (value: File) => void;
  noIDcardFile: File | null;
  setNoIDcardFile: (value: File) => void;
  isInvalid: boolean;
  // onValidateInsuranceVehicleInfo: (validations: { isInvalid: boolean }) => void;
}

const InsuranceVehicleInfo: React.FC<InsuranceVehicleInfoProps> = ({
  vehicleType,
  selectedProvinceRegistered,
  setSelectedProvinceRegistered,
  selectedProvinceDriver,
  setSelectedProvinceDriver,
  selectedProvinceLocation,
  setSelectedProvinceLocation,
  propertyType,
  setPropertyType,
  gender,
  setGender,
  customGender,
  setCustomGender,
  maritalStatus,
  setMaritalStatus,
  occupation,
  setOccupation,
  licenseAge,
  setLicenseAge,
  vehicleBrand,
  setVehicleBrand,
  vehicleModel,
  setVehicleModel,
  engineSize,
  setEngineSize,
  vehicleYear,
  setVehicleYear,
  vehiclePurpose,
  setVehiclePurpose,
  hasDashCam,
  setHasDashCam,
  hasVoluntaryInsurance,
  setHasVoluntaryInsurance,
  propertyValue,
  setPropertyValue,
  registrationBookInsuranceCarFile,
  setRegistrationBookInsuranceCarFile,
  registrationBookInsuranceMotorcycleFile,
  setRegistrationBookInsuranceMotorcycleFile,
  titleDeedFile,
  setTitleDeedFile,
  voluntaryInsuranceCarFile,
  setVoluntaryInsuranceCarFile,
  voluntaryInsuranceMotorcycleFile,
  setVoluntaryInsuranceMotorcycleFile,
  voluntaryInsuranceHouseFile,
  setVoluntaryInsuranceHouseFile,
  noIDcardFile,
  setNoIDcardFile,
  // isInvalid,
  // onValidateInsuranceVehicleInfo,
}) => {
  const [provinceList] = useState(provinces);

  const [hasTouchedBrand, setHasTouchedBrand] = useState(false);
  const [hasTouchedModel, setHasTouchedModel] = useState(false);
  const [hasTouchedEngineSize, setHasTouchedEngineSize] = useState(false);
  const [hasTouchedYear, setHasTouchedYear] = useState(false);
  const [hasTouchedOccupation, setHasTouchedOccupation] = useState(false);
  const [hasTouchedPropertyValue, setHasTouchedPropertyValue] = useState(false);
  const [hasTouchedCustomGender, setHasTouchedCustomGender] = useState(false);

  const validateEngineSize = (value: string) => /^\d+$/.test(value);
  const validateYear = (value: string) => /^\d{4}$/.test(value);
  const validateVehicleBrand = (value: string) =>
    /^(?![่-๋])[เ-ไก-ฮa-zA-Z0-9]{1}[\u0E01-\u0E4C\u0E4E-\u0E4F\u0E30-\u0E3Aเ-ไก-ฮa-zA-Z0-9\s\-/]*$/.test(
      value
    );
  const validateVehicleModel = (value: string) =>
    /^(?![่-๋])[เ-ไก-ฮa-zA-Z0-9]{1}[\u0E01-\u0E4C\u0E4E-\u0E4F\u0E30-\u0E3Aเ-ไก-ฮa-zA-Z0-9\s\-/]*$/.test(
      value
    );
  const validateOccupation = (value: string) =>
    /^(?![่-๋])[เ-ไก-ฮa-zA-Z0-9]{1}[\u0E01-\u0E4C\u0E4E-\u0E4F\u0E30-\u0E3Aเ-ไก-ฮa-zA-Z0-9\s\-/]*$/.test(
      value
    );
  const validateCustomGender = (value: string) =>
    /^(?![่-๋])[เ-ไก-ฮa-zA-Z0-9]{1}[\u0E01-\u0E4C\u0E4E-\u0E4F\u0E30-\u0E3Aเ-ไก-ฮa-zA-Z0-9\s\-/]*$/.test(
      value
    );

  const validatePropertyValue = (value: string) => /^\d+$/.test(value);

  // Validate fields

  //   const handleProvinceChange = (value: string) => {
  //     const selectedProvinceObj = provinces.find(
  //       (province) => province.provinceCode.toString() === value
  //     );
  //     if (selectedProvinceObj) {
  //       setSelectedProvince(value);
  //     }
  //   };

  return (
    <div className="insurance-vehicle-info">
      {/* <h4>ข้อมูลยานพาหนะ/ทรัพย์สินสำหรับประกันภัย</h4> */}

      {(vehicleType === "รถยนต์" || vehicleType === "รถจักรยานยนต์") && (
        <Row>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="ยี่ห้อรถ"
              id="vehicle-brand"
              value={vehicleBrand}
              placeholder="ระบุยี่ห้อรถ"
              onChange={(e) => {
                setVehicleBrand(e.target.value);
                setHasTouchedBrand(true);
              }}
              isInvalid={hasTouchedBrand && !validateVehicleBrand(vehicleBrand)}
              alertText="กรุณาระบุยี่ห้อรถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="รุ่นรถ"
              id="vehicle-model"
              value={vehicleModel}
              placeholder="ระบุรุ่นรถ"
              onChange={(e) => {
                setVehicleModel(e.target.value);
                setHasTouchedModel(true);
              }}
              isInvalid={hasTouchedModel && !validateVehicleModel(vehicleModel)}
              alertText="กรุณาระบุรุ่นรถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="ขนาดเครื่องยนต์ (CC)"
              id="engine-size"
              value={engineSize}
              placeholder="ระบุขนาดเครื่องยนต์"
              onChange={(e) => {
                setEngineSize(e.target.value);
                setHasTouchedEngineSize(true);
              }}
              isInvalid={
                hasTouchedEngineSize && !validateEngineSize(engineSize)
              }
              alertText="กรุณาระบุขนาดเครื่องยนต์เป็นตัวเลขเท่านั้น"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="ปีรถ (พ.ศ.)"
              id="vehicle-year"
              value={vehicleYear}
              placeholder="ตัวอย่าง: 2xxx"
              onChange={(e) => {
                setVehicleYear(e.target.value);
                setHasTouchedYear(true);
              }}
              isInvalid={hasTouchedYear && !validateYear(vehicleYear)}
              alertText="กรุณาระบุปีรถเป็นตัวเลข 4 หลัก (เช่น 2567)"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              value={selectedProvinceRegistered || ""}
              label="จังหวัดที่รถจดทะเบียน"
              id="vehicle-registration-province"
              options={provinceList.map((p) => ({
                value: p.provinceCode.toString(),
                label: p.provinceNameTh,
              }))}
              placeholder="ค้นหา..."
              onChange={(value) => setSelectedProvinceRegistered(value || null)}
              // isInvalid={isInvalid && !selectedProvinceRegistered}
              alertText="กรุณาเลือกจังหวัดที่จดทะเบียนรถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              value={vehiclePurpose}
              label="จุดประสงค์การใช้รถ"
              id="vehicle-purpose"
              options={[
                { label: "ใช้ส่วนบุคคล", value: "ใช้ส่วนบุคคล" },
                {
                  label: "ใช้ส่วนบุคคลและไปทำงาน",
                  value: "ใช้ส่วนบุคคลและไปทำงาน",
                },
                {
                  label: "ใช้ส่วนบุคคลและติดต่อธุรกิจ",
                  value: "ใช้ส่วนบุคคลและติดต่อธุรกิจ",
                },
              ]}
              placeholder="เลือกจุดประสงค์"
              onChange={(value) => {
                if (value !== null) setVehiclePurpose(value);
              }}
              // isInvalid={isInvalid && !vehiclePurpose}
              alertText="กรุณาระบุจุดประสงค์การใช้รถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={12} xs={12}>
            <TextSelect
              label={
                vehicleType === "รถยนต์"
                  ? "อายุใบขับขี่รถยนต์(ปี)"
                  : "อายุใบขับขี่รถจักรยานยนต์(ปี)"
              }
              id="licenseAge"
              options={[
                { value: "less_1", label: "น้อยกว่า 1 ปี" },
                { value: "1", label: "1 ปี" },
                { value: "2", label: "2 ปี" },
                { value: "3", label: "3 ปี" },
                { value: "4", label: "4 ปี" },
                { value: "5", label: "5 ปี" },
                { value: "more_5", label: "มากกว่า 5 ปี" },
              ]}
              placeholder="เลือก..."
              value={licenseAge}
              onChange={(value) => setLicenseAge(value || "")}
              // isInvalid={isInvalid && !licenseAge}
              alertText="กรุณาเลือกอายุใบขับขี่"
            />
          </Col>
          {vehicleType === "รถยนต์" && (
            <Col className="mb-3" md={4} sm={12} xs={12}>
              <RadioButton
                name="dashCam"
                label="คุณมีกล้องติดรถยนต์หรือไม่?"
                options={["มี", "ไม่มี"]}
                selectedValue={hasDashCam}
                onChange={(value) => setHasDashCam(value)}
                // isInvalid={isInvalid && !hasDashCam}
                alertText="กรุณาระบุข้อมูล"
              />
            </Col>
          )}
        </Row>
      )}

      {vehicleType === "รถยนต์" && (
        <Row>
          <Col className="mb-3" xs={12}>
            <p className="mb-1">ผู้ขับขี่หลัก **</p>
          </Col>
          <Col className="mb-3 " md={4} xs={12}>
            <RadioButton
              name="gender"
              label="เพศ"
              options={["ชาย", "หญิง", "อื่นๆ"]}
              selectedValue={gender}
              onChange={setGender}
              // isInvalid={isInvalid && !gender}
              alertText="กรุณาเลือกเพศ"
            />
          </Col>
          {gender === "อื่นๆ" && (
            <Col className="mb-3 " md={4} xs={12}>
              <TextInput
                label="โปรดระบุ"
                id="gender-other"
                value={customGender}
                placeholder="ระบุเพศของคุณ"
                onChange={(e) => {
                  setCustomGender(e.target.value);
                  setHasTouchedCustomGender(true);
                }}
                isInvalid={
                  hasTouchedCustomGender && !validateCustomGender(occupation)
                }
                alertText="กรุณาเลือกเพศ"
              />
            </Col>
          )}
          <Col className="mb-3" md={4} sm={12} xs={12}>
            <TextSelect
              value={selectedProvinceDriver || ""}
              label="จังหวัดที่อยู่ของผู้ขับขี่หลัก"
              id="driver-province"
              options={provinceList.map((p) => ({
                value: p.provinceNameTh,
                label: p.provinceNameTh,
              }))}
              placeholder="ค้นหา..."
              onChange={(value) => {
                setSelectedProvinceDriver(value || ""); // จัดการค่า null เป็น ""
              }}
              // isInvalid={isInvalid && !selectedProvinceDriver}
              alertText="กรุณาเลือกจังหวัด"
            />
          </Col>
          <Col md={4} sm={6} xs={12} className="mb-3">
            <TextSelect
              label="สถานะสมรส"
              id="maritalStatus"
              options={[
                { label: "โสด", value: "โสด" },
                { label: "สมรส(จดทะเบียน)", value: "สมรส(จดทะเบียน)" },
                { label: "สมรส(ไม่จดทะเบียน)", value: "สมรส(ไม่จดทะเบียน)" },
                { label: "หย่าร้าง", value: "หย่าร้าง" },
                { label: "หม้าย ", value: "หม้าย " },
                { label: "แยกกันอยู่", value: "แยกกันอยู่" },
              ]}
              value={maritalStatus}
              onChange={(value) => {
                setMaritalStatus(value || "");
              }}
              placeholder="เลือกสถานะสมรส"
              // isInvalid={isInvalid && !maritalStatus}
              required
              alertText="กรุณาเลือกสถานะสมรส"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="อาชีพ"
              id="occupation"
              value={occupation}
              placeholder="ระบุอาชีพ เช่น พนักงานบริษัท"
              onChange={(e) => {
                setOccupation(e.target.value);
                setHasTouchedOccupation(true);
              }}
              isInvalid={
                hasTouchedOccupation && !validateOccupation(occupation)
              }
              alertText="กรุณาระบุอาชีพ"
            />
          </Col>
        </Row>
      )}

      {vehicleType === "หอพัก บ้าน" && (
        <Row>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              label="ประเภทของทรัพย์สินที่ประกัน"
              id="propertyType"
              options={[
                { value: "บ้านเดี่ยว", label: "บ้านเดี่ยว" },
                { value: "บ้านแฝด", label: "บ้านแฝด" },
                { value: "ทาวน์โฮม", label: "ทาวน์โฮม" },
                { value: "บ้านสวน", label: "บ้านสวน" },
                { value: "บ้านพักตากอากาศ", label: "บ้านพักตากอากาศ" },
                { value: "บ้านชั้นเดียว", label: "บ้านชั้นเดียว" },
                { value: "บ้านสองชั้น", label: "บ้านสองชั้น" },
                { value: "อพาร์ทเมนต์", label: "อพาร์ทเมนต์" },
                { value: "หอพักนักศึกษา", label: "หอพักนักศึกษา" },
                { value: "แมนชั่น", label: "แมนชั่น" },
                { value: "เซอร์วิสอพาร์ทเมนต์", label: "เซอร์วิสอพาร์ทเมนต์" },
                { value: "คอนโดมิเนียม", label: "คอนโดมิเนียม" },
                { value: "แฟลต", label: "แฟลต" },
                { value: "โฮสเทล", label: "โฮสเทล" },
                { value: "โฮมสเตย์", label: "โฮมสเตย์" },
              ]}
              placeholder="เลือก..."
              value={propertyType}
              onChange={(value) => setPropertyType(value || "")}
              // isInvalid={isInvalid && !propertyType}
              alertText="กรุณาเลือกประเภททรัพย์สิน"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              value={selectedProvinceLocation || ""}
              label="จังหวัดที่ตั้ง"
              id="propertyProvince"
              placeholder="เลือก..."
              options={provinceList.map((p) => ({
                value: p.provinceNameTh,
                label: p.provinceNameTh,
              }))}
              onChange={(value) => {
                setSelectedProvinceLocation(value || "");
              }}
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="มูลค่าของทรัพย์สิน"
              id="propertyValue"
              value={propertyValue}
              placeholder="ระบุมูลค่าของทรัพย์สิน"
              onChange={(e) => {
                setPropertyValue(e.target.value);
                setHasTouchedPropertyValue(true);
              }}
              isInvalid={
                hasTouchedPropertyValue && !validatePropertyValue(propertyValue)
              }
              alertText="กรุณระบุมูลค่าทรัพย์สินเป็นตัวเลขเท่านั้น"
            />
          </Col>
        </Row>
      )}

      {["รถยนต์", "รถจักรยานยนต์", "หอพัก บ้าน"].includes(vehicleType) && (
        <Row>
          <Col md={10} xs={12}>
            <RadioButton
              name="voluntaryInsurance"
              label="มีประกันภัยภาคสมัครใจหรือไม่? *หากมีโปรดระบุและส่งภาพถ่ายสำเนากรมธรรม์ประกันภัยเดิมเพิ่มเป็นส่วนลด
              %"
              options={["เคยทำ", "ยังไม่เคยทำ", "ยังมีประกันภัยภาคสมัครใจ"]}
              selectedValue={hasVoluntaryInsurance}
              onChange={setHasVoluntaryInsurance}
              // isInvalid={isInvalid && !hasVoluntaryInsurance}
              alertText="กรุณาเลือกข้อมูล"
            />
            {/* <p className="my-3">
              *หากมีโปรดระบุและส่งภาพถ่ายสำเนากรมธรรม์ประกันภัยเดิมเพิ่มเป็นส่วนลด
              %
            </p> */}
          </Col>
          {/* ส่วนการอัปโหลดไฟล์สำหรับรถยนต์และรถจักรยานยนต์ */}
          {vehicleType === "รถยนต์" && (
            <>
              <Col sm={6} xs={12} className="mb-3">
                <FileInput
                  label="เล่มทะเบียนรถ (รองรับ .png, .jpg)"
                  onFileSelect={(file) => {
                    if (file) setRegistrationBookInsuranceCarFile(file);
                  }}
                  accept=".jpg, .png"
                  // isInvalid={isInvalid && !registrationBookInsuranceCarFile}
                  alertText="กรุณาอัปโหลดสำเนาหน้าเล่มทะเบียน"
                  initialFile={registrationBookInsuranceCarFile}
                />
              </Col>
              {hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" && (
                <Col sm={6} xs={12} className="mb-3">
                  <FileInput
                    label="สำเนากรมธรรม์เดิม (รองรับ .png, .jpg)"
                    onFileSelect={(file) => {
                      if (file) setVoluntaryInsuranceCarFile(file);
                    }}
                    accept=".jpg, .png"
                    // isInvalid={isInvalid && !voluntaryInsuranceCarFile}
                    alertText="กรุณาอัปโหลดสำเนากรมธรรม์เดิม"
                    initialFile={voluntaryInsuranceCarFile}
                  />
                </Col>
              )}
            </>
          )}
          {vehicleType === "รถจักรยานยนต์" && (
            <>
              <Col sm={6} xs={12} className="mb-3">
                <FileInput
                  label="เล่มทะเบียนรถ (รองรับ .png, .jpg)"
                  onFileSelect={(file) => {
                    if (file) setRegistrationBookInsuranceMotorcycleFile(file);
                  }}
                  accept=".jpg, .png"
                  // isInvalid={
                  //   isInvalid && !registrationBookInsuranceMotorcycleFile
                  // }
                  alertText="กรุณาอัปโหลดสำเนาหน้าเล่มทะเบียน"
                  initialFile={registrationBookInsuranceMotorcycleFile}
                />
              </Col>
              {hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" && (
                <Col sm={6} xs={12} className="mb-3">
                  <FileInput
                    label="สำเนากรมธรรม์เดิม (รองรับ .png, .jpg)"
                    onFileSelect={(file) => {
                      if (file) setVoluntaryInsuranceMotorcycleFile(file);
                    }}
                    accept=".jpg, .png"
                    // isInvalid={isInvalid && !voluntaryInsuranceMotorcycleFile}
                    alertText="กรุณาอัปโหลดสำเนากรมธรรม์เดิม"
                    initialFile={voluntaryInsuranceMotorcycleFile}
                  />
                </Col>
              )}
            </>
          )}
          {/* ส่วนการอัปโหลดไฟล์สำหรับหอพัก บ้าน */}
          {vehicleType === "หอพัก บ้าน" && (
            <>
              <Col sm={6} xs={12} className="mb-3">
                <FileInput
                  label="โฉนดที่ดิน (รองรับ .png, .jpg)"
                  onFileSelect={(file) => {
                    if (file) setTitleDeedFile(file);
                  }}
                  accept=".jpg, .png"
                  // isInvalid={isInvalid && !titleDeedFile}
                  alertText="กรุณาอัปโหลดสำเนาโฉนดที่ดิน"
                  initialFile={titleDeedFile}
                />
              </Col>
              <Col sm={6} xs={12} className="mb-3">
                <FileInput
                  label="สำเนาบัตรประชาชน (รองรับ .png, .jpg)"
                  onFileSelect={(file) => {
                    if (file) setNoIDcardFile(file);
                  }}
                  accept=".jpg, .png"
                  // isInvalid={isInvalid && !noIDcardFile}
                  alertText="กรุณาอัปโหลดสำเนาบัตรประชาชน"
                  initialFile={noIDcardFile}
                />
              </Col>
              {hasVoluntaryInsurance === "ยังมีประกันภัยภาคสมัครใจ" && (
                <Col sm={6} xs={12} className="mb-3">
                  <FileInput
                    label="สำเนากรมธรรม์เดิม (รองรับ .png, .jpg)"
                    onFileSelect={(file) => {
                      if (file) setVoluntaryInsuranceHouseFile(file);
                    }}
                    accept=".jpg, .png"
                    // isInvalid={isInvalid && !voluntaryInsuranceHouseFile}
                    alertText="กรุณาอัปโหลดสำเนากรมธรรม์เดิม"
                    initialFile={voluntaryInsuranceHouseFile}
                  />
                </Col>
              )}
            </>
          )}
        </Row>
      )}
    </div>
  );
};

export default InsuranceVehicleInfo;
