import React, { useEffect, useState } from "react"; // Importing React and useState
import { Col, Row } from "react-bootstrap";
import RadioButton from "../radioButton";
import TextInput from "../textInput";
import TextSelect from "../textSelect";

interface OwnerInfoProps {
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
}

const OwnerInfo: React.FC<OwnerInfoProps> = ({
  selectedRadio,
  setSelectedRadio,
  ownerData,
  setOwnerData,
  selectedCarType,
  setBikeTypeOrDoorCount,
  bikeTypeOrDoorCount,
  setIsFormValid,
  carOrMotorcycleLabel,
  setCarOrMotorcycleLabel,
}) => {
  const [isInvalidOwnerInfo, setInvalidOwnerInfo] = useState(false);

  // useEffect to reset bikeTypeOrDoorCount when selectedCarType changes
  useEffect(() => {
    // setBikeTypeOrDoorCount(null);

    if (selectedCarType) {
      const label =
        selectedCarType === "รถจักรยานยนต์"
          ? "ประเภทของรถมอเตอร์ไซค์"
          : "จำนวนประตูรถยนต์";
      setCarOrMotorcycleLabel(label); // Set label based on selectedCarType
    }
  }, [
    selectedCarType,
    setBikeTypeOrDoorCount,
    carOrMotorcycleLabel,
    setCarOrMotorcycleLabel,
  ]);

  // Function to handle changes in owner information
  const handleOwnerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let invalid = false;

    // Validate based on selected radio option
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
      const passportPattern = /^[A-Za-z0-9]{8,9}$/; // Passport pattern
      invalid = value.length > 0 && !passportPattern.test(value);
    }

    setOwnerData(value);
    setInvalidOwnerInfo(invalid);
    setIsFormValid(
      !invalid && !!selectedRadio && !!selectedCarType && !!bikeTypeOrDoorCount
    );
  };

  return (
    <>
      <Row>
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
            isValid={selectedRadio !== null}
          />
        </Col>
      </Row>
      <Row>
        <Col className="date-idNo-carType-Input mb-4" md={6} xs={6}>
          <TextInput
            label={
              selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                ? "กรอกหมายเลขบัตรประชาชน"
                : selectedRadio === "หมายเลขพาสปอร์ตเจ้าของรถล่าสุด"
                ? "กรอกหมายเลขบัตรประชาชน"
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
            onChange={handleOwnerInfoChange}
            isInvalid={isInvalidOwnerInfo}
            alertText={
              isInvalidOwnerInfo
                ? selectedRadio === "หมายเลขบัตรประชาชนเจ้าของรถล่าสุด"
                  ? ownerData.length < 13
                    ? "กรอกหมายเลขบัตรประชาชนให้ครบถ้วน"
                    : "หมายเลขบัตรประชาชนไม่ถูกต้อง"
                  : ownerData.length < 8
                  ? "กรอกหมายเลขพาสปอร์ตให้ครบถ้วน"
                  : "กรอกหมายเลขพาสปอร์ตให้ถูกต้อง"
                : ""
            }
            disabled={!selectedRadio}
            required
          />
        </Col>
        <Col className="date-idNo-carType-Input mb-4" md={6} xs={6}>
          <TextSelect
            value={bikeTypeOrDoorCount ?? ""}
            label={
              !selectedCarType ? "โปรดเลือกประเภทรถ" : carOrMotorcycleLabel
            }
            id="bikeTypeAdditional"
            options={
              selectedCarType === "รถจักรยานยนต์"
                ? ["รถส่วนบุคคล", "สาธารณะ", "รถพ่วง"]
                : ["2 ประตู", "4 ประตู"]
            }
            placeholder={
              !selectedCarType
                ? ""
                : selectedCarType === "รถจักรยานยนต์"
                ? "เลือกประเภท..."
                : "เลือกจำนวนประตู..."
            }
            onChange={setBikeTypeOrDoorCount}
            required
            isDisabled={!selectedCarType}
          />
        </Col>
      </Row>
    </>
  );
};

export default OwnerInfo;
