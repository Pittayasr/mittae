// OwnerInfo.tsx
import React, { useEffect, useState } from "react"; // Importing React and useState
import { Col, Row } from "react-bootstrap";
import RadioButton from "../textFillComponent/radioButton";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";

interface OwnerInfoProps {
  isInvalid: boolean;
  selectedRadio: string | null;
  setSelectedRadio: (value: string) => void;
  ownerData: string;
  setOwnerData: (value: string) => void;
  selectedCarType: string | null;
  setBikeTypeOrDoorCount: (value: string | null) => void;
  bikeTypeOrDoorCount: string | null;
  setIsFormValid: (isValid: boolean) => void;
  carOrMotorcycleLabel: string;
  setCarOrMotorcycleLabel: React.Dispatch<React.SetStateAction<string>>;
  onValidateOwnerInfo: (validations: { isInvalidOwnerInfo: boolean }) => void;
}

const OwnerInfo: React.FC<OwnerInfoProps> = ({
  isInvalid,
  selectedRadio,
  setSelectedRadio,
  ownerData,
  setOwnerData,
  selectedCarType,
  setBikeTypeOrDoorCount,
  bikeTypeOrDoorCount,
  // setIsFormValid,
  carOrMotorcycleLabel,
  setCarOrMotorcycleLabel,
  onValidateOwnerInfo,
}) => {
  const [isInvalidOwnerInfo, setInvalidOwnerInfo] = useState(false);

  useEffect(() => {
    if (selectedCarType) {
      // ตั้งค่าป้ายข้อความ
      const label =
        selectedCarType === "รถจักรยานยนต์"
          ? "ประเภทของรถจักรยานยนต์"
          : "จำนวนประตูรถยนต์";

      setCarOrMotorcycleLabel(label);

      // ล้างค่าเมื่อเปลี่ยนประเภท
      // setBikeTypeOrDoorCount(null); // ล้างค่า BikeTypeOrDoorCount
    }

    const validations = {
      isInvalidOwnerInfo,
    };

    onValidateOwnerInfo(validations);
  }, [
    selectedCarType,
    setBikeTypeOrDoorCount,
    carOrMotorcycleLabel,
    setCarOrMotorcycleLabel,
    isInvalidOwnerInfo,
    onValidateOwnerInfo,
  ]);

  const handleBikeTypeOrDoorCountChange = (value: string | null) => {
    setBikeTypeOrDoorCount(value); // อัปเดตจำนวนประตูหรือประเภทของมอเตอร์ไซค์
  };

  // Function to handle changes in owner information
  const handleOwnerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let invalid = false;

    if (selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด") {
      const idCardPattern = /^\d{13}$/; // ID card pattern
      invalid = value.length > 0 && !idCardPattern.test(value);

      if (!invalid) {
        // ตรวจสอบการคำนวณเลขหลักที่ 13
        const idArray = value.split("").map(Number); // แยกตัวเลขแต่ละหลัก
        let sum = 0;

        for (let i = 0; i < 12; i++) {
          sum += idArray[i] * (13 - i); // คูณเลขแต่ละหลักด้วยตำแหน่งที่สอดคล้อง
        }

        const checkDigit = (11 - (sum % 11)) % 10; // คำนวณเลขตรวจสอบ (หลักที่ 13)

        // ตรวจสอบว่าเลขหลักที่ 13 ตรงกับเลขตรวจสอบหรือไม่
        invalid = idArray[12] !== checkDigit;
      }
    } else if (selectedRadio === "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด") {
      const passportPattern = /^[A-Za-z0-9]{6,12}$/; 
      invalid = value.length > 0 && !passportPattern.test(value);
    }

    setOwnerData(value);
    setInvalidOwnerInfo(invalid);
    // setIsFormValid(
    //   !invalid && !!selectedRadio && !!selectedCarType && !!bikeTypeOrDoorCount
    // );
  };

  return (
    <>
      <Row>
        {/* เลือดประเภทข้อมูลของเจ้าของรถล่าสุด */}
        <Col className="mb-4" md={12} xs={12}>
          <RadioButton
            options={[
              "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด",
              "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด",
            ]}
            name="radioOptions"
            label="ประเภทข้อมูลเจ้าของรถ"
            selectedValue={selectedRadio}
            onChange={setSelectedRadio}
            isInvalid={isInvalid} // จะเป็น true เมื่อไม่มีการเลือกค่า
            alertText="กรุณาเลือกประเภทข้อมูลเจ้าของรถ" // ข้อความแจ้งเตือน
          />
        </Col>
      </Row>

      <Row>
        {/* ช่องกรอกตามประเภทข้อมูลของเจ้าของรถล่าสุด */}
        {selectedRadio && (
          <Col className="date-idNo-carType-Input mb-4 " sm={6} md={6} xs={12}>
            <TextInput
              label={
                selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                  ? "กรอกหมายเลขบัตรประชาชน"
                  : selectedRadio === "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด"
                  ? "กรอกหมายเลขพาสปอร์ต"
                  : "โปรดเลือกประเภทข้อมูลเจ้าของรถ"
              }
              placeholder={
                selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                  ? "กรอกหมายเลขบัตรประชาชน"
                  : selectedRadio === "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด"
                  ? "กรอกหมายเลขพาสปอร์ต"
                  : ""
              }
              id="ownerData"
              value={ownerData}
              type="numeric"
              onChange={handleOwnerInfoChange}
              isInvalid={isInvalidOwnerInfo || isInvalid}
              alertText={
                isInvalidOwnerInfo
                  ? selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                    ? ownerData.length < 13
                      ? "กรอกหมายเลขบัตรประชาชนให้ครบถ้วน"
                      : "หมายเลขบัตรประชาชนไม่ถูกต้อง"
                    : ownerData.length < 12
                    ? "กรอกหมายเลขพาสปอร์ตให้ครบถ้วน"
                    : "กรอกหมายเลขพาสปอร์ตให้ถูกต้อง"
                  : ""
              }
              disabled={!selectedRadio}
              required
            />
          </Col>
        )}

        {/* จำนวนประตูหรือประเภทของรถจักรยารยนต์ */}
        {selectedCarType && (
          <Col className="date-idNo-carType-Input mb-4" sm={6} md={6} xs={12}>
            <TextSelect
              value={bikeTypeOrDoorCount ?? null}
              label={
                !selectedCarType
                  ? "โปรดเลือกประเภทรถก่อน"
                  : carOrMotorcycleLabel
              }
              id="bikeTypeAdditional"
              options={
                selectedCarType === "รถจักรยานยนต์"
                  ? [
                      { label: "รถส่วนบุคคล", value: "รถส่วนบุคคล" },
                      { label: "รถสาธารณะ", value: "รถสาธารณะ" },
                      { label: "รถพ่วง", value: "รถพ่วง" },
                    ]
                  : [
                      { label: "2 ประตู", value: "2 ประตู" },
                      { label: "4 ประตู", value: "4 ประตู" },
                    ]
              }
              placeholder={
                !selectedCarType
                  ? ""
                  : selectedCarType === "รถจักรยานยนต์"
                  ? "เลือกประเภท..."
                  : "เลือกจำนวนประตู..."
              }
              onChange={handleBikeTypeOrDoorCountChange}
              required
              isInvalid={isInvalid}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default OwnerInfo;
